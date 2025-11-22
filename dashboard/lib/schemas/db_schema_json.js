/**
 * @description JSON schema for a single Organization data file in the CPF Dashboard.
 * This structure is used for the file-based JSON database. Each organization is
 * stored in a separate JSON file (e.g., 'techcorp-global.json').
 */
const organizationSchema = {
  id: 'string',
  name: 'string',
  metadata: {
    industry: 'string',
    size: 'string (small, medium, enterprise)',
    country: 'string (2-letter code)',
    language: 'string (e.g., en-US)',
    created_at: 'string (ISO 8601 date)',
    updated_at: 'string (ISO 8601 date)',
    created_by: 'string',
    notes: 'string',
    // Demo-specific fields, can be optional
    sede_sociale: 'string',
    partita_iva: 'string'
  },
  assessments: {
    // Key is the indicator_id, e.g., "1.1"
    "indicator_id": {
      indicator_id: 'string',
      title: 'string',
      category: 'string',
      bayesian_score: 'number (0-1)',
      confidence: 'number (0-1)',
      maturity_level: 'string (green, yellow, red)',
      assessor: 'string',
      assessment_date: 'string (ISO 8601 date)',
      raw_data: {
        fieldKit: 'object', // Full structure from the Field Kit JSON
        quick_assessment: [
          {
            question: 'string',
            response: 'string',
            score: 'number',
            weight: 'number',
            weighted_score: 'number'
          }
        ],
        client_conversation: {
          responses: 'object', // Key-value store for user responses
          scores: {
            quick_assessment: 'number',
            conversation_depth: 'number',
            red_flags: 'number',
            final_score: 'number',
            maturity_level: 'string',
            weights_used: 'object'
          },
          metadata: {
            date: 'string (YYYY-MM-DD)',
            auditor: 'string',
            client: 'string',
            status: 'string (completed, in-progress, review)',
            notes: 'string'
          },
          notes: 'string',
          red_flags: [
            {
              flag: 'string',
              impact: 'number'
            }
          ]
        }
      }
    }
  },
  aggregates: {
    // Calculated aggregate data, structure defined by calculateAggregates()
  }
};

/**
 * @description JSON schema for the organizations_index.json file.
 * This file acts as an index for all organization data files.
 */
const indexSchema = {
  metadata: {
    version: 'string',
    last_updated: 'string (ISO 8601 date)',
    total_organizations: 'number'
  },
  organizations: [
    {
      id: 'string',
      name: 'string',
      industry: 'string',
      size: 'string',
      country: 'string',
      language: 'string',
      created_at: 'string (ISO 8601 date)',
      updated_at: 'string (ISO 8601 date)',
      stats: {
        total_assessments: 'number',
        completion_percentage: 'number',
        overall_risk: 'number (0-1)',
        avg_confidence: 'number (0-1)',
        last_assessment_date: 'string (ISO 8601 date)'
      }
    }
  ]
};


module.exports = {
  organizationSchema,
  indexSchema
};
