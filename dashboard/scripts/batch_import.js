#!/usr/bin/env node

/**
 * CPF Batch Import - Field Kit to Dashboard
 *
 * Scans folder of Field Kit exports and imports into dashboard
 * Generates auditing_results.json for progress tracking
 */

const fs = require('fs');
const path = require('path');

// Load Bayesian engine
const BAYESIAN = require('../bayesian.js');

// Configuration
const ALL_INDICATORS = [];
for (let cat = 1; cat <= 10; cat++) {
  for (let ind = 1; ind <= 10; ind++) {
    ALL_INDICATORS.push(`${cat}.${ind}`);
  }
}

const CATEGORY_NAMES = {
  1: 'authority', 2: 'temporal', 3: 'social', 4: 'affective', 5: 'cognitive',
  6: 'group', 7: 'stress', 8: 'unconscious', 9: 'ai', 10: 'convergent'
};

/**
 * Scan folder for Field Kit export files
 */
function scanExports(folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.error(`❌ Folder not found: ${folderPath}`);
    process.exit(1);
  }

  const files = fs.readdirSync(folderPath);
  const exports = [];

  files.forEach(file => {
    if (file.endsWith('.json') && file.includes('dashboard_export')) {
      const filePath = path.join(folderPath, file);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Validate structure
        if (data.organization_id && data.indicator_id && data.indicator_data) {
          exports.push({
            file: file,
            orgId: data.organization_id,
            orgName: data.organization_name || data.organization_id,
            indicatorId: data.indicator_id,
            data: data.indicator_data,
            metadata: data.metadata
          });
        } else {
          console.warn(`⚠️  Invalid format: ${file}`);
        }
      } catch (error) {
        console.warn(`⚠️  Error reading ${file}: ${error.message}`);
      }
    }
  });

  return exports;
}

/**
 * Group exports by organization
 */
function groupByOrganization(exports) {
  const byOrg = {};

  exports.forEach(exp => {
    if (!byOrg[exp.orgId]) {
      byOrg[exp.orgId] = {
        id: exp.orgId,
        name: exp.orgName,
        indicators: {},
        files: []
      };
    }

    byOrg[exp.orgId].indicators[exp.indicatorId] = exp.data;
    byOrg[exp.orgId].files.push(exp.file);
  });

  return byOrg;
}

/**
 * Calculate coverage statistics
 */
function calculateCoverage(orgData) {
  const completed = Object.keys(orgData.indicators);
  const missing = ALL_INDICATORS.filter(id => !completed.includes(id));

  const coverageByCategory = {};
  for (let cat = 1; cat <= 10; cat++) {
    const categoryIndicators = ALL_INDICATORS.filter(id => id.startsWith(`${cat}.`));
    const categoryCompleted = completed.filter(id => id.startsWith(`${cat}.`));

    coverageByCategory[CATEGORY_NAMES[cat]] = {
      total: categoryIndicators.length,
      completed: categoryCompleted.length,
      percentage: (categoryCompleted.length / categoryIndicators.length * 100).toFixed(1)
    };
  }

  return {
    total: ALL_INDICATORS.length,
    completed: completed.length,
    missing: missing.length,
    percentage: (completed.length / ALL_INDICATORS.length * 100).toFixed(1),
    completedList: completed.sort(),
    missingList: missing.sort(),
    byCategory: coverageByCategory
  };
}

/**
 * Generate auditing results JSON
 */
function generateAuditingResults(organizationData) {
  const results = {
    metadata: {
      version: '1.0',
      generated: new Date().toISOString(),
      total_organizations: Object.keys(organizationData).length,
      source: 'field_kit_batch_import'
    },
    organizations: {}
  };

  for (const [orgId, orgData] of Object.entries(organizationData)) {
    const coverage = calculateCoverage(orgData);

    // Calculate average risk across completed indicators
    const completedIndicators = Object.values(orgData.indicators);
    const avgRisk = completedIndicators.reduce((sum, ind) => {
      const humanValues = ind.human_values || [];
      const latestValue = humanValues[humanValues.length - 1]?.value || 0.5;
      return sum + latestValue;
    }, 0) / completedIndicators.length;

    results.organizations[orgId] = {
      name: orgData.name,
      coverage: coverage,
      average_risk: parseFloat(avgRisk.toFixed(3)),
      last_assessment: new Date().toISOString(),
      files_imported: orgData.files.length
    };
  }

  return results;
}

/**
 * Update or create organizations.json for main dashboard
 */
