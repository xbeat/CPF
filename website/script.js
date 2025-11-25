// ============================================
// I18N SYSTEM
// ============================================

// Get current language from localStorage or default to 'en'
let currentLang = localStorage.getItem('cpf-lang') || 'en';

// Set language and update all elements
function setLanguage(lang) {
	currentLang = lang;
	localStorage.setItem('cpf-lang', lang);

	// Update HTML lang attribute
	document.documentElement.lang = lang;

	// Update all elements with data-i18n attribute
	document.querySelectorAll('[data-i18n]').forEach(element => {
		const key = element.getAttribute('data-i18n');
		const translation = t(key, lang);

		if (element.hasAttribute('data-i18n-placeholder')) {
			element.placeholder = translation;
		} else {
			element.innerHTML = translation;
		}
	});

	// Update meta tags
	updateMetaTags(lang);

	// Update language switcher active state
	updateLanguageSwitcher(lang);
}

// Update meta tags
function updateMetaTags(lang) {
	const metaTitle = document.querySelector('title');
	const metaDescription = document.querySelector('meta[name="description"]');
	const metaKeywords = document.querySelector('meta[name="keywords"]');
	const metaAuthor = document.querySelector('meta[name="author"]');

	if (metaTitle) metaTitle.textContent = t('meta.title', lang);
	if (metaDescription) metaDescription.setAttribute('content', t('meta.description', lang));
	if (metaKeywords) metaKeywords.setAttribute('content', t('meta.keywords', lang));
	if (metaAuthor) metaAuthor.setAttribute('content', t('meta.author', lang));

	// Update Open Graph tags
	const ogTitle = document.querySelector('meta[property="og:title"]');
	const ogDescription = document.querySelector('meta[property="og:description"]');
	const twitterTitle = document.querySelector('meta[property="twitter:title"]');
	const twitterDescription = document.querySelector('meta[property="twitter:description"]');

	if (ogTitle) ogTitle.setAttribute('content', t('meta.title', lang));
	if (ogDescription) ogDescription.setAttribute('content', t('meta.description', lang));
	if (twitterTitle) twitterTitle.setAttribute('content', t('meta.title', lang));
	if (twitterDescription) twitterDescription.setAttribute('content', t('meta.description', lang));
}

// Update language switcher active state
function updateLanguageSwitcher(lang) {
	document.querySelectorAll('.lang-switcher button').forEach(btn => {
		btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
	});
}

// Initialize language on page load
function initLanguage() {
	setLanguage(currentLang);
}

// ============================================
// CATEGORIES DATA
// ============================================

