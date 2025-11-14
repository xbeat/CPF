#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const fixes = {
    '4.8': {
        path: 'auditor field kit/interactive/it-IT/4.x-affective/indicator_4.8.json',
        replacements: [
            { path: 'sections[0].items[0].options[1].label',
              from: 'Occasionally - Some employees report workload stress but limited systematic monitoring',
              to: 'Occasionalmente - Alcuni dipendenti riportano stress da carico di lavoro ma monitoraggio sistematico limitato' },
            { path: 'sections[0].items[3].options[2].label',
              from: 'No mental health resources or stress management support available to employees',
              to: 'Nessuna risorsa di salute mentale o supporto gestione stress disponibile per i dipendenti' },
            { path: 'sections[0].items[4].options[2].label',
              from: 'No monitoring of behavioral warning signs or patterns indicating employee distress',
              to: 'Nessun monitoraggio di segnali di avvertimento comportamentali o pattern indicanti disagio dipendenti' },
            { path: 'sections[0].items[6].options[2].label',
              from: 'No assessment or adjustment - same security expectations maintained regardless of employee state',
              to: 'Nessuna valutazione o aggiustamento - stesse aspettative di sicurezza mantenute indipendentemente dallo stato del dipendente' },
        ]
    },
    '9.6': {
        path: 'auditor field kit/interactive/it-IT/9.x-ai/indicator_9.6.json',
        replacements: [
            { path: 'sections[0].items[6].options[2].label',
              from: /No recent failures identified.*$/,
              to: 'Nessun fallimento recente identificato (suggerisce mancanza di verifica), o fallimenti non documentati/analizzati' },
        ]
    },
    '9.7': {
        path: 'auditor field kit/interactive/it-IT/9.x-ai/indicator_9.7.json',
        replacements: [
            { path: 'sections[0].items[4].options[1].label',
              from: /Occasionally find errors.*$/,
              to: 'Qualche volta trovano errori attraverso revisione di routine ma nessun processo di rilevamento sistematico' },
            { path: 'sections[0].items[4].options[2].label',
              from: /Rarely discover AI errors.*$/,
              to: 'Raramente scoprono errori AI o non hanno modo sistematico di rilevarli' },
        ]
    },
    '9.9': {
        path: 'auditor field kit/interactive/it-IT/9.x-ai/indicator_9.9.json',
        replacements: [
            { path: 'sections[0].items[5].options[2].label',
              from: /No specific protocols.*$/,
              to: 'Nessun protocollo specifico, i dipendenti rispondono a richieste urgenti AI basate sulla fiducia nell\'AI' },
        ]
    },
    '9.10': {
        path: 'auditor field kit/interactive/it-IT/9.x-ai/indicator_9.10.json',
        replacements: [
            { path: 'sections[0].items[0].options[2].label',
              from: /Rarely or never test for bias.*$/,
              to: 'Raramente o mai testano per bias, presumono che i sistemi AI siano obiettivi' },
            { path: 'sections[0].items[1].options[2].label',
              from: /No fairness evaluation in procurement.*$/,
              to: 'Nessuna valutazione equità nel processo di approvvigionamento, focus solo su caratteristiche tecniche e costo' },
            { path: 'sections[0].items[4].options[2].label',
              from: /No fairness-specific monitoring.*$/,
              to: 'Nessun monitoraggio specifico equità, valutazione prestazioni si concentra esclusivamente su metriche tecniche' },
            { path: 'sections[0].items[5].options[2].label',
              from: /No specific AI bias training.*$/,
              to: 'Nessuna formazione specifica su bias AI, o problemi di bias non affrontati nella formazione sicurezza' },
        ]
    }
};

console.log('Fixing remaining English text in IT indicators...\n');

Object.entries(fixes).forEach(([id, config]) => {
    try {
        const json = JSON.parse(fs.readFileSync(config.path, 'utf8'));
        let modified = false;

        config.replacements.forEach(rep => {
            const pathParts = rep.path.match(/([^[\].]+)|\[(\d+)\]/g).map(p => p.replace(/[\[\]]/g, ''));

            let obj = json;
            for (let i = 0; i < pathParts.length - 1; i++) {
                obj = obj[pathParts[i]];
            }

            const lastKey = pathParts[pathParts.length - 1];
            const currentValue = obj[lastKey];

            if (typeof rep.from === 'string') {
                if (currentValue === rep.from) {
                    obj[lastKey] = rep.to;
                    modified = true;
                }
            } else if (rep.from instanceof RegExp) {
                if (rep.from.test(currentValue)) {
                    obj[lastKey] = rep.to;
                    modified = true;
                }
            }
        });

        if (modified) {
            fs.writeFileSync(config.path, JSON.stringify(json, null, 2), 'utf8');
            console.log(`✅ ${id}: Fixed`);
        } else {
            console.log(`⚪ ${id}: No changes needed`);
        }

    } catch (error) {
        console.log(`❌ ${id}: ${error.message}`);
    }
});

console.log('\nDone!');
