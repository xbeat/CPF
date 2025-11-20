#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Import calculateAggregates from db_json.js (includes maturity model calculation)
const { calculateAggregates } = require('../lib/db_json');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ORGS_DIR = path.join(DATA_DIR, 'organizations');
const INDEX_FILE = path.join(DATA_DIR, 'organizations_index.json');

// Helper function to normalize organization name for ID
function normalizeOrgName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with dash
    .replace(/^-|-$/g, '');        // Remove leading/trailing dashes
}

const DEMO_ORGANIZATIONS = [
  {
    id: 'techcorp-global', // normalized from "TechCorp Global"
    name: 'TechCorp Global',
    industry: 'Technology',
    size: 'enterprise',
    country: 'US',
    language: 'en-US',
    created_by: 'System',
    notes: 'Large technology company with global operations',
    sede_sociale: '100 Innovation Drive, San Francisco, CA 94105',
    partita_iva: 'US12-3456789'
  },
  {
    id: 'financefirst-bank', // normalized from "FinanceFirst Bank"
    name: 'FinanceFirst Bank',
    industry: 'Finance',
    size: 'enterprise',
    country: 'GB',
    language: 'en-US',
    created_by: 'System',
    notes: 'International banking institution',
    sede_sociale: '25 Bank Street, London, E14 5JP',
    partita_iva: 'GB123456789'
  },
  {
    id: 'healthplus-clinic', // normalized from "HealthPlus Clinic"
    name: 'HealthPlus Clinic',
    industry: 'Healthcare',
    size: 'medium',
    country: 'IT',
    language: 'it-IT',
    created_by: 'System',
    notes: 'Regional healthcare provider',
    sede_sociale: 'Via della Salute 15, 00185 Roma (RM)',
    partita_iva: 'IT12345678901'
  },
  {
    id: 'retailmax-store', // normalized from "RetailMax Store"
    name: 'RetailMax Store',
    industry: 'Retail',
    size: 'small',
    country: 'DE',
    language: 'de-DE',
    created_by: 'System',
    notes: 'Retail chain with e-commerce platform',
    sede_sociale: 'Marktstraße 42, 10117 Berlin',
    partita_iva: 'DE123456789'
  },
  {
    id: 'edulearn-academy', // normalized from "EduLearn Academy"
    name: 'EduLearn Academy',
    industry: 'Education',
    size: 'medium',
    country: 'FR',
    language: 'fr-FR',
    created_by: 'System',
    notes: 'Online education platform',
    sede_sociale: '8 Rue de l\'Éducation, 75001 Paris',
    partita_iva: 'FR12345678901'
  }
];

const ASSESSORS = ['Alice Johnson', 'Bob Smith', 'Carlo Rossi', 'Diana Chen', 'Emma Garcia'];
const CATEGORY_NAMES = {
  '1': 'Authority-Based Vulnerabilities',
  '2': 'Temporal-Based Vulnerabilities',
  '3': 'Social-Based Vulnerabilities',
  '4': 'Affective-Based Vulnerabilities',
  '5': 'Cognitive-Based Vulnerabilities',
  '6': 'Group-Based Vulnerabilities',
  '7': 'Stress-Based Vulnerabilities',
  '8': 'Unconscious-Based Vulnerabilities',
  '9': 'AI-Enhanced Vulnerabilities',
  '10': 'Convergent Vulnerabilities'
};

function randomBetween(min, max) { return Math.random() * (max - min) + min; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomChoice(array) { return array[Math.floor(Math.random() * array.length)]; }
function randomDateLastNDays(days) {
  const now = new Date();
  const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  return new Date(randomTime).toISOString();
}

function generateAllIndicatorIds() {
  const indicators = [];
  for (let category = 1; category <= 10; category++) {
    for (let num = 1; num <= 10; num++) {
      indicators.push(`${category}.${num}`);
    }
  }
  return indicators;
}

function generateRandomIndicatorSubset() {
  const allIndicators = generateAllIndicatorIds();
  const numAssessments = randomInt(30, 70);
  const shuffled = allIndicators.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numAssessments);
}

function generateBayesianScore() {
  const rand = Math.random();
  if (rand < 0.2) return randomBetween(0.1, 0.3);
  else if (rand < 0.7) return randomBetween(0.3, 0.7);
  else return randomBetween(0.7, 0.95);
}