function updateOrganizationsJSON(organizationData, organizationsPath) {
  let orgsData;

  // Load existing or create new
  if (fs.existsSync(organizationsPath)) {
    orgsData = JSON.parse(fs.readFileSync(organizationsPath, 'utf8'));
  } else {
    orgsData = {
      metadata: {
        version: '1.0',
        generated: new Date().toISOString(),
        total_organizations: 0
      },
      organizations: {}
    };
  }

  // Merge Field Kit data
  for (const [orgId, orgData] of Object.entries(organizationData)) {
    if (!orgsData.organizations[orgId]) {
      // Create new organization
      orgsData.organizations[orgId] = {
        name: orgData.name,
        industry: 'Unknown',
        size: 'unknown',
        country: 'Unknown',
        indicators: {},
        aggregates: {
          overall_risk: 0.5,
          by_category: {},
          confidence: 0,
          trend: 'stable',
          last_calculated: new Date().toISOString()
        }
      };

      // Initialize all 100 indicators
      for (const indicatorId of ALL_INDICATORS) {
        orgsData.organizations[orgId].indicators[indicatorId] = {
          soc_values: [],
          human_values: [],
          current_bayesian: 0.5,
          last_updated: new Date().toISOString()
        };
      }
    }

    // Merge human assessments
    for (const [indicatorId, indicatorData] of Object.entries(orgData.indicators)) {
      const target = orgsData.organizations[orgId].indicators[indicatorId];

      // Add human values
      indicatorData.human_values.forEach(hv => {
        // Check if not duplicate
        const exists = target.human_values.some(existing =>
          existing.timestamp === hv.timestamp && existing.assessor === hv.assessor
        );

        if (!exists) {
          target.human_values.push(hv);
        }
      });

      // Recalculate Bayesian
      const merged = BAYESIAN.mergeIndicatorValues(target.soc_values, target.human_values);
      target.current_bayesian = merged.value;
      target.last_updated = new Date().toISOString();
    }

    // Recalculate aggregates
    const analysis = BAYESIAN.analyzeOrganization(orgsData.organizations[orgId]);
    orgsData.organizations[orgId].aggregates = {
      overall_risk: analysis.overall_risk,
      by_category: Object.fromEntries(
        Object.entries(analysis.by_category).map(([cat, data]) => [cat, data.value])
      ),
      confidence: analysis.confidence,
      trend: analysis.trend,
      last_calculated: new Date().toISOString()
    };
  }

  orgsData.metadata.total_organizations = Object.keys(orgsData.organizations).length;
  orgsData.metadata.generated = new Date().toISOString();

  return orgsData;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node batch_import.js <folder_path>');
    console.log('');
    console.log('Example: node batch_import.js ~/Downloads/field_kit_exports');
    process.exit(1);
  }

  const folderPath = args[0];

  console.log('🔧 CPF Batch Import - Field Kit to Dashboard\n');

  // Step 1: Scan folder
  console.log(`📁 Scanning: ${folderPath}`);
  const exports = scanExports(folderPath);
  console.log(`✓ Found ${exports.length} export files\n`);

  if (exports.length === 0) {
    console.log('⚠️  No Field Kit export files found.');
    console.log('   Export files should match pattern: dashboard_export_*.json');
    process.exit(0);
  }

  // Step 2: Group by organization
  const organizationData = groupByOrganization(exports);
  console.log(`🏢 Organizations found: ${Object.keys(organizationData).length}`);

  // Step 3: Calculate coverage
  console.log('');
  for (const [orgId, orgData] of Object.entries(organizationData)) {
    const coverage = calculateCoverage(orgData);
    console.log(`  ${orgId} (${orgData.name})`);
    console.log(`    ✓ Completed: ${coverage.completed}/${coverage.total} (${coverage.percentage}%)`);
    console.log(`    ✗ Missing: ${coverage.missing} indicators`);

    // Show category breakdown
    console.log('    Categories:');
    for (const [catName, catCov] of Object.entries(coverage.byCategory)) {
      const bar = '█'.repeat(Math.round(catCov.percentage / 10));
      console.log(`      ${catName.padEnd(12)} ${bar.padEnd(10)} ${catCov.percentage}%`);
    }
    console.log('');
  }

  // Step 4: Generate auditing results
  const auditingResults = generateAuditingResults(organizationData);
  const auditingPath = path.join(__dirname, '../data/auditing_results.json');
  fs.writeFileSync(auditingPath, JSON.stringify(auditingResults, null, 2));
  console.log(`✓ Generated: ${auditingPath}\n`);

  // Step 5: Update organizations.json
  const organizationsPath = path.join(__dirname, '../data/organizations.json');
  const orgsData = updateOrganizationsJSON(organizationData, organizationsPath);
  fs.writeFileSync(organizationsPath, JSON.stringify(orgsData, null, 2));
  console.log(`✓ Updated: ${organizationsPath}\n`);

  // Summary
  console.log('📊 Summary:');
  console.log(`   Total files processed: ${exports.length}`);
  console.log(`   Organizations: ${Object.keys(organizationData).length}`);
  console.log(`   Indicators imported: ${exports.length}`);
  console.log('');
  console.log('✨ Import complete!');
  console.log('');
  console.log('Next steps:');
  console.log('  1. View auditing progress: firefox dashboard_auditing.html');
  console.log('  2. View SOC+Bayesian analysis: firefox dashboard.html');
  console.log('');
}

// Run
try {
  main();
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
