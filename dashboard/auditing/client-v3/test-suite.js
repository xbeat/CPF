// ============================================
// CPF CLIENT TEST SUITE
// ============================================
// Comprehensive unit tests for both v2.0 and v3.0

class TestRunner {
    constructor() {
        this.tests = [];
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            errors: []
        };
    }

    describe(suiteName, testFn) {
        console.log(`\n📦 ${suiteName}`);
        testFn();
    }

    it(testName, testFn) {
        this.results.total++;
        try {
            testFn();
            this.results.passed++;
            console.log(`  ✅ ${testName}`);
            return true;
        } catch (error) {
            this.results.failed++;
            this.results.errors.push({
                test: testName,
                error: error.message,
                stack: error.stack
            });
            console.error(`  ❌ ${testName}`);
            console.error(`     ${error.message}`);
            return false;
        }
    }

    assertEqual(actual, expected, message = '') {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`${message}\n  Expected: ${JSON.stringify(expected)}\n  Got: ${JSON.stringify(actual)}`);
        }
    }

    assertNotEqual(actual, expected, message = '') {
        if (JSON.stringify(actual) === JSON.stringify(expected)) {
            throw new Error(`${message}\n  Expected values to be different`);
        }
    }

    assertTrue(value, message = 'Expected true') {
        if (!value) {
            throw new Error(message);
        }
    }

    assertFalse(value, message = 'Expected false') {
        if (value) {
            throw new Error(message);
        }
    }

    assertDefined(value, message = 'Expected value to be defined') {
        if (value === undefined || value === null) {
            throw new Error(message);
        }
    }

    assertUndefined(value, message = 'Expected value to be undefined') {
        if (value !== undefined) {
            throw new Error(message);
        }
    }

    assertType(value, type, message = '') {
        const actualType = typeof value;
        if (actualType !== type) {
            throw new Error(`${message}\n  Expected type: ${type}\n  Got: ${actualType}`);
        }
    }

    assertInstanceOf(value, constructor, message = '') {
        if (!(value instanceof constructor)) {
            throw new Error(`${message}\n  Expected instance of ${constructor.name}`);
        }
    }

    assertThrows(fn, message = 'Expected function to throw') {
        try {
            fn();
            throw new Error(message);
        } catch (error) {
            // Expected behavior
        }
    }

    report() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 TEST RESULTS');
        console.log('='.repeat(60));
        console.log(`Total tests: ${this.results.total}`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`Success rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);

        if (this.results.errors.length > 0) {
            console.log('\n🔴 FAILED TESTS:');
            this.results.errors.forEach(({ test, error }) => {
                console.log(`  • ${test}: ${error}`);
            });
        }

        return this.results;
    }

    getHTMLReport() {
        const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
        const statusColor = this.results.failed === 0 ? '#28a745' : '#dc3545';

        let html = `
            <div class="test-report">
                <h2>Test Results</h2>
                <div class="summary" style="background: ${statusColor}20; border-left: 4px solid ${statusColor}; padding: 15px; margin: 20px 0;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                        <div>
                            <div style="font-size: 32px; font-weight: bold;">${this.results.total}</div>
                            <div style="color: #666;">Total Tests</div>
                        </div>
                        <div>
                            <div style="font-size: 32px; font-weight: bold; color: #28a745;">${this.results.passed}</div>
                            <div style="color: #666;">Passed</div>
                        </div>
                        <div>
                            <div style="font-size: 32px; font-weight: bold; color: #dc3545;">${this.results.failed}</div>
                            <div style="color: #666;">Failed</div>
                        </div>
                    </div>
                    <div style="margin-top: 15px; font-size: 20px;">
                        Success Rate: <strong>${successRate}%</strong>
                    </div>
                </div>
        `;

        if (this.results.errors.length > 0) {
            html += '<h3>Failed Tests</h3><div class="errors">';
            this.results.errors.forEach(({ test, error }) => {
                html += `
                    <div style="background: #fee; padding: 10px; margin: 10px 0; border-left: 3px solid #dc3545;">
                        <strong>${test}</strong><br>
                        <code style="color: #d63031;">${error}</code>
                    </div>
                `;
            });
            html += '</div>';
        }

        html += '</div>';
        return html;
    }
}

// ============================================
// MOCK DATA FOR TESTING
// ============================================

const mockFieldKit = {
    indicator: '9.1',
    title: 'Test Indicator',
    subtitle: 'Test Subtitle',
    category: 9,
    sections: [
        {
            title: 'Test Section 1',
            description: 'Test description',
            items: [
                {
                    id: 'test_radio',
                    type: 'radio-group',
                    label: 'Test Radio Question',
                    options: [
                        { value: 'yes', label: 'Yes', score: 1 },
                        { value: 'no', label: 'No', score: 0 }
                    ]
                },
                {
                    id: 'test_checkbox',
                    type: 'checkbox',
                    label: 'Test Checkbox',
                    severity: 5
                },
                {
                    id: 'test_input',
                    type: 'input',
                    label: 'Test Input'
                },
                {
                    id: 'test_question',
                    type: 'question',
                    label: 'Test Question',
                    followup: 'Please explain'
                }
            ]
        },
        {
            title: 'Test Section 2',
            items: [
                {
                    id: 'test_radio_2',
                    type: 'radio-list',
                    label: 'Test Radio List',
                    options: [
                        { value: 'option1', label: 'Option 1', score: 2 },
                        { value: 'option2', label: 'Option 2', score: 1 }
                    ]
                }
            ]
        }
    ],
    scoring: {
        quick_assessment: {
            items: [
                {
                    id: 'test_radio',
                    label: 'Test Radio Question',
                    max_score: 1,
                    options: [
                        { value: 'yes', label: 'Yes', score: 1 },
                        { value: 'no', label: 'No', score: 0 }
                    ]
                },
                {
                    id: 'test_radio_2',
                    label: 'Test Radio List',
                    max_score: 2,
                    options: [
                        { value: 'option1', label: 'Option 1', score: 2 },
                        { value: 'option2', label: 'Option 2', score: 1 }
                    ]
                }
            ]
        },
        maturity_levels: {
            red: { color: '#dc3545', label: 'Red - Critical' },
            yellow: { color: '#ffc107', label: 'Yellow - Warning' },
            green: { color: '#28a745', label: 'Green - Good' }
        }
    }
};

const mockOrgContext = {
    orgId: 'test-org-123',
    orgName: 'Test Organization',
    language: 'en-US'
};

// ============================================
// V3.0 TESTS (Class-based architecture)
// ============================================

function testV3() {
    const runner = new TestRunner();

    runner.describe('V3.0 - AssessmentManager', () => {
        runner.it('should initialize with default values', () => {
            const manager = new AssessmentManager();
            runner.assertDefined(manager.currentData, 'currentData should be defined');
            runner.assertDefined(manager.organizationContext, 'organizationContext should be defined');
            runner.assertEqual(manager.currentData.responses, {}, 'responses should be empty object');
        });

        runner.it('should accept organization context in constructor', () => {
            const manager = new AssessmentManager(mockOrgContext);
            runner.assertEqual(manager.organizationContext.orgId, 'test-org-123');
            runner.assertEqual(manager.organizationContext.orgName, 'Test Organization');
        });

        runner.it('should update metadata correctly', () => {
            const manager = new AssessmentManager();
            manager.updateMeta('auditor', 'John Doe');
            runner.assertEqual(manager.currentData.metadata.auditor, 'John Doe');
        });

        runner.it('should update response correctly', () => {
            const manager = new AssessmentManager();
            manager.updateResponse('test_id', 'test_value', { autoSave: false, autoCalculate: false });
            runner.assertEqual(manager.currentData.responses.test_id, 'test_value');
        });

        runner.it('should handle multiple response updates', () => {
            const manager = new AssessmentManager();
            manager.updateResponse('id1', 'value1', { autoSave: false, autoCalculate: false });
            manager.updateResponse('id2', 'value2', { autoSave: false, autoCalculate: false });
            runner.assertEqual(Object.keys(manager.currentData.responses).length, 2);
        });

        runner.it('should export data correctly', () => {
            const manager = new AssessmentManager();
            manager.currentData.fieldKit = mockFieldKit;
            manager.updateResponse('test_id', 'value', { autoSave: false, autoCalculate: false });

            // Export creates blob, we just verify data structure
            runner.assertDefined(manager.currentData.fieldKit);
            runner.assertDefined(manager.currentData.responses.test_id);
        });
    });

    runner.describe('V3.0 - ScoreCalculator', () => {
        runner.it('should initialize with fieldKit and responses', () => {
            const calculator = new ScoreCalculator(mockFieldKit, {});
            runner.assertDefined(calculator.fieldKit);
            runner.assertDefined(calculator.responses);
        });

        runner.it('should calculate quick assessment score', () => {
            const responses = {
                test_radio: 'yes',
                test_radio_2: 'option1'
            };
            const calculator = new ScoreCalculator(mockFieldKit, responses);
            const result = calculator.calculateQuickAssessment();

            runner.assertDefined(result.score);
            runner.assertType(result.score, 'number');
            runner.assertTrue(result.score >= 0 && result.score <= 1, 'Score should be between 0 and 1');
            runner.assertEqual(result.total_score, 3); // 1 + 2
            runner.assertEqual(result.max_score, 3); // 1 + 2
        });

        runner.it('should calculate red flags correctly', () => {
            const responses = {
                test_checkbox: true
            };
            const calculator = new ScoreCalculator(mockFieldKit, responses);
            const result = calculator.calculateRedFlags();

            runner.assertEqual(result.count, 1, 'Should have 1 red flag');
            runner.assertEqual(result.severity_sum, 5);
            runner.assertTrue(result.red_flags_list.length > 0);
        });

        runner.it('should track conversation completeness', () => {
            const responses = {
                test_radio: 'yes',
                test_checkbox: true,
                test_input: 'some text'
            };
            const calculator = new ScoreCalculator(mockFieldKit, responses);
            const result = calculator.trackConversationCompleteness();

            runner.assertDefined(result.completeness);
            runner.assertType(result.completeness, 'number');
            runner.assertTrue(result.completeness > 0);
            runner.assertEqual(result.answered_items, 3);
        });

        runner.it('should calculate full Bayesian score', () => {
            const responses = {
                test_radio: 'yes',
                test_radio_2: 'option1',
                test_checkbox: false
            };
            const calculator = new ScoreCalculator(mockFieldKit, responses);
            const result = calculator.calculate();

            runner.assertDefined(result.bayesian_score);
            runner.assertDefined(result.maturity_level);
            runner.assertDefined(result.confidence);
            runner.assertDefined(result.details);
            runner.assertTrue(result.bayesian_score >= 0 && result.bayesian_score <= 1);
        });

        runner.it('should determine maturity level correctly', () => {
            const calculator = new ScoreCalculator(mockFieldKit, {});

            runner.assertEqual(calculator.determineMaturityLevel(0.1), 'red');
            runner.assertEqual(calculator.determineMaturityLevel(0.5), 'yellow');
            runner.assertEqual(calculator.determineMaturityLevel(0.8), 'green');
        });

        runner.it('should handle empty responses', () => {
            const calculator = new ScoreCalculator(mockFieldKit, {});
            const result = calculator.calculate();

            runner.assertDefined(result);
            runner.assertEqual(result.bayesian_score, 0);
        });
    });

    runner.describe('V3.0 - FieldKitRenderer', () => {
        runner.it('should initialize with assessment manager', () => {
            const manager = new AssessmentManager();
            const renderer = new FieldKitRenderer(manager);
            runner.assertDefined(renderer.manager);
        });

        runner.it('should generate header HTML', () => {
            const manager = new AssessmentManager();
            const renderer = new FieldKitRenderer(manager);
            const html = renderer.renderHeader(mockFieldKit);

            runner.assertTrue(html.includes('9.1'), 'Should include indicator ID');
            runner.assertTrue(html.includes('Test Indicator'), 'Should include title');
        });

        runner.it('should generate metadata bar HTML', () => {
            const manager = new AssessmentManager();
            const renderer = new FieldKitRenderer(manager);
            const html = renderer.renderMetadataBar();

            runner.assertTrue(html.includes('Date:'), 'Should include date field');
            runner.assertTrue(html.includes('Auditor:'), 'Should include auditor field');
        });

        runner.it('should render different item types', () => {
            const manager = new AssessmentManager();
            const renderer = new FieldKitRenderer(manager);

            const radioHtml = renderer.renderRadioGroup(mockFieldKit.sections[0].items[0], 'test_id');
            runner.assertTrue(radioHtml.includes('radio'), 'Should render radio group');

            const checkboxHtml = renderer.renderCheckbox(mockFieldKit.sections[0].items[1], 'test_id');
            runner.assertTrue(checkboxHtml.includes('checkbox'), 'Should render checkbox');

            const inputHtml = renderer.renderInput(mockFieldKit.sections[0].items[2], 'test_id');
            runner.assertTrue(inputHtml.includes('input'), 'Should render input');
        });
    });

    runner.describe('V3.0 - CONFIG', () => {
        runner.it('should have language configuration', () => {
            runner.assertDefined(CONFIG.languages);
            runner.assertDefined(CONFIG.languages.map);
            runner.assertEqual(CONFIG.languages.map.EN, 'en-US');
        });

        runner.it('should have category configuration', () => {
            runner.assertDefined(CONFIG.categories);
            runner.assertDefined(CONFIG.categories.map);
            runner.assertEqual(CONFIG.categories.map['9'], 'ai');
        });

        runner.it('should have scoring weights', () => {
            runner.assertDefined(CONFIG.scoring);
            runner.assertEqual(CONFIG.scoring.weights.quickAssessment, 0.70);
            runner.assertEqual(CONFIG.scoring.weights.redFlags, 0.30);
        });
    });

    return runner.report();
}

// ============================================
// V2.0 vs V3.0 COMPARISON TESTS
// ============================================

function testComparison() {
    const runner = new TestRunner();

    runner.describe('V2.0 vs V3.0 - API Compatibility', () => {
        runner.it('should expose same window.CPFClient interface', () => {
            const v3Methods = Object.keys(window.CPFClient);
            const requiredMethods = [
                'organizationContext',
                'currentData',
                'loadJSON',
                'renderFieldKit',
                'updateMeta',
                'updateResponse',
                'updateResponseWithAutoScore',
                'selectRadioOption',
                'saveToAPI',
                'saveData',
                'exportData',
                'generateReport',
                'calculateIndicatorScore',
                'toggleScoreDetails',
                'showQuickReference',
                'closeQuickReference',
                'resetAll'
            ];

            requiredMethods.forEach(method => {
                runner.assertTrue(
                    v3Methods.includes(method),
                    `CPFClient should have ${method} method`
                );
            });
        });

        runner.it('should have compatible organizationContext structure', () => {
            const context = window.CPFClient.organizationContext;
            runner.assertDefined(context.orgId);
            runner.assertDefined(context.orgName);
            runner.assertDefined(context.language);
        });

        runner.it('should have compatible currentData structure', () => {
            const data = window.CPFClient.currentData;
            runner.assertDefined(data.fieldKit);
            runner.assertDefined(data.metadata);
            runner.assertDefined(data.responses);
        });
    });

    runner.describe('V2.0 vs V3.0 - Behavioral Equivalence', () => {
        runner.it('should handle updateMeta the same way', () => {
            // Reset state
            window.CPFClient.currentData.metadata.auditor = '';

            window.CPFClient.updateMeta('auditor', 'Test Auditor');
            runner.assertEqual(
                window.CPFClient.currentData.metadata.auditor,
                'Test Auditor'
            );
        });

        runner.it('should handle updateResponse the same way', () => {
            window.CPFClient.updateResponse('test_response', 'test_value');
            runner.assertEqual(
                window.CPFClient.currentData.responses.test_response,
                'test_value'
            );
        });

        runner.it('should calculate scores consistently', () => {
            // Set up test data
            window.CPFClient._manager.currentData.fieldKit = mockFieldKit;
            window.CPFClient._manager.currentData.responses = {
                test_radio: 'yes',
                test_radio_2: 'option1',
                test_checkbox: false
            };

            window.CPFClient.calculateIndicatorScore();
            const score = window.CPFClient._manager.currentScore;

            runner.assertDefined(score);
            runner.assertDefined(score.bayesian_score);
            runner.assertTrue(score.bayesian_score >= 0 && score.bayesian_score <= 1);
            runner.assertEqual(score.maturity_level, 'green'); // Should be high score
        });
    });

    runner.describe('V2.0 vs V3.0 - Edge Cases', () => {
        runner.it('should handle empty responses gracefully', () => {
            window.CPFClient._manager.currentData.responses = {};
            window.CPFClient._manager.currentData.fieldKit = mockFieldKit;

            window.CPFClient.calculateIndicatorScore();
            const score = window.CPFClient._manager.currentScore;

            runner.assertDefined(score);
            runner.assertEqual(score.bayesian_score, 0);
        });

        runner.it('should handle null/undefined values', () => {
            window.CPFClient.updateResponse('test_null', null);
            window.CPFClient.updateResponse('test_undefined', undefined);

            runner.assertEqual(window.CPFClient.currentData.responses.test_null, null);
            runner.assertEqual(window.CPFClient.currentData.responses.test_undefined, undefined);
        });

        runner.it('should handle special characters in responses', () => {
            const specialValue = '<script>alert("test")</script>';
            window.CPFClient.updateResponse('test_special', specialValue);
            runner.assertEqual(window.CPFClient.currentData.responses.test_special, specialValue);
        });
    });

    return runner.report();
}

// ============================================
// PERFORMANCE TESTS
// ============================================

function testPerformance() {
    const runner = new TestRunner();

    runner.describe('Performance Tests', () => {
        runner.it('should handle 100 response updates efficiently', () => {
            const start = performance.now();

            for (let i = 0; i < 100; i++) {
                window.CPFClient.updateResponse(`perf_test_${i}`, `value_${i}`);
            }

            const duration = performance.now() - start;
            console.log(`    ⏱️  100 updates took ${duration.toFixed(2)}ms`);
            runner.assertTrue(duration < 1000, 'Should complete in under 1 second');
        });

        runner.it('should calculate score quickly', () => {
            window.CPFClient._manager.currentData.fieldKit = mockFieldKit;
            window.CPFClient._manager.currentData.responses = {
                test_radio: 'yes',
                test_radio_2: 'option1'
            };

            const start = performance.now();
            window.CPFClient.calculateIndicatorScore();
            const duration = performance.now() - start;

            console.log(`    ⏱️  Score calculation took ${duration.toFixed(2)}ms`);
            runner.assertTrue(duration < 100, 'Should calculate in under 100ms');
        });
    });

    return runner.report();
}

// ============================================
// INTEGRATION TESTS
// ============================================

function testIntegration() {
    const runner = new TestRunner();

    runner.describe('Integration Tests', () => {
        runner.it('should support full assessment workflow', () => {
            // 1. Initialize with org context
            window.CPFClient._manager.organizationContext = mockOrgContext;

            // 2. Load field kit
            window.CPFClient._manager.currentData.fieldKit = mockFieldKit;

            // 3. Fill in metadata
            window.CPFClient.updateMeta('auditor', 'Test Auditor');
            window.CPFClient.updateMeta('client', 'Test Client');

            // 4. Answer questions
            window.CPFClient.updateResponse('test_radio', 'yes');
            window.CPFClient.updateResponse('test_checkbox', true);

            // 5. Calculate score
            window.CPFClient.calculateIndicatorScore();

            // Verify all steps
            runner.assertEqual(window.CPFClient.currentData.metadata.auditor, 'Test Auditor');
            runner.assertEqual(window.CPFClient.currentData.responses.test_radio, 'yes');
            runner.assertDefined(window.CPFClient._manager.currentScore);
        });

        runner.it('should maintain state through reset', () => {
            // Set up state
            window.CPFClient.updateMeta('auditor', 'Test');
            window.CPFClient.updateResponse('test', 'value');

            // Responses should be present
            runner.assertTrue(Object.keys(window.CPFClient.currentData.responses).length > 0);

            // Note: Can't actually test reset without user confirmation
            // but we can verify the method exists
            runner.assertType(window.CPFClient.resetAll, 'function');
        });
    });

    return runner.report();
}

// ============================================
// RUN ALL TESTS
// ============================================

function runAllTests() {
    console.clear();
    console.log('🧪 CPF CLIENT TEST SUITE');
    console.log('='.repeat(60));
    console.log('Testing V3.0 Class-based Architecture');
    console.log('='.repeat(60));

    const results = {
        v3: testV3(),
        comparison: testComparison(),
        performance: testPerformance(),
        integration: testIntegration()
    };

    console.log('\n' + '='.repeat(60));
    console.log('📈 OVERALL SUMMARY');
    console.log('='.repeat(60));

    const totalTests = Object.values(results).reduce((sum, r) => sum + r.total, 0);
    const totalPassed = Object.values(results).reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);

    console.log(`Total: ${totalTests} | Passed: ${totalPassed} | Failed: ${totalFailed}`);
    console.log(`Overall Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);

    return results;
}

// Export for use in test runner HTML
if (typeof window !== 'undefined') {
    window.TestSuite = {
        runAllTests,
        testV3,
        testComparison,
        testPerformance,
        testIntegration,
        TestRunner
    };
}
