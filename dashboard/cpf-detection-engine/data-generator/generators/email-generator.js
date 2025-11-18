/**
 * Realistic Email Traffic Generator
 * Generates normal business emails with hidden authority compliance signals
 */

const { v4: uuidv4 } = require('uuid');

class EmailGenerator {
  constructor(config = {}) {
    this.orgId = config.orgId || 'org-test-001';
    this.userCount = config.userCount || 1000;
    this.emailsPerUserPerDay = config.emailsPerUserPerDay || 50;
    this.execDomains = ['ceo@', 'cfo@', 'board@', 'exec@', 'president@'];

    // Baseline defaults (from config or use these)
    this.baseline = config.baseline || {
      compliance_rate: 0.72,
      compliance_std: 0.08,
      verification_rate: 0.35,
      verification_std: 0.12,
      response_time: 300,  // seconds
      response_time_std: 120
    };

    // Generate user list
    this.users = this.generateUsers(this.userCount);

    // Ground truth tracker
    this.groundTruthRecords = [];
  }

  /**
   * Generate synthetic user list
   */
  generateUsers(count) {
    const departments = ['sales', 'marketing', 'engineering', 'finance', 'hr', 'operations'];
    const users = [];

    for (let i = 0; i < count; i++) {
      users.push({
        id: `user-${String(i).padStart(5, '0')}`,
        email: `user${i}@company.com`,
        name: `User ${i}`,
        department: departments[i % departments.length],
        seniority: i < count * 0.1 ? 'exec' : (i < count * 0.3 ? 'manager' : 'employee')
      });
    }

    return users;
  }

  /**
   * Generate one day of realistic email traffic
   */
  generateDay(date = new Date()) {
    const events = [];
    const totalEmails = this.userCount * this.emailsPerUserPerDay;

    console.log(`[EmailGenerator] Generating ${totalEmails} emails for ${date.toISOString().split('T')[0]}...`);

    // Generate normal emails
    for (let i = 0; i < totalEmails; i++) {
      const timestamp = this.distributeCircadian(date, i, totalEmails);
      const email = this.generateNormalEmail(timestamp);
      events.push(email);
    }

    console.log(`[EmailGenerator] Generated ${events.length} normal emails`);

    return events;
  }

  /**
   * Generate one day with injected signals
   */
  generateDayWithSignals(date = new Date(), signalCount = 50) {
    const events = this.generateDay(date);

    console.log(`[EmailGenerator] Injecting ${signalCount} authority compliance signals...`);

    // Inject hidden authority compliance signals
    for (let i = 0; i < signalCount; i++) {
      const signal = this.injectAuthorityComplianceSignal(date);
      events.push(signal);
    }

    // Shuffle to hide injection pattern
    this.shuffle(events);

    console.log(`[EmailGenerator] Total: ${events.length} emails (${signalCount} contain hidden signals)`);
    console.log(`[EmailGenerator] Ground truth records: ${this.groundTruthRecords.length}`);

    return events;
  }

  /**
   * Generate normal business email (no signal)
   */
  generateNormalEmail(timestamp) {
    const sender = this.selectRandomUser();
    const recipient = this.selectRandomUser();

    const subjects = [
      'Meeting follow-up',
      'Project update',
      'Question about deliverable',
      'Team sync notes',
      'Weekly report',
      'FYI: Documentation update',
      'Quick question',
      'Feedback requested',
      'Monthly review',
      'Training materials'
    ];

    return {
      id: `email-${uuidv4()}`,
      timestamp: timestamp.getTime(),
      type: 'email',
      orgId: this.orgId,
      data: {
        from: sender.email,
        to: [recipient.email],
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        body: this.generateBody('normal'),

        // User behavior (normally distributed)
        user_action: {
          read: true,
          read_time: timestamp.getTime() + this.randomNormal(300, 120) * 1000,
          clicked_link: Math.random() < 0.05,
          opened_attachment: Math.random() < 0.03,
          forwarded: Math.random() < 0.02,
          deleted: Math.random() < 0.10
        },

        // Recipients info (for compliance tracking)
        recipients: [{
          email: recipient.email,
          user_id: recipient.id,
          action_taken: false,  // Normal emails don't require action
          verified: false,
          response_time: null
        }]
      }
    };
  }