function generateConfidence() { return randomBetween(0.7, 0.95); }
function generateMaturityLevel(score) {
  if (score < 0.3) return 'green';
  if (score < 0.7) return 'yellow';
  return 'red';
}

// Cache for loaded Field Kit JSONs
const fieldKitCache = {};

function loadFieldKitForIndicator(indicatorId, language) {
  const cacheKey = `${indicatorId}_${language}`;
  if (fieldKitCache[cacheKey]) return fieldKitCache[cacheKey];

  const [categoryNum] = indicatorId.split('.');
  const categoryMap = {'1':'authority','2':'temporal','3':'social','4':'affective','5':'cognitive','6':'group','7':'stress','8':'unconscious','9':'ai','10':'convergent'};
  const categoryName = categoryMap[categoryNum];

  const fieldKitPath = path.join(__dirname, '..', '..', 'auditor field kit', 'interactive', language, `${categoryNum}.x-${categoryName}`, `indicator_${indicatorId}.json`);

  try {
    if (fs.existsSync(fieldKitPath)) {
      fieldKitCache[cacheKey] = JSON.parse(fs.readFileSync(fieldKitPath, 'utf8'));
      return fieldKitCache[cacheKey];
    }
  } catch (err) {
    // Error reading file, try fallback
  }

  // Fallback to en-US if requested language not available
  if (language !== 'en-US') {
    const fallbackCacheKey = `${indicatorId}_en-US`;
    if (fieldKitCache[fallbackCacheKey]) return fieldKitCache[fallbackCacheKey];

    const fallbackPath = path.join(__dirname, '..', '..', 'auditor field kit', 'interactive', 'en-US', `${categoryNum}.x-${categoryName}`, `indicator_${indicatorId}.json`);

    try {
      if (fs.existsSync(fallbackPath)) {
        fieldKitCache[fallbackCacheKey] = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
        // Cache under both keys (original language and en-US)
        fieldKitCache[cacheKey] = fieldKitCache[fallbackCacheKey];
        return fieldKitCache[fallbackCacheKey];
      }
    } catch (err) {
      // Fallback also failed
    }
  }

  return null;
}

