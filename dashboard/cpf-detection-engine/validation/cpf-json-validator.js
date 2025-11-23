/**
 * CPF JSON Structure Validator
 * Validates indicator JSON structure for Field Kit files
 */

/**
 * Validate CPF indicator JSON structure
 * @param {object} data - The JSON data to validate
 * @returns {object} - { valid: boolean, errors: string[], warnings: string[] }
 */
function validateCPFJSON(data) {
  const errors = [];
  const warnings = [];

  // Required top-level fields
  if (!data.indicator) {
    errors.push('Missing required field: indicator');
  } else if (typeof data.indicator !== 'string') {
    errors.push('Field "indicator" must be a string');
  }

  if (!data.title) {
    errors.push('Missing required field: title');
  }

  if (!data.category) {
    warnings.push('Missing recommended field: category');
  }

  // Scoring section
  if (!data.scoring) {
    warnings.push('Missing scoring section');
  } else {
    if (!data.scoring.weights) {
      warnings.push('Missing scoring.weights');
    } else {
      const weights = data.scoring.weights;
      const sum = (weights.quick_assessment || 0) +
                 (weights.conversation_depth || 0) +
                 (weights.red_flags || 0);

      if (Math.abs(sum - 1.0) > 0.01 && sum > 0) {
        warnings.push(`Scoring weights sum to ${sum.toFixed(3)}, should be 1.0`);
      }
    }

    if (data.scoring.question_weights) {
      const qWeights = Object.values(data.scoring.question_weights);
      const qSum = qWeights.reduce((a, b) => a + b, 0);
      if (Math.abs(qSum - 1.0) > 0.01 && qSum > 0) {
        warnings.push(`Question weights sum to ${qSum.toFixed(3)}, should be 1.0`);
      }
    }
  }

  // Sections validation
  if (!data.sections || !Array.isArray(data.sections)) {
    errors.push('Missing or invalid sections array');
  } else {
    // Check for quick-assessment section
    const quickSection = data.sections.find(s => s.id === 'quick-assessment');
    if (!quickSection) {
      warnings.push('No quick-assessment section found');
    } else {
      if (!quickSection.items || !Array.isArray(quickSection.items)) {
        errors.push('Quick assessment section missing items array');
      } else {
        // Validate each item has options with scores
        quickSection.items.forEach((item, idx) => {
          if (!item.options || !Array.isArray(item.options)) {
            warnings.push(`Quick assessment item ${idx + 1} missing options`);
          } else {
            item.options.forEach((opt, optIdx) => {
              if (typeof opt.score === 'undefined') {
                warnings.push(`Option ${optIdx + 1} in item ${item.id || idx + 1} missing score`);
              } else if (opt.score < 0 || opt.score > 1) {
                warnings.push(`Option score ${opt.score} in item ${item.id || idx + 1} out of range [0, 1]`);
              }
            });
          }
        });
      }
    }

    // Check for red flags with valid impacts
    let totalRedFlagImpact = 0;
    data.sections.forEach(section => {
      const checkItems = (items) => {
        if (!items) return;
        items.forEach(item => {
          if (item.severity) {
            const impact = item.score_impact || item.weight || 0;
            totalRedFlagImpact += impact;
          }
        });
      };

      checkItems(section.items);
      if (section.subsections) {
        section.subsections.forEach(sub => checkItems(sub.items));
      }
    });

    if (totalRedFlagImpact > 1.0) {
      warnings.push(`Total red flag impact ${totalRedFlagImpact.toFixed(3)} exceeds 1.0`);
    }
  }

  // Detection formula weights
  if (data.detection_formula?.mathematical_model?.default_weights) {
    const dWeights = Object.values(data.detection_formula.mathematical_model.default_weights);
    const dSum = dWeights.reduce((a, b) => a + b, 0);
    if (Math.abs(dSum - 1.0) > 0.01 && dSum > 0) {
      warnings.push(`Detection formula weights sum to ${dSum.toFixed(3)}, should be 1.0`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

module.exports = { validateCPFJSON };