  /**
   * Inject authority compliance signal
   * Creates email from exec that gets abnormally HIGH compliance
   */
  injectAuthorityComplianceSignal(date) {
    const timestamp = this.distributeCircadian(date, Math.random(), 1);

    // Select exec sender
    const execDomain = this.execDomains[Math.floor(Math.random() * this.execDomains.length)];
    const sender = `${execDomain}company.com`;

    // Create request that requires action
    const actionTypes = [
      { action: 'wire transfer', urgency: 'urgent' },
      { action: 'approve access', urgency: 'immediately' },
      { action: 'grant exception', urgency: 'asap' },
      { action: 'urgent approval', urgency: 'today' }
    ];

    const selected = actionTypes[Math.floor(Math.random() * actionTypes.length)];

    // Calculate anomalous compliance rate (3σ above baseline)
    const targetCompliance = this.baseline.compliance_rate + (3 * this.baseline.compliance_std);
    // Should be around 0.96 (72% + 3*8% = 96%)

    // Select recipients who will comply
    const recipientCount = Math.floor(Math.random() * 10) + 5; // 5-15 recipients
    const recipients = [];

    let actualCompliers = 0;
    let actualVerifiers = 0;

    for (let i = 0; i < recipientCount; i++) {
      const recipient = this.selectRandomUser(['employee', 'manager']); // Avoid execs

      // High compliance rate (target ~96%)
      const willComply = Math.random() < targetCompliance;
      if (willComply) actualCompliers++;

      // Very low verification (vs 35% baseline)
      const willVerify = Math.random() < 0.05;  // Only 5% verify
      if (willVerify) actualVerifiers++;

      recipients.push({
        email: recipient.email,
        user_id: recipient.id,
        action_taken: willComply,
        verified: willVerify,
        response_time: willComply ? this.randomNormal(180, 60) : null // Fast response
      });
    }

    const actualComplianceRate = actualCompliers / recipientCount;
    const actualVerificationRate = actualVerifiers / recipientCount;
    const deviationSigmas = (actualComplianceRate - this.baseline.compliance_rate) / this.baseline.compliance_std;

    const emailId = `email-${uuidv4()}`;

    const email = {
      id: emailId,
      timestamp: timestamp.getTime(),
      type: 'email',
      orgId: this.orgId,
      data: {
        from: sender,
        to: recipients.map(r => r.email),
        subject: `${selected.urgency.toUpperCase()}: ${selected.action} needed`,
        body: this.generateBody('urgent_authority', { action: selected.action }),
        urgency_markers: [selected.urgency, 'urgent', 'immediately'],

        // Recipients and their actions
        recipients: recipients
      },

      // Ground truth metadata (NOT visible to detection algorithm)
      _groundTruth: {
        indicator: '1.1',
        signal_type: 'authority_compliance',
        baseline_compliance: this.baseline.compliance_rate,
        actual_compliance: actualComplianceRate,
        deviation_sigmas: deviationSigmas,
        baseline_verification: this.baseline.verification_rate,
        actual_verification: actualVerificationRate,
        should_detect: deviationSigmas >= 2.0
      }
    };

    // Record ground truth
    this.groundTruthRecords.push({
      orgId: this.orgId,
      indicator: '1.1',
      timestamp: timestamp,
      eventIds: [emailId],
      signalStrength: deviationSigmas,
      shouldDetect: deviationSigmas >= 2.0,
      injectionMethod: 'authority_compliance',
      notes: `Compliance: ${(actualComplianceRate*100).toFixed(1)}% (baseline: ${(this.baseline.compliance_rate*100).toFixed(1)}%), ${deviationSigmas.toFixed(2)}σ above`
    });

    return email;
  }

  /**
   * Distribute events across day with circadian pattern
   * Peak hours: 9-11am, 2-4pm (business hours)
   */
  distributeCircadian(date, index, total) {
    const u = index / total; // Uniform [0, 1]

    // Circadian CDF - higher probability during work hours
    let hour;
    if (u < 0.05) hour = Math.floor(Math.random() * 8); // 0-8am: 5%
    else if (u < 0.25) hour = 8 + Math.floor(Math.random() * 2); // 8-10am: 20%
    else if (u < 0.50) hour = 10 + Math.floor(Math.random() * 2); // 10-12pm: 25%
    else if (u < 0.65) hour = 12 + Math.floor(Math.random() * 2); // 12-2pm: 15%
    else if (u < 0.90) hour = 14 + Math.floor(Math.random() * 3); // 2-5pm: 25%
    else hour = 17 + Math.floor(Math.random() * 7); // 5pm-12am: 10%

    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);

    const timestamp = new Date(date);
    timestamp.setHours(hour, minute, second, 0);

    return timestamp;
  }

  /**
   * Generate email body
   */
  generateBody(type, params = {}) {
    if (type === 'urgent_authority') {
      return `This is ${params.action} that requires immediate attention. Please proceed as soon as possible. Time sensitive.`;
    }

    const normalBodies = [
      'Hi, just following up on our previous discussion. Let me know if you have any questions.',
      'Attached are the documents you requested. Please review at your convenience.',
      'Quick update on the project status. Everything is on track.',
      'FYI - sharing some information that might be useful for your team.',
      'Meeting notes from today\'s sync. Action items highlighted.',
      'Weekly status report attached. No blockers at this time.',
      'Question about the deliverable - when can we expect the final version?',
      'Training materials for the new process. Please review before next week.',
      'Monthly metrics are in. Overall trends looking positive.',
      'Feedback requested on the proposal. Please reply by end of week.'
    ];

    return normalBodies[Math.floor(Math.random() * normalBodies.length)];
  }

  /**
   * Select random user
   */
  selectRandomUser(seniorityFilter = null) {
    let pool = this.users;

    if (seniorityFilter) {
      pool = this.users.filter(u =>
        Array.isArray(seniorityFilter) ?
          seniorityFilter.includes(u.seniority) :
          u.seniority === seniorityFilter
      );
    }

    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Random number from normal distribution (Box-Muller transform)
   */
  randomNormal(mean, std) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + std * z0;
  }

  /**
   * Shuffle array in place (Fisher-Yates)
   */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Get ground truth records
   */
  getGroundTruth() {
    return this.groundTruthRecords;
  }

  /**
   * Clear ground truth (for new generation)
   */
  clearGroundTruth() {
    this.groundTruthRecords = [];
  }
}

module.exports = EmailGenerator;
