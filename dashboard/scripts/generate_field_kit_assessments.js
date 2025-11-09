#!/usr/bin/env node

/**
 * CPF Synthetic Field Kit Assessments Generator
 *
 * Generates realistic Field Kit assessment exports (100 indicators)
 * Ready for batch import into dashboard
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  organization_id: 'org-demo',
  organization_name: 'Demo Organization Inc.',
  auditor: 'Demo Auditor',
  industry: 'Technology',
  size: 'enterprise'
};

// Industry bias profiles
const INDUSTRY_PROFILES = {
  Technology: { authority: 0.4, temporal: 0.6, social: 0.5, stress: 0.7 },
  Finance: { authority: 0.7, temporal: 0.8, social: 0.4, stress: 0.6 },
  Healthcare: { authority: 0.8, temporal: 0.7, social: 0.6, stress: 0.9 },
  Manufacturing: { authority: 0.6, temporal: 0.5, social: 0.7, stress: 0.5 },
  Retail: { authority: 0.5, temporal: 0.7, social: 0.8, stress: 0.6 }
};

// Size bias
const SIZE_BIAS = {
  small: -0.1,    // Smaller orgs tend to have less formal processes (lower risk in some areas)
  medium: 0,
  enterprise: 0.1 // Larger orgs have more complex dynamics
};

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(random(min, max + 1));
}

/**
 * Generate realistic score based on indicator category and org profile
 */
function generateScore(category, orgProfile, sizeBias) {
  const categoryNum = parseInt(category.split('.')[0]);
  const CATEGORY_NAMES = ['authority', 'temporal', 'social', 'affective', 'cognitive',
    'group', 'stress', 'unconscious', 'ai', 'convergent'];

  const categoryName = CATEGORY_NAMES[categoryNum - 1];
  const industryBias = orgProfile[categoryName] || 0.5;

  // Base score influenced by industry and size
  let baseScore = industryBias + sizeBias + random(-0.15, 0.15);

  // Clamp to [0, 1]
  return Math.max(0, Math.min(1, baseScore));
}

/**
 * Create Field Kit export JSON
 */
function createFieldKitExport(indicatorId, score) {
  const timestamp = new Date().toISOString();

  return {
    organization_id: CONFIG.organization_id,
    organization_name: CONFIG.organization_name,
    indicator_id: indicatorId,
    indicator_data: {
      soc_values: [],
      human_values: [
        {
          timestamp: timestamp,
          value: parseFloat(score.toFixed(3)),
          assessor: CONFIG.auditor,
          assessment_id: `fk-${Date.now()}-${indicatorId.replace('.', '')}`
        }
      ],
      current_bayesian: parseFloat(score.toFixed(3)),
      last_updated: timestamp
    },
    metadata: {
      exported_from: 'field_kit',
      export_timestamp: timestamp,
      field_kit_version: '1.0',
      synthetic_data: true
    }
  };
}

/**
 * Main generation
 */
function main() {
  console.log('🔧 Generating Synthetic Field Kit Assessments\n');

  const outputDir = path.join(__dirname, '../../field_kit_exports');

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  } else {
    // Clean existing files
    const existingFiles = fs.readdirSync(outputDir);
    existingFiles.forEach(file => {
      if (file.startsWith('dashboard_export_')) {
        fs.unlinkSync(path.join(outputDir, file));
      }
    });
  }

  console.log(`📁 Output directory: ${outputDir}\n`);

  // Get industry profile
  const industryProfile = INDUSTRY_PROFILES[CONFIG.industry] || INDUSTRY_PROFILES.Technology;
  const sizeBias = SIZE_BIAS[CONFIG.size] || 0;

  console.log(`🏢 Organization: ${CONFIG.organization_name}`);
  console.log(`   Industry: ${CONFIG.industry}`);
  console.log(`   Size: ${CONFIG.size}`);
  console.log(`   Auditor: ${CONFIG.auditor}\n`);

  let totalGenerated = 0;

  // Generate all 100 indicators
  for (let cat = 1; cat <= 10; cat++) {
    console.log(`  Generating Category ${cat}/10...`);

    for (let ind = 1; ind <= 10; ind++) {
      const indicatorId = `${cat}.${ind}`;
      const score = generateScore(indicatorId, industryProfile, sizeBias);
      const exportData = createFieldKitExport(indicatorId, score);

      const filename = `dashboard_export_${CONFIG.organization_id}_${indicatorId}_${Date.now()}.json`;
      const filepath = path.join(outputDir, filename);

      fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));
      totalGenerated++;

      // Small delay to ensure unique timestamps
      const delay = 1;
      const start = Date.now();
      while (Date.now() - start < delay) { }
    }
  }

  console.log(`\n✅ Generated ${totalGenerated} Field Kit assessments`);
  console.log(`📂 Location: ${outputDir}\n`);

  // Calculate stats
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.json'));
  const totalSize = files.reduce((sum, file) => {
    return sum + fs.statSync(path.join(outputDir, file)).size;
  }, 0);

  console.log(`📊 Statistics:`);
  console.log(`   Files: ${files.length}`);
  console.log(`   Total size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`   Avg size: ${(totalSize / files.length / 1024).toFixed(2)} KB per file\n`);

  console.log('🚀 Next steps:');
  console.log(`   1. Import to dashboard:`);
  console.log(`      cd dashboard/scripts`);
  console.log(`      node batch_import.js ../../field_kit_exports\n`);
  console.log(`   2. View auditing progress:`);
  console.log(`      cd dashboard`);
  console.log(`      python3 -m http.server 8000`);
  console.log(`      Open: http://localhost:8000/dashboard_auditing.html\n`);
  console.log(`   3. View SOC+Bayesian analysis:`);
  console.log(`      Open: http://localhost:8000/dashboard.html\n`);

  console.log('✨ Demo complete!\n');
}

// Run
try {
  main();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
