#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Simple translations for common phrases
const translations = {
    'Quick Assessment': 'Valutazione Rapida',
    'Client Conversation Guide': 'Guida Conversazione Cliente',
    'Machine Learning Opacity Trust': 'Fiducia nell\'Opacità del Machine Learning',
    'AI Hallucination Acceptance': 'Accettazione delle Allucinazioni AI',
    'Human-AI Team Dysfunction': 'Disfunzione Team Umano-AI',
    'AI Emotional Manipulation': 'Manipolazione Emotiva AI',
    'Algorithmic Fairness Blindness': 'Cecità all\'Equità Algoritmica',
    'Always/Usually': 'Sempre/Di solito',
    'Sometimes': 'Qualche volta',
    'Rarely/Never': 'Raramente/Mai',
    'No formal': 'Nessuna formale',
    'No defined procedure': 'Nessuna procedura definita',
    'No specific policy': 'Nessuna politica specifica',
    'No systematic': 'Nessun sistema',
    'No monitoring': 'Nessun monitoraggio',
    'No training': 'Nessuna formazione',
    'No formal controls': 'Nessun controllo formale',
    'No formal audit': 'Nessun audit formale',
    'staff expected to accept': 'il personale deve accettare',
    'regardless of understanding': 'indipendentemente dalla comprensione',
    'with documented verification processes': 'con processi di verifica documentati',
    'with inconsistent verification': 'con verifica inconsistente',
    'without verification': 'senza verifica',
    'focus primarily on features and cost': 'focus principalmente su funzionalità e costi',
    'decisions made on AI content directly': 'decisioni prese direttamente su contenuti AI',
    'share information conversationally': 'condividono informazioni in modo conversazionale',
    'as they would with coworkers': 'come farebbero con i colleghi',
    'treating AI as tools versus teammates': 'trattare l\'AI come strumenti vs compagni di squadra',
    'human-AI decision patterns': 'modelli di decisione umano-AI',
    'employees interact freely without oversight': 'i dipendenti interagiscono liberamente senza supervisione',
    'unaware if employees are developing AI dependence': 'inconsapevoli se i dipendenti stanno sviluppando dipendenza dall\'AI',
    'based on trust in AI': 'basate sulla fiducia nell\'AI',
    'professional boundary maintenance': 'mantenimento dei confini professionali',
    'assume AI systems are objective': 'presumono che i sistemi AI siano obiettivi',
    'focus solely on technical features': 'focus solo su caratteristiche tecniche',
    'dismissed as non-technical issues': 'respinte come problematiche non tecniche',
    'not relevant to security': 'non rilevanti per la sicurezza',
    'performance evaluation focuses solely on technical metrics': 'la valutazione delle prestazioni si concentra esclusivamente su metriche tecniche',
};

function translateText(text) {
    if (typeof text !== 'string') return text;

    let translated = text;
    for (const [en, it] of Object.entries(translations)) {
        const regex = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        translated = translated.replace(regex, it);
    }
    return translated;
}

function translateIndicator(enFile, itFile) {
    const en = JSON.parse(fs.readFileSync(enFile, 'utf8'));
    const it = JSON.parse(fs.readFileSync(itFile, 'utf8'));

    // Translate subtitle
    it.subtitle = translateText(en.subtitle);

    // Translate sections
    if (it.sections && Array.isArray(it.sections)) {
        it.sections.forEach((section, sIdx) => {
            if (en.sections && en.sections[sIdx]) {
                section.title = translateText(en.sections[sIdx].title);

                // Translate items
                if (section.items && Array.isArray(section.items)) {
                    section.items.forEach((item, iIdx) => {
                        if (en.sections[sIdx].items && en.sections[sIdx].items[iIdx]) {
                            const enItem = en.sections[sIdx].items[iIdx];

                            // Keep questions in English for now (too complex to auto-translate accurately)
                            // Just translate options
                            if (item.options && Array.isArray(item.options)) {
                                item.options.forEach((opt, oIdx) => {
                                    if (enItem.options && enItem.options[oIdx]) {
                                        opt.label = translateText(enItem.options[oIdx].label);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }

    return it;
}

const indicators = [
    { en: 'en-US/9.x-ai/indicator_9.6.json', it: 'it-IT/9.x-ai/indicator_9.6.json' },
    { en: 'en-US/9.x-ai/indicator_9.7.json', it: 'it-IT/9.x-ai/indicator_9.7.json' },
    { en: 'en-US/9.x-ai/indicator_9.8.json', it: 'it-IT/9.x-ai/indicator_9.8.json' },
    { en: 'en-US/9.x-ai/indicator_9.9.json', it: 'it-IT/9.x-ai/indicator_9.9.json' },
    { en: 'en-US/9.x-ai/indicator_9.10.json', it: 'it-IT/9.x-ai/indicator_9.10.json' },
];

console.log('Translating 9.6-9.10 to Italian...\n');

const basePath = 'auditor field kit/interactive';

indicators.forEach(({ en, it }) => {
    const enPath = path.join(basePath, en);
    const itPath = path.join(basePath, it);

    try {
        const translated = translateIndicator(enPath, itPath);
        fs.writeFileSync(itPath, JSON.stringify(translated, null, 2), 'utf8');

        const id = path.basename(it, '.json').replace('indicator_', '');
        console.log(`✅ ${id}: Translated`);
    } catch (error) {
        console.log(`❌ ${path.basename(it)}: ${error.message}`);
    }
});

console.log('\nDone!');