function generateRawData(indicatorId, language, targetMaturityLevel = null) {
  const fieldKit = loadFieldKitForIndicator(indicatorId, language);
  const responses = {};
  const quickAssessmentBreakdown = [];
  let totalWeightedScore = 0;
  let totalWeight = 0;

  // If Field Kit doesn't exist for this language, return null
  if (!fieldKit) {
    return null;
  }

  // Determine target score range based on maturity level
  let targetScoreRange = [0, 1]; // default: any score
  if (targetMaturityLevel === 'green') {
    targetScoreRange = [0, 0.3];
  } else if (targetMaturityLevel === 'yellow') {
    targetScoreRange = [0.3, 0.7];
  } else if (targetMaturityLevel === 'red') {
    targetScoreRange = [0.7, 1.0];
  }

  // Generate responses from actual Field Kit structure and CALCULATE real score
  if (fieldKit && fieldKit.sections) {
    const quickSection = fieldKit.sections.find(s => s.id === 'quick-assessment');
    if (quickSection && quickSection.items) {
      quickSection.items.forEach(item => {
        if (item.options && item.options.length > 0) {
          // Choose option based on target maturity level
          let selectedOption;
          if (targetMaturityLevel) {
            // Filter options within target range and pick one
            const targetOptions = item.options.filter(opt =>
              opt.score >= targetScoreRange[0] && opt.score <= targetScoreRange[1]
            );
            selectedOption = targetOptions.length > 0 ? randomChoice(targetOptions) : randomChoice(item.options);
          } else {
            selectedOption = randomChoice(item.options);
          }

          responses[item.id] = selectedOption.value;

          const weight = item.weight || (1 / quickSection.items.length);
          const weightedScore = selectedOption.score * weight;

          quickAssessmentBreakdown.push({
            question: item.title,
            response: selectedOption.label,
            score: parseFloat(selectedOption.score.toFixed(4)),
            weight: parseFloat(weight.toFixed(4)),
            weighted_score: parseFloat(weightedScore.toFixed(4))
          });

          // Accumulate for weighted average (like client does)
          totalWeightedScore += weightedScore;
          totalWeight += weight;
        }
      });
    }

    // Generate some conversation responses
    const convSection = fieldKit.sections.find(s => s.id === 'client-conversation' || s.title.toLowerCase().includes('conversation'));
    if (convSection) {
      if (convSection.subsections) {
        convSection.subsections.forEach((sub, subIdx) => {
          if (sub.items) {
            sub.items.forEach((item, iIdx) => {
              if (item.type === 'question' && item.followups) {
                item.followups.forEach((followup, fIdx) => {
                  const followupId = `${item.id}_f${fIdx}`;
                  responses[followupId] = `Sample answer for: ${followup.text.substring(0, 50)}...`;
                });
              }
            });
          }
        });
      } else if (convSection.items) {
        convSection.items.forEach((item, iIdx) => {
          if (item.type === 'question' && item.followups) {
            item.followups.forEach((followup, fIdx) => {
              const followupId = `${item.id}_f${fIdx}`;
              responses[followupId] = `Sample answer for: ${followup.text.substring(0, 50)}...`;
            });
          }
        });
      }
    }
  }

  // Calculate quick_assessment as WEIGHTED AVERAGE (like client does)
  const quickAssessmentScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

  // GENERATE RED FLAGS from Field Kit (like client does - client-integrated.js:1156-1207)
  const redFlags = [];
  let redFlagsScore = 0;

  // Determine red flag probability based on target maturity level
  let redFlagProbability = 0.30; // default
  if (targetMaturityLevel === 'green') {
    redFlagProbability = 0.10; // Very low chance of red flags for green
  } else if (targetMaturityLevel === 'yellow') {
    redFlagProbability = 0.30; // Medium chance for yellow
  } else if (targetMaturityLevel === 'red') {
    redFlagProbability = 0.60; // High chance for red
  }

  // Scan ALL sections and subsections to find items with severity
  if (fieldKit && fieldKit.sections) {
    fieldKit.sections.forEach((section) => {
      // Check direct items
      if (section.items && Array.isArray(section.items)) {
        section.items.forEach((item) => {
          if (item.severity && item.id) {
            // Check based on target maturity level
            const isChecked = Math.random() < redFlagProbability;
            responses[item.id] = isChecked;

            if (isChecked) {
              const impact = item.score_impact || item.weight || 0.1;
              redFlagsScore += impact;
              redFlags.push({
                flag: item.label || item.title || item.description,
                impact: impact
              });
            }
          }
        });
      }

      // Check subsection items
      if (section.subsections && Array.isArray(section.subsections)) {
        section.subsections.forEach((subsection) => {
          if (subsection.items && Array.isArray(subsection.items)) {
            subsection.items.forEach((item) => {
              if (item.severity && item.id) {
                const isChecked = Math.random() < redFlagProbability;
                responses[item.id] = isChecked;

                if (isChecked) {
                  const impact = item.score_impact || item.weight || 0.1;
                  redFlagsScore += impact;
                  redFlags.push({
                    flag: item.label || item.title || item.description,
                    impact: impact
                  });
                }
              }
            });
          }
        });
      }
    });
  }

  // Cap red flags score at 1.0 (like client does)
  redFlagsScore = Math.min(redFlagsScore, 1.0);

  // Use FIXED weights like client does (NOT Field Kit weights!)
  const QUICK_WEIGHT = 0.70;
  const RED_FLAGS_WEIGHT = 0.30;

  // Calculate FINAL score using client formula
  const finalScore = (quickAssessmentScore * QUICK_WEIGHT) + (redFlagsScore * RED_FLAGS_WEIGHT);
  const maturityLevel = generateMaturityLevel(finalScore);

  const scores = {
    quick_assessment: parseFloat(quickAssessmentScore.toFixed(4)),
    conversation_depth: 0,
    red_flags: parseFloat(redFlagsScore.toFixed(4)),
    final_score: parseFloat(finalScore.toFixed(4)),
    maturity_level: maturityLevel,
    weights_used: {
      quick_assessment: QUICK_WEIGHT,
      red_flags: RED_FLAGS_WEIGHT,
      conversation_depth: 0
    }
  };

  const metadata = {
    date: randomDateLastNDays(90).split('T')[0],
    auditor: randomChoice(ASSESSORS),
    client: '',
    status: randomChoice(['completed', 'in-progress', 'review']),
    notes: `Assessment notes for indicator ${indicatorId}. Organization shows ${randomChoice(['strong', 'moderate', 'weak'])} controls.`
  };

  return {
    fieldKit: fieldKit, // Include FULL Field Kit structure for card editing
    quick_assessment: quickAssessmentBreakdown,
    client_conversation: {
      responses: responses,
      scores: scores,
      metadata: metadata,
      notes: metadata.notes,
      red_flags: redFlags
    },
    calculatedScore: finalScore // Return calculated score for assessment
  };
}

