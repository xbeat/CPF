// ============================================
// I18N UTILITIES FOR CPF DASHBOARD
// ============================================
// Reusable i18n system for all dashboard applications
// Based on CPF website i18n implementation

/**
 * Get current language from localStorage or default to 'en'
 * Uses 'cpf-lang' key - same as website for consistency
 */
function getCurrentLanguage() {
	return localStorage.getItem('cpf-lang') || 'en';
}

/**
 * Set current language and persist to localStorage
 * @param {string} lang - Language code (en, it, es, fr, de)
 */
function setCurrentLanguage(lang) {
	localStorage.setItem('cpf-lang', lang);
	document.documentElement.lang = lang;
}

/**
 * Get translation by key with fallback to English
 * @param {string} key - Translation key (e.g., 'nav.home')
 * @param {string} lang - Language code
 * @param {object} translations - Translations object
 * @returns {string} Translated string or key if not found
 */
function t(key, lang, translations) {
	// Try requested language first
	if (translations[lang] && translations[lang][key]) {
		return translations[lang][key];
	}

	// Fallback to English
	if (translations['en'] && translations['en'][key]) {
		return translations['en'][key];
	}

	// Return key if no translation found
	console.warn(`Translation missing for key: ${key} in language: ${lang}`);
	return key;
}

/**
 * Update all elements with data-i18n attribute
 * @param {string} lang - Language code
 * @param {object} translations - Translations object
 */
function updateI18nElements(lang, translations) {
	document.querySelectorAll('[data-i18n]').forEach(element => {
		const key = element.getAttribute('data-i18n');
		const translation = t(key, lang, translations);

		// Handle different element types
		if (element.hasAttribute('data-i18n-placeholder')) {
			element.placeholder = translation;
		} else if (element.hasAttribute('data-i18n-title')) {
			element.title = translation;
		} else if (element.hasAttribute('data-i18n-value')) {
			element.value = translation;
		} else {
			element.innerHTML = translation;
		}
	});
}

/**
 * Update meta tags with translations
 * @param {string} lang - Language code
 * @param {object} translations - Translations object
 */
function updateMetaTags(lang, translations) {
	const metaTitle = document.querySelector('title');
	const metaDescription = document.querySelector('meta[name="description"]');
	const metaKeywords = document.querySelector('meta[name="keywords"]');
	const metaAuthor = document.querySelector('meta[name="author"]');

	if (metaTitle && translations[lang] && translations[lang]['meta.title']) {
		metaTitle.textContent = t('meta.title', lang, translations);
	}
	if (metaDescription && translations[lang] && translations[lang]['meta.description']) {
		metaDescription.setAttribute('content', t('meta.description', lang, translations));
	}
	if (metaKeywords && translations[lang] && translations[lang]['meta.keywords']) {
		metaKeywords.setAttribute('content', t('meta.keywords', lang, translations));
	}
	if (metaAuthor && translations[lang] && translations[lang]['meta.author']) {
		metaAuthor.setAttribute('content', t('meta.author', lang, translations));
	}

	// Update Open Graph tags
	const ogTitle = document.querySelector('meta[property="og:title"]');
	const ogDescription = document.querySelector('meta[property="og:description"]');
	const twitterTitle = document.querySelector('meta[property="twitter:title"]');
	const twitterDescription = document.querySelector('meta[property="twitter:description"]');

	if (ogTitle && translations[lang] && translations[lang]['meta.title']) {
		ogTitle.setAttribute('content', t('meta.title', lang, translations));
	}
	if (ogDescription && translations[lang] && translations[lang]['meta.description']) {
		ogDescription.setAttribute('content', t('meta.description', lang, translations));
	}
	if (twitterTitle && translations[lang] && translations[lang]['meta.title']) {
		twitterTitle.setAttribute('content', t('meta.title', lang, translations));
	}
	if (twitterDescription && translations[lang] && translations[lang]['meta.description']) {
		twitterDescription.setAttribute('content', t('meta.description', lang, translations));
	}
}

/**
 * Update language switcher active state
 * @param {string} lang - Language code
 */
function updateLanguageSwitcher(lang) {
	document.querySelectorAll('.lang-switcher button, .lang-switcher-auditing button, .lang-btn').forEach(btn => {
		const btnLang = btn.getAttribute('data-lang');
		if (btnLang === lang) {
			btn.classList.add('active');
		} else {
			btn.classList.remove('active');
		}
	});
}

/**
 * Update language-specific links
 * @param {string} lang - Language code
 */
function updateLanguageLinks(lang) {
	document.querySelectorAll('.lang-link').forEach(link => {
		const hrefAttr = `data-href-${lang}`;
		const href = link.getAttribute(hrefAttr);
		if (href) {
			link.setAttribute('href', href);
		}
	});
}

/**
 * Main function to set language and update all UI elements
 * @param {string} lang - Language code
 * @param {object} translations - Translations object
 * @param {function} callback - Optional callback after language change
 */
function setLanguage(lang, translations, callback) {
	// Validate language
	if (!translations[lang]) {
		console.warn(`Language '${lang}' not available, falling back to 'en'`);
		lang = 'en';
	}

	// Store current language
	setCurrentLanguage(lang);

	// Update all i18n elements
	updateI18nElements(lang, translations);

	// Update meta tags
	updateMetaTags(lang, translations);

	// Update language switcher UI
	updateLanguageSwitcher(lang);

	// Update language-specific links
	updateLanguageLinks(lang);

	// Call optional callback for custom updates
	if (typeof callback === 'function') {
		callback(lang);
	}

	// Dispatch custom event for other components to react
	const event = new CustomEvent('languageChanged', { detail: { lang } });
	document.dispatchEvent(event);

	console.log(`✅ Language changed to: ${lang}`);
}

/**
 * Initialize language system on page load
 * @param {object} translations - Translations object
 * @param {function} callback - Optional callback after initialization
 */
function initLanguage(translations, callback) {
	const currentLang = getCurrentLanguage();

	// Set up language switcher event listeners
	document.querySelectorAll('.lang-switcher button, .lang-switcher-auditing button, .lang-btn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			const lang = btn.getAttribute('data-lang');
			if (lang) {
				setLanguage(lang, translations, callback);
			}
		});
	});

	// Apply language
	setLanguage(currentLang, translations, callback);

	console.log(`✅ i18n initialized with language: ${currentLang}`);
}

/**
 * Helper to create language switcher HTML
 * @param {array} languages - Array of language codes (e.g., ['en', 'it'])
 * @returns {string} HTML for language switcher
 */
function createLanguageSwitcher(languages = ['en', 'it']) {
	return `
		<div class="lang-switcher">
			${languages.map(lang => `
				<button class="lang-btn" data-lang="${lang}">
					${lang.toUpperCase()}
				</button>
			`).join('')}
		</div>
	`;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		getCurrentLanguage,
		setCurrentLanguage,
		t,
		updateI18nElements,
		updateMetaTags,
		updateLanguageSwitcher,
		updateLanguageLinks,
		setLanguage,
		initLanguage,
		createLanguageSwitcher
	};
}
