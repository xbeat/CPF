#!/usr/bin/env node

/**
 * Simple Test Runner for Node.js
 * Runs basic syntax and structure checks without full DOM simulation
 */

console.log('\n🧪 CPF CLIENT - QUICK VALIDATION\n');
console.log('='.repeat(60));

// Mock minimal browser environment
global.window = global;
global.window.addEventListener = () => {};
global.document = {
    getElementById: () => null,
    querySelector: () => null,
    createElement: () => ({
        id: '',
        className: '',
        style: {},
        appendChild: () => {},
        innerHTML: ''
    }),
    body: {
        appendChild: () => {}
    },
    addEventListener: () => {}
};

global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
};

global.fetch = () => Promise.reject(new Error('Mock fetch'));
global.performance = { now: () => Date.now() };
global.FileReader = class FileReader {};
global.Blob = class Blob {};
global.URL = { createObjectURL: () => '', revokeObjectURL: () => {} };
global.html2pdf = () => ({ set: () => ({ from: () => ({ save: () => Promise.resolve() }) }) });

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
        passed++;
    } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        failed++;
    }
}

console.log('\n📦 Loading client-integrated.js...\n');

try {
    // Load client
    require('./client-integrated.js');

    // Structural tests
    console.log('🔍 Structural Tests:\n');

    test('window.CPFClient should be defined', () => {
        if (!window.CPFClient) throw new Error('CPFClient not found');
    });

    test('CPFClient should have organizationContext', () => {
        if (!window.CPFClient.organizationContext) throw new Error('Missing organizationContext');
    });

    test('CPFClient should have currentData', () => {
        if (!window.CPFClient.currentData) throw new Error('Missing currentData');
    });

    test('CPFClient should have updateMeta method', () => {
        if (typeof window.CPFClient.updateMeta !== 'function') throw new Error('Missing updateMeta');
    });

    test('CPFClient should have updateResponse method', () => {
        if (typeof window.CPFClient.updateResponse !== 'function') throw new Error('Missing updateResponse');
    });

    test('CPFClient should have saveToAPI method', () => {
        if (typeof window.CPFClient.saveToAPI !== 'function') throw new Error('Missing saveToAPI');
    });

    test('CPFClient should have calculateIndicatorScore method', () => {
        if (typeof window.CPFClient.calculateIndicatorScore !== 'function') throw new Error('Missing calculateIndicatorScore');
    });

    test('CPFClient should have exportData method', () => {
        if (typeof window.CPFClient.exportData !== 'function') throw new Error('Missing exportData');
    });

    test('CPFClient should have renderFieldKit method', () => {
        if (typeof window.CPFClient.renderFieldKit !== 'function') throw new Error('Missing renderFieldKit');
    });

    test('CPFClient should have loadJSON method', () => {
        if (typeof window.CPFClient.loadJSON !== 'function') throw new Error('Missing loadJSON');
    });

    // Check internal references (via _manager)
    console.log('\n🏗️  Internal Architecture Tests:\n');

    test('CPFClient should have _manager reference', () => {
        if (!window.CPFClient._manager) throw new Error('Missing _manager');
    });

    test('_manager should have currentData', () => {
        if (!window.CPFClient._manager.currentData) throw new Error('Missing _manager.currentData');
    });

    test('_manager should have organizationContext', () => {
        if (!window.CPFClient._manager.organizationContext) throw new Error('Missing _manager.organizationContext');
    });

    test('CPFClient should have _quickRef reference', () => {
        if (!window.CPFClient._quickRef) throw new Error('Missing _quickRef');
    });

    // Functional tests
    console.log('\n⚙️  Functional Tests:\n');

    test('Internal manager should have expected properties', () => {
        const manager = window.CPFClient._manager;
        if (!manager.currentData || !manager.organizationContext) {
            throw new Error('Manager missing expected properties');
        }
    });

    test('Manager should handle organization context', () => {
        const orgId = window.CPFClient.organizationContext.orgId;
        // Should be defined (even if null)
        if (orgId === undefined) throw new Error('orgId should be defined');
    });

    test('updateMeta should update metadata', () => {
        window.CPFClient.updateMeta('auditor', 'Test Auditor');
        if (window.CPFClient.currentData.metadata.auditor !== 'Test Auditor') {
            throw new Error('updateMeta failed');
        }
    });

    test('updateResponse should update responses', () => {
        window.CPFClient.updateResponse('test_id', 'test_value');
        if (window.CPFClient.currentData.responses.test_id !== 'test_value') {
            throw new Error('updateResponse failed');
        }
    });

    test('CATEGORY_MAP should be set on window', () => {
        if (!window.CATEGORY_MAP) throw new Error('Missing window.CATEGORY_MAP');
        if (window.CATEGORY_MAP['9'] !== 'ai') throw new Error('Invalid category mapping');
    });

    test('currentData structure should be correct', () => {
        const data = window.CPFClient.currentData;
        if (!data.metadata || !data.responses) throw new Error('Invalid currentData structure');
    });

    test('metadata should have required fields', () => {
        const meta = window.CPFClient.currentData.metadata;
        if (!meta.date || meta.auditor === undefined || meta.client === undefined) {
            throw new Error('Missing required metadata fields');
        }
    });

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESULTS');
    console.log('='.repeat(60));
    console.log(`Total: ${passed + failed}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    console.log('='.repeat(60));

    if (failed === 0) {
        console.log('\n🎉 All tests passed!');
        console.log('\n💡 For full browser-based tests, open test-runner.html in a browser\n');
    } else {
        console.log('\n⚠️  Some tests failed. Check the output above.\n');
    }

    process.exit(failed > 0 ? 1 : 0);

} catch (error) {
    console.error('\n❌ Fatal error loading client:', error.message);
    console.error(error.stack);
    process.exit(1);
}
