#!/usr/bin/env node

/**
 * CPF Database Seed Script (Agnostico)
 * Genera dati demo per 5 organizzazioni con valutazioni casuali.
 * Funziona con JSON, SQLite, o PostgreSQL in base alla configurazione.
 *
 * Uso: node dashboard/scripts/seed_demo.js
 */

// Importa il "Direttore d'Orchestra" che sa quale DB usare
const dataManager = require('../lib/dataManager');

// ============================================================================
// Dati di Demo (invariati)
// ============================================================================

const DEMO_ORGANIZATIONS = [
    { id: 'org-demo-001', name: 'TechCorp Global', industry: 'Technology', size: 'enterprise', country: 'US' },
    { id: 'org-demo-002', name: 'FinanceFirst Bank', industry: 'Finance', size: 'enterprise', country: 'GB' },
    { id: 'org-demo-003', name: 'HealthPlus Clinic', industry: 'Healthcare', size: 'medium', country: 'IT' },
    { id: 'org-demo-004', name: 'RetailMax Store', industry: 'Retail', size: 'small', country: 'DE' },
    { id: 'org-demo-005', name: 'EduLearn Academy', industry: 'Education', size: 'medium', country: 'FR' },
];

// ... (tutte le funzioni helper per generare dati casuali rimangono le stesse)
// randomBetween, randomInt, randomChoice, ecc.

// ============================================================================
// Funzioni Principali per il Seeding
// ============================================================================

async function seedDatabase() {
    console.log('\n🌱 Inizio del Seeding del Database CPF...\n');
    
    try {
        // Itera su ogni organizzazione di demo
        for (const orgData of DEMO_ORGANIZATIONS) {
            console.log(`📊 Elaborazione di: ${orgData.name}`);

            // 1. CREA L'ORGANIZZAZIONE
            // Usa dataManager.createOrganization, che funzionerà per qualsiasi DB.
            // Nota: La funzione `createOrganization` deve essere implementata in db_sqlite e db_postgres.
            // Per ora, questo funzionerà solo con il backend JSON.
            await dataManager.createOrganization(orgData);

            console.log(`   ✓ Organizzazione creata: ${orgData.id}`);

            // 2. GENERA E SALVA LE VALUTAZIONI
            const indicatorsToAssess = generateRandomIndicatorSubset(); // Funzione helper invariata
            console.log(`   ✓ Generazione di ${indicatorsToAssess.length} valutazioni...`);

            for (const indicatorId of indicatorsToAssess) {
                const assessmentData = {
                    bayesian_score: generateBayesianScore().toFixed(4),
                    confidence: generateConfidence().toFixed(4),
                    assessor: randomChoice(ASSESSORS),
                    assessment_date: randomDateLastNDays(90),
                    raw_data: generateRawData(indicatorId)
                };

                // Usa dataManager.saveAssessment, che funzionerà per qualsiasi DB.
                await dataManager.saveAssessment(orgData.id, indicatorId, assessmentData);
            }
            console.log(`   ✓ Create ${indicatorsToAssess.length} valutazioni.`);
        }

        console.log('\n✅ Seeding del database completato con successo!\n');

    } catch (error) {
        console.error('\n❌ Errore durante il seeding del database:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

// ============================================================================
// Funzioni Helper (copiate dallo script originale)
// ============================================================================

const ASSESSORS = ['Alice Johnson', 'Bob Smith', 'Carlo Rossi', 'Diana Chen', 'Emma Garcia'];

function randomBetween(min, max) { return Math.random() * (max - min) + min; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomChoice(array) { return array[Math.floor(Math.random() * array.length)]; }
function randomDateLastNDays(days) { const d = new Date(); d.setDate(d.getDate() - randomInt(0, days)); return d; }
function generateAllIndicatorIds() { const ids = []; for (let c = 1; c <= 10; c++) for (let i = 1; i <= 10; i++) ids.push(`${c}.${i}`); return ids; }
function generateRandomIndicatorSubset() { const all = generateAllIndicatorIds(); return all.sort(() => 0.5 - Math.random()).slice(0, randomInt(30, 70)); }
function generateBayesianScore() { const r = Math.random(); if (r < 0.2) return randomBetween(0.1, 0.3); if (r < 0.7) return randomBetween(0.3, 0.7); return randomBetween(0.7, 0.95); }
function generateConfidence() { return randomBetween(0.7, 0.95); }
function generateRawData(indicatorId) { return { notes: `Note per l'indicatore ${indicatorId}.` }; }


// ============================================================================
// Esecuzione
// ============================================================================

if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('\nScript terminato.\n');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Fallimento dello script di seeding:', error);
            process.exit(1);
        });
}

module.exports = { seedDatabase };
