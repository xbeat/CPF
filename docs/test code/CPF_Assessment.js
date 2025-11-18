// CPF Framework Direct Mapping - Example Implementation
const CPFAssessment = {
	// Category 1: Authority-Based Vulnerabilities (Milgram, 1974)
	authorityVulnerabilities: {
		"1.1": {
			indicator: "Unquestioning compliance with apparent authority",
			scenario: "Your bank manager calls asking to verify your account",
			choices: [
				{ text: "Provide all requested information", score: 2 }, // Red
				{ text: "Ask for badge/employee number first", score: 1 }, // Yellow
				{ text: "Hang up and call bank directly", score: 0 } // Green
			],
			attackVector: ["CEO Fraud", "Tech Support Scam"]
		},
		"1.3": {
			indicator: "Authority figure impersonation susceptibility",
			scenario: "Email from 'IT Department' asks you to click link for security update",
			choices: [
				{ text: "Click immediately - IT knows best", score: 2 }, // Red
				{ text: "Check sender address first", score: 1 }, // Yellow
				{ text: "Contact IT through official channels", score: 0 } // Green
			],
			attackVector: ["Spear Phishing", "Credential Harvesting"]
		}
	},

	// Category 2: Temporal Vulnerabilities (Kahneman & Tversky, 1979)
	temporalVulnerabilities: {
		"2.1": {
			indicator: "Urgency-induced security bypass",
			scenario: "URGENT: Your account will be closed in 1 hour unless you verify",
			choices: [
				{ text: "Act immediately to save account", score: 2 }, // Red
				{ text: "Feel stressed but try to verify", score: 1 }, // Yellow
				{ text: "Recognize pressure tactic, ignore", score: 0 } // Green
			],
			attackVector: ["Deadline Attack", "Urgency Scam"]
		},
		"2.2": {
			indicator: "Time pressure cognitive degradation",
			scenario: "Limited time offer: Free gift card - only 5 minutes left!",
			choices: [
				{ text: "Rush to claim before timeout", score: 2 }, // Red
				{ text: "Interested but suspicious", score: 1 }, // Yellow
				{ text: "Ignore - legitimate offers don't expire in minutes", score: 0 } // Green
			],
			attackVector: ["Time-bomb Malware", "Flash Sales Scam"]
		}
	},

	// Category 3: Social Influence (Cialdini, 2007)
	socialInfluence: {
		"3.3": {
			indicator: "Social proof manipulation",
			scenario: "9 out of 10 people in your area already updated their security - click here",
			choices: [
				{ text: "Don't want to be the only one unprotected", score: 2 }, // Red
				{ text: "Wonder who these 9 people are", score: 1 }, // Yellow
				{ text: "Recognize social pressure tactic", score: 0 } // Green
			],
			attackVector: ["Social Engineering", "Fake Surveys"]
		}
	},

	// Category 4: Affective Vulnerabilities (Klein, 1946)
	affectiveVulnerabilities: {
		"4.1": {
			indicator: "Fear-based decision paralysis",
			scenario: "WARNING: Virus detected on your device! Call this number NOW",
			choices: [
				{ text: "Panic and call immediately", score: 2 }, // Red
				{ text: "Worried but pause to think", score: 1 }, // Yellow
				{ text: "Recognize fear-mongering tactic", score: 0 } // Green
			],
			attackVector: ["Scareware", "FUD Campaign"]
		},
		"4.7": {
			indicator: "Anxiety-triggered mistakes",
			scenario: "Your grandson is in trouble and needs money wired immediately",
			choices: [
				{ text: "Send money right away to help", score: 2 }, // Red
				{ text: "Very worried but try to verify", score: 1 }, // Yellow
				{ text: "Call grandson directly first", score: 0 } // Green
			],
			attackVector: ["Grandparent Scam", "Emergency Scam"]
		}
	},

	// Scoring Algorithm
	calculateVulnerability: function (responses) {
		let categoryScores = {
			authority: 0,
			temporal: 0,
			social: 0,
			affective: 0,
			cognitive: 0
		};

		responses.forEach(response => {
			const category = response.indicatorId.split('.')[0];
			const score = response.selectedChoice.score;

			// Weight based on CPF research
			const weight = this.getIndicatorWeight(response.indicatorId);

			switch (category) {
				case '1': categoryScores.authority += score * weight; break;
				case '2': categoryScores.temporal += score * weight; break;
				case '3': categoryScores.social += score * weight; break;
				case '4': categoryScores.affective += score * weight; break;
				case '5': categoryScores.cognitive += score * weight; break;
			}
		});

		return {
			overallRisk: this.calculateOverallRisk(categoryScores),
			categoryScores: categoryScores,
			recommendations: this.generateRecommendations(categoryScores),
			predictedAttackVectors: this.predictAttackVectors(categoryScores)
		};
	},

	getIndicatorWeight: function (indicatorId) {
		// Based on CPF empirical validation (hypothetical values)
		const weights = {
			"1.1": 1.5,  // High correlation with successful attacks
			"1.3": 1.3,
			"2.1": 1.8,  // Urgency is highly effective
			"2.2": 1.4,
			"3.3": 1.2,
			"4.1": 1.6,  // Fear is powerful motivator
			"4.7": 1.7   // Anxiety about loved ones
		};
		return weights[indicatorId] || 1.0;
	},

	predictAttackVectors: function (scores) {
		let predictions = [];

		if (scores.authority > 15) {
			predictions.push({
				vector: "CEO Fraud",
				probability: "HIGH",
				description: "Susceptible to authority impersonation attacks"
			});
		}

		if (scores.temporal > 12) {
			predictions.push({
				vector: "Urgency Scams",
				probability: "HIGH",
				description: "Vulnerable to time-pressure manipulation"
			});
		}

		if (scores.affective > 14) {
			predictions.push({
				vector: "Emotional Manipulation",
				probability: "HIGH",
				description: "Fear/anxiety can override judgment"
			});
		}

		return predictions;
	}
};

// Usage Example
const userResponses = [
	{ indicatorId: "1.1", selectedChoice: { score: 2 } },
	{ indicatorId: "2.1", selectedChoice: { score: 1 } },
	{ indicatorId: "4.1", selectedChoice: { score: 2 } }
];

const assessment = CPFAssessment.calculateVulnerability(userResponses);
console.log("Risk Level:", assessment.overallRisk);
console.log("Predicted Attacks:", assessment.predictedAttackVectors);