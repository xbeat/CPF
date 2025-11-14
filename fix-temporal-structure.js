#!/usr/bin/env node

const fs = require('fs');

// Convert old 4-section format to new 2-section format
function convert4to2Sections(indicator) {
  if (indicator.sections.length !== 4) {
    return indicator;
  }

  console.log(`  Converting 4 sections to 2 sections...`);

  const section0 = indicator.sections[0]; // VALUTAZIONE RAPIDA - keep as is
  const section1Conversation = indicator.sections[1]; // CONVERSAZIONE APPROFONDITA
  const section2RedFlags = indicator.sections[2]; // BANDIERE ROSSE
  const section3Scoring = indicator.sections[3]; // RIEPILOGO SCORING

  // Create new section 1 with subsections
  const newSection1 = {
    title: "CONVERSAZIONE CON IL CLIENTE",
    icon: "💬",
    type: "conversation",
    subsections: [
      {
        title: section1Conversation.title || "Conversazione Approfondita",
        items: section1Conversation.items || []
      },
      {
        title: section2RedFlags.title || "Bandiere Rosse Critiche",
        items: section2RedFlags.items || []
      },
      {
        title: "Scenari di Rischio",
        items: []
      },
      {
        title: section3Scoring.title || "Riepilogo Scoring",
        items: section3Scoring.items || []
      }
    ]
  };

  // Replace sections
  indicator.sections = [section0, newSection1];

  return indicator;
}

// Process all 2.x-temporal indicators
const indicators = [
  '2.1', '2.2', '2.3', '2.4', '2.5',
  '2.6', '2.7', '2.8', '2.9', '2.10'
];

indicators.forEach(id => {
  const filePath = `auditor field kit/interactive/it-IT/2.x-temporal/indicator_${id}.json`;

  console.log(`\n📄 Processing ${id}...`);

  const indicator = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const converted = convert4to2Sections(indicator);

  if (converted.sections.length === 2) {
    fs.writeFileSync(filePath, JSON.stringify(converted, null, 2) + '\n', 'utf8');
    console.log(`  ✅ Converted and saved`);
  } else {
    console.log(`  ℹ️  Already has 2 sections`);
  }
});

console.log(`\n✅ All 2.x-temporal indicators processed!`);
