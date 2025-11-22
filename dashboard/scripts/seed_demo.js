#!/usr/bin/env node

/**
 * CPF Database Seed Script
 * Generates high-quality demo data for 5 organizations and populates the configured database.
 * It uses the advanced generation logic from `generate_demo_organizations.js` and delegates
 * saving to the central dataManager, making it database-agnostic.
 *
 * Usage: node dashboard/scripts/seed_demo.js
 */

const dataManager = require('../lib/dataManager');
const { generateDemoOrganizations } = require('./generate_demo_organizations');

async function seedDatabase() {
    console.log('\n🌱 CPF High-Quality Database Seeder\n');
    console.log('='.repeat(60));

    try {
        console.log('① Generating high-quality demo data in memory...');
        // This function returns an array of rich organization objects
        // without writing them to disk, because it's being used as a module.
        const organizationsData = await generateDemoOrganizations();
        console.log(`   ✓ Generated data for ${organizationsData.length} organizations.`);

        // Initialize the database (ensures tables like 'organizations' and 'assessments' are created)
        await dataManager.initialize();

        console.log('\n② Populating database via dataManager...');

        for (const orgData of organizationsData) {
            console.log(`\n   - Processing: ${orgData.name}`);
            
            // We delegate the entire saving process to the dataManager.
            // A new function `saveFullOrganization` will be created on the db specialists
            // (e.g., db_postgres.js) to handle the transaction of saving the org and all its assessments.
            await dataManager.createOrganization(orgData);

            const assessmentCount = orgData.assessments ? Object.keys(orgData.assessments).length : 0;
            console.log(`     ✓ Delegated saving of organization and ${assessmentCount} assessments to dataManager.`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('\n✅ Database seeding completed successfully!\n');

    } catch (error) {
        console.error('\n❌ Error during database seeding:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('Script finished.\n');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Seeding script failed:', error);
            process.exit(1);
        });
}

module.exports = { seedDatabase };
