// Apply translations
function applyTranslations(lang) {
	const elements = document.querySelectorAll('[data-i18n]');
	elements.forEach(el => {
		const key = el.getAttribute('data-i18n');
		if (translations[lang] && translations[lang][key]) {
			el.textContent = translations[lang][key];
		}
	});
}

// Language switcher
const langButtons = document.querySelectorAll('[data-lang]');

langButtons.forEach(btn => {
	btn.addEventListener('click', function() {
		const lang = this.dataset.lang;
		
		// Update active state
		langButtons.forEach(b => b.classList.remove('active'));
		this.classList.add('active');
		
		// Apply translations
		applyTranslations(lang);
		
		// Update HTML lang attribute
		document.documentElement.lang = lang;
	});
});

// Copy citation button
document.getElementById('copyBtn').addEventListener('click', function() {
	const citation = 'Canale, G., & Thimmaraju, K. (2025). The Silicon Psyche: Anthropomorphic Vulnerabilities in Large Language Models. arXiv preprint arXiv:2601.00867.';
	navigator.clipboard.writeText(citation).then(() => {
		const lang = document.documentElement.lang;
		alert(lang === 'it' ? 'Citazione copiata!' : 'Citation copied!');
	});
});

// Initial load
applyTranslations('en');