function generateAssessment(indicatorId, language) {
  // Choose target maturity level for balanced distribution (33% each)
  const rand = Math.random();
  let targetMaturityLevel;
  if (rand < 0.33) {
    targetMaturityLevel = 'green';
  } else if (rand < 0.66) {
    targetMaturityLevel = 'yellow';
  } else {
    targetMaturityLevel = 'red';
  }

  const rawData = generateRawData(indicatorId, language, targetMaturityLevel);

  // Skip this assessment if Field Kit doesn't exist for language
  if (!rawData) {
    return null;
  }

  // Use CALCULATED score from raw_data
  const bayesianScore = rawData.calculatedScore;
  const confidence = generateConfidence();
  const maturityLevel = generateMaturityLevel(bayesianScore);
  const assessor = randomChoice(ASSESSORS);
  const assessmentDate = randomDateLastNDays(90);

  // Remove calculatedScore from raw_data before saving
  const { calculatedScore, ...cleanRawData } = rawData;

  const [category] = indicatorId.split('.');
  return {
    indicator_id: indicatorId,
    title: `Indicator ${indicatorId} Title`,
    category: CATEGORY_NAMES[category],
    bayesian_score: parseFloat(bayesianScore.toFixed(4)),
    confidence: parseFloat(confidence.toFixed(4)),
    maturity_level: maturityLevel,
    assessor: assessor,
    assessment_date: assessmentDate,
    raw_data: cleanRawData
  };
}

// calculateAggregates function removed - now imported from db_json.js
// This ensures maturity model is calculated properly

function generateOrganization(orgConfig) {
  const createdAt = new Date().toISOString();
  const indicatorsToAssess = generateRandomIndicatorSubset();
  const assessments = {};

  // Generate assessments using organization's language
  for (const indicatorId of indicatorsToAssess) {
    const assessment = generateAssessment(indicatorId, orgConfig.language);
    if (assessment) {
      assessments[indicatorId] = assessment;
    }
    // Skip if Field Kit doesn't exist for this language
  }

  // Use calculateAggregates from db_json.js which includes maturity model calculation
  const aggregates = calculateAggregates(assessments, orgConfig.industry);
  const orgData = { id: orgConfig.id, name: orgConfig.name, metadata: { industry: orgConfig.industry, size: orgConfig.size, country: orgConfig.country, language: orgConfig.language, created_at: createdAt, updated_at: createdAt, created_by: orgConfig.created_by, notes: orgConfig.notes }, assessments: assessments, aggregates: aggregates };
  return orgData;
}