// Categories data from the CPF framework
const categoriesData = [
	{
		code: '[1.x]',
		title: 'Authority-Based Vulnerabilities',
		reference: 'Milgram (1974)',
		description: 'Vulnerabilities arising from obedience to authority figures and hierarchical structures in organizational contexts.',
		subcategories: [
			{ code: '1.1', title: 'Unquestioning compliance with apparent authority', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/1.x-authority/cpf_indicator_1_1_foundation.md' },
			{ code: '1.2', title: 'Diffusion of responsibility in hierarchical structures', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/1.x-authority/cpf_indicator_1_2_foundation.md' },
			{ code: '1.3', title: 'Authority figure impersonation susceptibility', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/1.x-authority/cpf_indicator_1_3_foundation.md' },
			{ code: '1.4', title: 'Bypassing security for superior\'s convenience', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/1.x-authority/cpf_indicator_1_4_foundation.md' },
			{ code: '1.5', title: 'Fear-based compliance without verification', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/1.x-authority/cpf_indicator_1_5_foundation.md' },
			{ code: '1.6', title: 'Authority gradient inhibiting security reporting', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/1.x-authority/cpf_indicator_1_6_foundation.md' },
			{ code: '1.7', title: 'Deference to technical authority claims', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/1.x-authority/cpf_indicator_1_7_foundation.md' },
			{ code: '1.8', title: 'Executive exception normalization', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/1.x-authority/cpf_indicator_1_8_foundation.md' },
			{ code: '1.9', title: 'Authority-based social proof', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/1.x-authority/cpf_indicator_1_9_foundation.md' },
			{ code: '1.10', title: 'Crisis authority escalation', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/1.x-authority/cpf_indicator_1_10_foundation.md' }
		]
	},
	{
		code: '[2.x]',
		title: 'Temporal Vulnerabilities',
		reference: 'Kahneman & Tversky (1979)',
		description: 'Time-pressure and temporal bias-related security vulnerabilities that affect decision-making quality.',
		subcategories: [
			{ code: '2.1', title: 'Urgency-induced security bypass', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/2.x-temporal/cpf_indicator_2_1_foundation.md' },
			{ code: '2.2', title: 'Time pressure cognitive degradation', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/2.x-temporal/cpf_indicator_2_2_foundation.md' },
			{ code: '2.3', title: 'Deadline-driven risk acceptance', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/2.x-temporal/cpf_indicator_2_3_foundation.md' },
			{ code: '2.4', title: 'Present bias in security investments', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/2.x-temporal/cpf_indicator_2_4_foundation.md' },
			{ code: '2.5', title: 'Hyperbolic discounting of future threats', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/2.x-temporal/cpf_indicator_2_5_foundation.md' },
			{ code: '2.6', title: 'Temporal exhaustion patterns', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/2.x-temporal/cpf_indicator_2_6_foundation.md' },
			{ code: '2.7', title: 'Time-of-day vulnerability windows', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/2.x-temporal/cpf_indicator_2_7_foundation.md' },
			{ code: '2.8', title: 'Weekend/holiday security lapses', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/2.x-temporal/cpf_indicator_2_8_foundation.md' },
			{ code: '2.9', title: 'Shift change exploitation windows', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/2.x-temporal/cpf_indicator_2_9_foundation.md' },
			{ code: '2.10', title: 'Temporal consistency pressure', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/2.x-temporal/cpf_indicator_2_10_foundation.md' }
		]
	},
	{
		code: '[3.x]',
		title: 'Social Influence Vulnerabilities',
		reference: 'Cialdini (2007)',
		description: 'Vulnerabilities based on Cialdini\'s six principles of influence mapped to cybersecurity contexts.',
		subcategories: [
			{ code: '3.1', title: 'Reciprocity exploitation', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/3.x-social/cpf_indicator_3_1_foundation.md' },
			{ code: '3.2', title: 'Commitment escalation traps', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/3.x-social/cpf_indicator_3_2_foundation.md' },
			{ code: '3.3', title: 'Social proof manipulation', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/3.x-social/cpf_indicator_3_3_foundation.md' },
			{ code: '3.4', title: 'Liking-based trust override', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/3.x-social/cpf_indicator_3_4_foundation.md' },
			{ code: '3.5', title: 'Scarcity-driven decisions', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/3.x-social/cpf_indicator_3_5_foundation.md' },
			{ code: '3.6', title: 'Unity principle exploitation', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/3.x-social/cpf_indicator_3_6_foundation.md' },
			{ code: '3.7', title: 'Peer pressure compliance', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/3.x-social/cpf_indicator_3_7_foundation.md' },
			{ code: '3.8', title: 'Conformity to insecure norms', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/3.x-social/cpf_indicator_3_8_foundation.md' },
			{ code: '3.9', title: 'Social identity threats', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/3.x-social/cpf_indicator_3_9_foundation.md' },
			{ code: '3.10', title: 'Reputation management conflicts', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/3.x-social/cpf_indicator_3_10_foundation.md' }
		]
	},
	{
		code: '[4.x]',
		title: 'Affective Vulnerabilities',
		reference: 'Klein (1946), Bowlby (1969)',
		description: 'Emotional and attachment-based vulnerabilities affecting security behaviors and decision-making.',
		subcategories: [
			{ code: '4.1', title: 'Fear-based decision paralysis', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/4.x-affective/cpf_indicator_4_1_foundation.md' },
			{ code: '4.2', title: 'Anger-induced risk taking', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/4.x-affective/cpf_indicator_4_2_foundation.md' },
			{ code: '4.3', title: 'Trust transference to systems', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/4.x-affective/cpf_indicator_4_3_foundation.md' },
			{ code: '4.4', title: 'Attachment to legacy systems', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/4.x-affective/cpf_indicator_4_4_foundation.md' },
			{ code: '4.5', title: 'Shame-based security hiding', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/4.x-affective/cpf_indicator_4_5_foundation.md' },
			{ code: '4.6', title: 'Guilt-driven overcompliance', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/4.x-affective/cpf_indicator_4_6_foundation.md' },
			{ code: '4.7', title: 'Anxiety-triggered mistakes', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/4.x-affective/cpf_indicator_4_7_foundation.md' },
			{ code: '4.8', title: 'Depression-related negligence', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/4.x-affective/cpf_indicator_4_8_foundation.md' },
			{ code: '4.9', title: 'Euphoria-induced carelessness', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/4.x-affective/cpf_indicator_4_9_foundation.md' },
			{ code: '4.10', title: 'Emotional contagion effects', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/4.x-affective/cpf_indicator_4_10_foundation.md' }
		]
	},
	{
		code: '[5.x]',
		title: 'Cognitive Overload Vulnerabilities',
		reference: 'Miller (1956)',
		description: 'Vulnerabilities arising from cognitive limitations and information processing overload in security contexts.',
		subcategories: [
			{ code: '5.1', title: 'Alert fatigue desensitization', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/5.x-cognitive/cpf_indicator_5_1_foundation.md' },
			{ code: '5.2', title: 'Decision fatigue errors', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/5.x-cognitive/cpf_indicator_5_2_foundation.md' },
			{ code: '5.3', title: 'Information overload paralysis', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/5.x-cognitive/cpf_indicator_5_3_foundation.md' },
			{ code: '5.4', title: 'Multitasking degradation', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/5.x-cognitive/cpf_indicator_5_4_foundation.md' },
			{ code: '5.5', title: 'Context switching vulnerabilities', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/5.x-cognitive/cpf_indicator_5_5_foundation.md' },
			{ code: '5.6', title: 'Cognitive tunneling', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/5.x-cognitive/cpf_indicator_5_6_foundation.md' },
			{ code: '5.7', title: 'Working memory overflow', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/5.x-cognitive/cpf_indicator_5_7_foundation.md' },
			{ code: '5.8', title: 'Attention residue effects', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/5.x-cognitive/cpf_indicator_5_8_foundation.md' },
			{ code: '5.9', title: 'Complexity-induced errors', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/5.x-cognitive/cpf_indicator_5_9_foundation.md' },
			{ code: '5.10', title: 'Mental model confusion', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/5.x-cognitive/cpf_indicator_5_10_foundation.md' }
		]
	},
	{
		code: '[6.x]',
		title: 'Group Dynamic Vulnerabilities',
		reference: 'Bion (1961)',
		description: 'Vulnerabilities emerging from group psychology and collective unconscious processes in organizations.',
		subcategories: [
			{ code: '6.1', title: 'Groupthink security blind spots', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/6.x-group/cpf_indicator_6_1_foundation.md' },
			{ code: '6.2', title: 'Risky shift phenomena', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/6.x-group/cpf_indicator_6_2_foundation.md' },
			{ code: '6.3', title: 'Diffusion of responsibility', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/6.x-group/cpf_indicator_6_3_foundation.md' },
			{ code: '6.4', title: 'Social loafing in security tasks', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/6.x-group/cpf_indicator_6_4_foundation.md' },
			{ code: '6.5', title: 'Bystander effect in incident response', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/6.x-group/cpf_indicator_6_5_foundation.md' },
			{ code: '6.6', title: 'Dependency group assumptions', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/6.x-group/cpf_indicator_6_6_foundation.md' },
			{ code: '6.7', title: 'Fight-flight security postures', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/6.x-group/cpf_indicator_6_7_foundation.md' },
			{ code: '6.8', title: 'Pairing hope fantasies', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/6.x-group/cpf_indicator_6_8_foundation.md' },
			{ code: '6.9', title: 'Organizational splitting', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/6.x-group/cpf_indicator_6_9_foundation.md' },
			{ code: '6.10', title: 'Collective defense mechanisms', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/6.x-group/cpf_indicator_6_10_foundation.md' }
		]
	},
	{
		code: '[7.x]',
		title: 'Stress Response Vulnerabilities',
		reference: 'Selye (1956)',
		description: 'Vulnerabilities related to stress responses and their impact on security behavior and performance.',
		subcategories: [
			{ code: '7.1', title: 'Acute stress impairment', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/7.x-stress/cpf_indicator_7_1_foundation.md' },
			{ code: '7.2', title: 'Chronic stress burnout', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/7.x-stress/cpf_indicator_7_2_foundation.md' },
			{ code: '7.3', title: 'Fight response aggression', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/7.x-stress/cpf_indicator_7_3_foundation.md' },
			{ code: '7.4', title: 'Flight response avoidance', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/7.x-stress/cpf_indicator_7_4_foundation.md' },
			{ code: '7.5', title: 'Freeze response paralysis', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/7.x-stress/cpf_indicator_7_5_foundation.md' },
			{ code: '7.6', title: 'Fawn response overcompliance', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/7.x-stress/cpf_indicator_7_6_foundation.md' },
			{ code: '7.7', title: 'Stress-induced tunnel vision', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/7.x-stress/cpf_indicator_7_7_foundation.md' },
			{ code: '7.8', title: 'Cortisol-impaired memory', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/7.x-stress/cpf_indicator_7_8_foundation.md' },
			{ code: '7.9', title: 'Stress contagion cascades', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/7.x-stress/cpf_indicator_7_9_foundation.md' },
			{ code: '7.10', title: 'Recovery period vulnerabilities', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/7.x-stress/cpf_indicator_7_10_foundation.md' }
		]
	},
	{
		code: '[8.x]',
		title: 'Unconscious Process Vulnerabilities',
		reference: 'Jung (1969)',
		description: 'Deep psychological vulnerabilities based on Jungian concepts and unconscious organizational dynamics.',
		subcategories: [
			{ code: '8.1', title: 'Shadow projection onto attackers', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/8.x-unconscious/cpf_indicator_8_1_foundation.md' },
			{ code: '8.2', title: 'Unconscious identification with threats', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/8.x-unconscious/cpf_indicator_8_2_foundation.md' },
			{ code: '8.3', title: 'Repetition compulsion patterns', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/8.x-unconscious/cpf_indicator_8_3_foundation.md' },
			{ code: '8.4', title: 'Transference to authority figures', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/8.x-unconscious/cpf_indicator_8_4_foundation.md' },
			{ code: '8.5', title: 'Countertransference blind spots', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/8.x-unconscious/cpf_indicator_8_5_foundation.md' },
			{ code: '8.6', title: 'Defense mechanism interference', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/8.x-unconscious/cpf_indicator_8_6_foundation.md' },
			{ code: '8.7', title: 'Symbolic equation confusion', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/8.x-unconscious/cpf_indicator_8_7_foundation.md' },
			{ code: '8.8', title: 'Archetypal activation triggers', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/8.x-unconscious/cpf_indicator_8_8_foundation.md' },
			{ code: '8.9', title: 'Collective unconscious patterns', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/8.x-unconscious/cpf_indicator_8_9_foundation.md' },
			{ code: '8.10', title: 'Dream logic in digital spaces', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/8.x-unconscious/cpf_indicator_8_10_foundation.md' }
		]
	},
	{
		code: '[9.x]',
		title: 'AI-Specific Bias Vulnerabilities',
		reference: 'Novel Integration',
		description: 'Emerging vulnerabilities specific to human-AI interactions and artificial intelligence systems in security contexts.',
		subcategories: [
			{ code: '9.1', title: 'Anthropomorphization of AI systems', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/9.x-ai/cpf_indicator_9_1_foundation.md' },
			{ code: '9.2', title: 'Automation bias override', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/9.x-ai/cpf_indicator_9_2_foundation.md' },
			{ code: '9.3', title: 'Algorithm aversion paradox', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/9.x-ai/cpf_indicator_9_3_foundation.md' },
			{ code: '9.4', title: 'AI authority transfer', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/9.x-ai/cpf_indicator_9_4_foundation.md' },
			{ code: '9.5', title: 'Uncanny valley effects', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/9.x-ai/cpf_indicator_9_5_foundation.md' },
			{ code: '9.6', title: 'Machine learning opacity trust', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/9.x-ai/cpf_indicator_9_6_foundation.md' },
			{ code: '9.7', title: 'AI hallucination acceptance', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/9.x-ai/cpf_indicator_9_7_foundation.md' },
			{ code: '9.8', title: 'Human-AI team dysfunction', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/9.x-ai/cpf_indicator_9_8_foundation.md' },
			{ code: '9.9', title: 'AI emotional manipulation', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/9.x-ai/cpf_indicator_9_9_foundation.md' },
			{ code: '9.10', title: 'Algorithmic fairness blindness', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/9.x-ai/cpf_indicator_9_10_foundation.md' }
		]
	},
	{
		code: '[10.x]',
		title: 'Critical Convergent States',
		reference: 'System Theory',
		description: 'Complex system vulnerabilities where multiple factors converge to create critical failure conditions.',
		subcategories: [
			{ code: '10.1', title: 'Perfect storm conditions', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/10.x-convergent/cpf_indicator_10_1_foundation.md' },
			{ code: '10.2', title: 'Cascade failure triggers', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/10.x-convergent/cpf_indicator_10_2_foundation.md' },
			{ code: '10.3', title: 'Tipping point vulnerabilities', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/10.x-convergent/cpf_indicator_10_3_foundation.md' },
			{ code: '10.4', title: 'Swiss cheese alignment', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/10.x-convergent/cpf_indicator_10_4_foundation.md' },
			{ code: '10.5', title: 'Black swan blindness', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/10.x-convergent/cpf_indicator_10_5_foundation.md' },
			{ code: '10.6', title: 'Gray rhino denial', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/10.x-convergent/cpf_indicator_10_6_foundation.md' },
			{ code: '10.7', title: 'Complexity catastrophe', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/10.x-convergent/cpf_indicator_10_7_foundation.md' },
			{ code: '10.8', title: 'Emergence unpredictability', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/10.x-convergent/cpf_indicator_10_8_foundation.md' },
			{ code: '10.9', title: 'System coupling failures', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/10.x-convergent/cpf_indicator_10_9_foundation.md' },
			{ code: '10.10', title: 'Hysteresis security gaps', githubLink: 'https://github.com/xbeat/CPF/blob/main/auditor%20field%20kit/10.x-convergent/cpf_indicator_10_10_foundation.md' }
		]
	}
];

// Render categories
function renderCategories() {
	const categoriesGrid = document.getElementById('categoriesGrid');
	categoriesGrid.innerHTML = '';

	categoriesData.forEach((category, index) => {
		const categoryCard = document.createElement('div');
		categoryCard.className = 'category-card';
		categoryCard.innerHTML = `
			<div class="category-header">
				<div>
					<div class="category-code">${category.code}</div>
					<div class="category-title">${category.title}</div>
					<div class="category-reference">${category.reference}</div>
				</div>
				<div class="category-expand">▼</div>
			</div>
			<div class="category-content">
				<div class="category-description">${category.description}</div>
				<div class="subcategories">
					${category.subcategories.map(sub => `
						<div class="subcategory-item" data-github-link="${sub.githubLink}">
							<div class="subcategory-code">${sub.code}</div>
							<div class="subcategory-title">${sub.title}</div>
						</div>
					`).join('')}
				</div>
			</div>
		`;

		// Aggiungi event listener per l'header della categoria (per aprire/chiudere l'accordion)
		const categoryHeader = categoryCard.querySelector('.category-header');
		categoryHeader.addEventListener('click', (e) => {
			categoryCard.classList.toggle('active');
		});
		
		// Aggiungi event listener per le sottocategorie (per aprire il link GitHub)
		const subcategoryItems = categoryCard.querySelectorAll('.subcategory-item');
		subcategoryItems.forEach(item => {
			item.addEventListener('click', (e) => {
				e.stopPropagation(); // Impedisce che l'evento si propaghi all'accordion
				const githubLink = item.getAttribute('data-github-link');
				if (githubLink) {
					window.open(githubLink, '_blank');
				}
			});
		});

		categoriesGrid.appendChild(categoryCard);
	});
}

// Mobile menu functionality
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle.addEventListener('click', () => {
	menuToggle.classList.toggle('active');
	mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-nav-links a').forEach(link => {
	link.addEventListener('click', () => {
		menuToggle.classList.remove('active');
		mobileMenu.classList.remove('active');
	});
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
	if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
		menuToggle.classList.remove('active');
		mobileMenu.classList.remove('active');
	}
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute('href'));
		if (target) {
			target.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	});
});

// Add scroll effect to navigation
window.addEventListener('scroll', () => {
	const nav = document.querySelector('.nav');
	if (window.scrollY > 100) {
		nav.style.background = 'rgba(10, 10, 10, 0.98)';
	} else {
		nav.style.background = 'rgba(10, 10, 10, 0.95)';
	}
});

// Intersection Observer for fade-in animations
const observerOptions = {
	threshold: 0.1,
	rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.style.opacity = '1';
			entry.target.style.transform = 'translateY(0)';
		}
	});
}, observerOptions);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
	// Initialize language system
	initLanguage();

	renderCategories();

	// Setup language switcher event listeners
	document.querySelectorAll('.lang-switcher button').forEach(btn => {
		btn.addEventListener('click', () => {
			const lang = btn.getAttribute('data-lang');
			setLanguage(lang);
		});
	});

	// Observe all cards for animation
	setTimeout(() => {
		document.querySelectorAll('.framework-card, .category-card, .stat-card').forEach(card => {
			card.style.opacity = '0';
			card.style.transform = 'translateY(30px)';
			card.style.transition = 'all 0.6s ease';
			observer.observe(card);
		});
	}, 100);
});