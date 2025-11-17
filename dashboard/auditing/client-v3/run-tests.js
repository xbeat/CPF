#!/usr/bin/env node

/**
 * Test Runner for Node.js
 * Runs CPF Client tests in a simulated browser environment using jsdom
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Create a simulated browser environment
const html = fs.readFileSync(path.join(__dirname, 'test-runner.html'), 'utf-8');
const dom = new JSDOM(html, {
    url: 'http://localhost:8765',
    runScripts: 'dangerously',
    resources: 'usable',
    beforeParse(window) {
        // Mock external dependencies if needed
        window.html2pdf = function() {
            return {
                set: () => ({ from: () => ({ save: () => Promise.resolve() }) })
            };
        };

        // Mock performance API if not available
        if (!window.performance) {
            window.performance = {
                now: () => Date.now()
            };
        }
    }
});

const { window } = dom;
const { document } = window;

// Load scripts manually since jsdom might not load them automatically
try {
    // Load client-integrated.js
    const clientCode = fs.readFileSync(path.join(__dirname, 'client-integrated.js'), 'utf-8');
    const clientScript = new window.Function(clientCode);
    clientScript.call(window);

    // Load test-suite.js
    const testCode = fs.readFileSync(path.join(__dirname, 'test-suite.js'), 'utf-8');
    const testScript = new window.Function(testCode);
    testScript.call(window);

    console.log('\n🧪 CPF CLIENT TEST SUITE - Node.js Runner\n');
    console.log('='.repeat(60));

    // Run tests
    if (window.TestSuite && typeof window.TestSuite.runAllTests === 'function') {
        const results = window.TestSuite.runAllTests();

        // Exit with appropriate code
        const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);
        process.exit(totalFailed > 0 ? 1 : 0);
    } else {
        console.error('❌ TestSuite not found or runAllTests not a function');
        process.exit(1);
    }

} catch (error) {
    console.error('❌ Error running tests:', error.message);
    console.error(error.stack);
    process.exit(1);
}