function ensureDirectoryExists(dirPath) { if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true }); }
function writeJsonFile(filePath, data) { fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8'); }

async function generateDemoOrganizations() {
  const generatedOrgsData = []; // Data to return
  if (require.main === module) {
    console.log('\n🌱 CPF Demo Organizations Generator\n');
    console.log('='.repeat(60));
    ensureDirectoryExists(DATA_DIR);
    ensureDirectoryExists(ORGS_DIR);
  }

  let organizationsIndex;
  if (fs.existsSync(INDEX_FILE)) {
    if (require.main === module) console.log('📂 Loading existing organizations index...');
    const existingData = fs.readFileSync(INDEX_FILE, 'utf8');
    organizationsIndex = JSON.parse(existingData);
    if (require.main === module) console.log(`   Found ${organizationsIndex.organizations.length} existing organizations\n`);
  } else {
    if (require.main === module) console.log('📂 Creating new organizations index...\n');
    organizationsIndex = { metadata: { version: '2.0', last_updated: new Date().toISOString(), total_organizations: 0 }, organizations: [] };
  }

  const existingOrgsMap = new Map(organizationsIndex.organizations.map(org => [org.id, org]));
  let totalAssessments = 0, addedCount = 0, skippedCount = 0;

  for (const orgConfig of DEMO_ORGANIZATIONS) {
    if (require.main === module) {
      console.log(`\n📊 Processing: ${orgConfig.name}`);
      console.log('-'.repeat(60));
    }

    if (existingOrgsMap.has(orgConfig.id) && require.main === module) {
      console.log(`   ⏭️  SKIPPED: Organization "${orgConfig.id}" already exists`);
      skippedCount++;
      const orgData = generateOrganization(orgConfig);
      generatedOrgsData.push(orgData);
      continue;
    }

    const orgData = generateOrganization(orgConfig);
    generatedOrgsData.push(orgData);

    if (require.main === module) {
      const orgFilePath = path.join(ORGS_DIR, `${orgConfig.id}.json`);
      writeJsonFile(orgFilePath, orgData);
      console.log(`   ✓ Saved: ${orgFilePath}`);

      const indexEntry = { id: orgData.id, name: orgData.name, industry: orgData.metadata.industry, size: orgData.metadata.size, country: orgData.metadata.country, language: orgData.metadata.language, created_at: orgData.metadata.created_at, updated_at: orgData.metadata.updated_at, stats: { total_assessments: orgData.aggregates.completion.assessed_indicators, completion_percentage: orgData.aggregates.completion.percentage, overall_risk: orgData.aggregates.overall_risk, avg_confidence: orgData.aggregates.overall_confidence, last_assessment_date: Object.values(orgData.assessments).sort((a, b) => new Date(b.assessment_date) - new Date(a.assessment_date))[0]?.assessment_date } };
      organizationsIndex.organizations.push(indexEntry);
      addedCount++;
      totalAssessments += orgData.aggregates.completion.assessed_indicators;

      console.log(`   📈 Stats:`);
      console.log(`      - Assessments: ${orgData.aggregates.completion.assessed_indicators} / 100`);
      console.log(`      - Completion: ${orgData.aggregates.completion.percentage}%`);
      console.log(`      - Overall Risk: ${orgData.aggregates.overall_risk} (${getRiskLabel(orgData.aggregates.overall_risk)})`);
      console.log(`      - Avg Confidence: ${orgData.aggregates.overall_confidence}`);
    }
  }

  if (require.main === module) {
    organizationsIndex.metadata.last_updated = new Date().toISOString();
    organizationsIndex.metadata.total_organizations = organizationsIndex.organizations.length;
    writeJsonFile(INDEX_FILE, organizationsIndex);
    console.log(`\n✓ Saved index: ${INDEX_FILE}`);

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Generation completed!\n');
    console.log(`📊 Summary:`);
    console.log(`   - Organizations added: ${addedCount}`);
    console.log(`   - Organizations skipped (already exist): ${skippedCount}`);
    console.log(`   - Total organizations in database: ${organizationsIndex.organizations.length}`);
    console.log(`   - New assessments generated: ${totalAssessments}`);
    if (addedCount > 0) console.log(`   - Average assessments per new org: ${Math.round(totalAssessments / addedCount)}`);
    console.log();

    console.log('📋 Organizations:');
    console.log('-'.repeat(60));
    for (const org of organizationsIndex.organizations) {
      const riskLabel = getRiskLabel(org.stats.overall_risk);
      console.log(`   ${org.id}: ${org.name}`);
      console.log(`      ${org.industry} | ${org.size} | ${org.country}`);
      console.log(`      Risk: ${riskLabel} (${org.stats.overall_risk}) | Completion: ${org.stats.completion_percentage}%`);
      console.log();
    }
    console.log('✅ Files ready in:');
    console.log(`   ${DATA_DIR}/organizations_index.json`);
    console.log(`   ${ORGS_DIR}/techcorp-global.json`);
    console.log(`   ${ORGS_DIR}/financefirst-bank.json`);
    console.log(`   ${ORGS_DIR}/healthplus-clinic.json`);
    console.log(`   ${ORGS_DIR}/retailmax-store.json`);
    console.log(`   ${ORGS_DIR}/edulearn-academy.json`);
    console.log();
  }

  return generatedOrgsData;
}

function getRiskLabel(score) {
  if (score < 0.3) return '🟢 LOW';
  if (score < 0.7) return '🟡 MEDIUM';
  return '🔴 HIGH';
}

if (require.main === module) {
  generateDemoOrganizations()
    .then(() => {
      console.log('✅ Demo organizations generated successfully!\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error generating organizations:', error);
      process.exit(1);
    });
}

module.exports = { generateDemoOrganizations, generateOrganization };
