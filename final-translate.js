const fs = require('fs');
const path = require('path');

const basePath = 'auditor field kit/interactive/it-IT';

// Helper to translate English to Italian
function translateText(text) {
  if (!text || typeof text !== 'string') return text;

  let result = text;

  // Question starters
  result = result
    .replace(/^How many /i, 'Quanti ')
    .replace(/^How often /i, 'Con quale frequenza ')
    .replace(/^How long /i, 'Quanto tempo ')
    .replace(/^How /i, 'Come ')
    .replace(/^What's /i, 'Qual è ')
    .replace(/^What /i, 'Cosa ')
    .replace(/^When /i, 'Quando ')
    .replace(/^Where /i, 'Dove ')
    .replace(/^Which /i, 'Quale ')
    .replace(/^Why /i, 'Perché ')
    .replace(/^Tell us about /i, 'Ci racconti ')
    .replace(/^Describe /i, 'Descriva ')
    .replace(/^Walk me through /i, 'Mi descriva ');

  // Common terms - more comprehensive
  const translations = {
    'your SOC team': 'il vostro team SOC',
    'your team': 'il vostro team',
    'your organization': 'la vostra organizzazione',
    'your': 'il vostro',
    'you': 'voi',
    'does': 'fa',
    'do': 'fate',
    'typically process': 'elabora tipicamente',
    'process': 'elaborano',
    'per hour': 'all\'ora',
    'during normal operations': 'durante operazioni normali',
    'alert volume': 'volume di alert',
    'became overwhelming': 'è diventato travolgente',
    'what specifically happened': 'cosa è successo specificatamente',
    'how did': 'come ha',
    'the last time': 'l\'ultima volta',
    'security alerts': 'alert di sicurezza',
    'security incidents': 'incidenti di sicurezza',
    'security team': 'team di sicurezza',
    'handle': 'gestisce',
    'handles': 'gestisce',
    'respond': 'rispondono',
    'responds': 'risponde',
    'following': 'successivi'
  };

  Object.entries(translations).forEach(([en, it]) => {
    const regex = new RegExp(en, 'gi');
    result = result.replace(regex, it);
  });

  return result;
}

// Process all 5.x and 7.x indicators
const categories = ['5.x-cognitive', '7.x-stress'];

let totalFixed = 0;

categories.forEach(category => {
  for (let i = 1; i <= 10; i++) {
    const indicatorNum = category.startsWith('5') ? 5 : 7;
    const filePath = path.join(basePath, category, `indicator_${indicatorNum}.${i}.json`);

    if (!fs.existsSync(filePath)) continue;

    try {
      const ind = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      let changed = false;

      // Translate conversation questions (sections[1].subsections[*].items[*])
      if (ind.sections && ind.sections[1] && ind.sections[1].subsections) {
        ind.sections[1].subsections.forEach(subsection => {
          if (subsection.items) {
            subsection.items.forEach(item => {
              // Translate main question text
              if (item.text && /^[A-Z]/.test(item.text) && item.text.length > 20) {
                const original = item.text;
                item.text = translateText(item.text);
                if (item.text !== original) changed = true;
              }

              // Translate followups
              if (item.followups && Array.isArray(item.followups)) {
                item.followups.forEach(followup => {
                  if (followup.text && /^[A-Z]/.test(followup.text) && followup.text.length > 20) {
                    const original = followup.text;
                    followup.text = translateText(followup.text);
                    if (followup.text !== original) changed = true;
                  }
                });
              }
            });
          }
        });
      }

      if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(ind, null, 2) + '\n', 'utf8');
        totalFixed++;
        console.log(`Fixed: ${category}/${path.basename(filePath)}`);
      }
    } catch (e) {
      console.error(`Error in ${filePath}: ${e.message}`);
    }
  }
});

console.log(`\nTotal files fixed: ${totalFixed}`);
