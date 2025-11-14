const fs = require('fs');
const path = require('path');

const basePath = 'auditor field kit/interactive/it-IT';
const files = [
  ...Array.from({length: 10}, (_, i) => path.join(basePath, '5.x-cognitive', `indicator_5.${i+1}.json`)),
  ...Array.from({length: 10}, (_, i) => path.join(basePath, '7.x-stress', `indicator_7.${i+1}.json`))
];

let totalFixed = 0;

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;

  try {
    const ind = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changed = false;

    // Translate questions
    if (ind.sections && ind.sections[0] && ind.sections[0].items) {
      ind.sections[0].items.forEach(item => {
        if (item.question && /^(When|What|Where|Which|Why|Do|Does|Are|Is|Has|Have)/.test(item.question)) {
          // Common question starters
          item.question = item.question
            .replace(/^When /i, 'Quando ')
            .replace(/^What's /i, 'Qual è ')
            .replace(/^What /i, 'Cosa ')
            .replace(/^Where /i, 'Dove ')
            .replace(/^Which /i, 'Quale ')
            .replace(/^Why /i, 'Perché ')
            .replace(/^Do /i, 'Fate ')
            .replace(/^Does /i, 'Fa ')
            .replace(/^Are /i, 'Sono ')
            .replace(/^Is /i, 'È ')
            .replace(/^Has /i, 'Ha ')
            .replace(/^Have /i, 'Avete ');

          // Common terms in questions
          item.question = item.question
            .replace(/ your process /gi, ' il vostro processo ')
            .replace(/ your /gi, ' il vostro ')
            .replace(/ how /gi, ' come ')
            .replace(/ often /gi, ' spesso ')
            .replace(/ you /gi, ' voi ')
            .replace(/ discover /gi, ' scoprite ')
            .replace(/ identify /gi, ' identificate ')
            .replace(/ testing /gi, ' testando ')
            .replace(/ understand /gi, ' comprendano ')
            .replace(/ work /gi, ' funzionano ')
            .replace(/ after /gi, ' dopo ')
            .replace(/ training /gi, ' formazione ')
            .replace(/ whether /gi, ' se ')
            .replace(/ employees /gi, ' dipendenti ')
            .replace(/ someone /gi, ' qualcuno ')
            .replace(/ misunderstanding /gi, ' malinteso ')
            .replace(/ misunderstood /gi, ' frainteso ')
            .replace(/ how /gi, ' come ')
            .replace(/ security systems /gi, ' sistemi di sicurezza ')
            .replace(/ security incidents /gi, ' incidenti di sicurezza ')
            .replace(/ occur /gi, ' si verificano ')
            .replace(/ root cause /gi, ' causa radice ')
            .replace(/ involved /gi, ' coinvolgeva ');

          changed = true;
        }

        // Translate option labels
        if (item.options) {
          item.options.forEach(opt => {
            if (opt.label && /^[A-Z]/.test(opt.label) && opt.label.includes(' ')) {
              opt.label = opt.label
                .replace(/^Never /i, 'Mai ')
                .replace(/^Rarely /i, 'Raramente ')
                .replace(/^Sometimes /i, 'Talvolta ')
                .replace(/^Often /i, 'Spesso ')
                .replace(/^Always /i, 'Sempre ')
                .replace(/^None /i, 'Nessuno ')
                .replace(/^Few /i, 'Pochi ')
                .replace(/^Some /i, 'Alcuni ')
                .replace(/^Many /i, 'Molti ')
                .replace(/^Most /i, 'Maggior parte ')
                .replace(/^All /i, 'Tutti ')
                .replace(/ identify/gi, ' identificano')
                .replace(/ documented/gi, ' documentati')
                .replace(/ misunderstandings/gi, ' malintesi');

              changed = true;
            }
          });
        }
      });
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(ind, null, 2) + '\n', 'utf8');
      totalFixed++;
      console.log('Fixed: ' + path.basename(filePath));
    }
  } catch (e) {
    console.error('Error: ' + e.message);
  }
});

console.log('\nTotal files fixed: ' + totalFixed);
