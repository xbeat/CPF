/**
 * CPF Dashboard - Shared UI Utilities
 * Common UI functions used across different dashboard modules
 * Refactored from auditing/dashboard.js and soc/dashboard.js
 *
 * This file is loaded as a traditional script (not ES6 module) for compatibility
 * with inline event handlers in HTML.
 */

(function() {
    'use strict';

    // ===== MODAL STACK MANAGEMENT =====
    // Global modal stack to track open modals
    window.modalStack = window.modalStack || [];

    /**
     * Add a modal to the stack
     * @param {string} modalId - The ID of the modal to push
     */
    window.pushModal = function(modalId) {
        if (!window.modalStack.includes(modalId)) {
            window.modalStack.push(modalId);
        }
    };

    /**
     * Remove a modal from the stack
     * @param {string} modalId - The ID of the modal to remove
     */
    window.popModal = function(modalId) {
        const index = window.modalStack.indexOf(modalId);
        if (index > -1) {
            window.modalStack.splice(index, 1);
        }
    };

    /**
     * Get the most recently opened modal
     * @returns {string|null} The ID of the top modal or null if stack is empty
     */
    window.getTopModal = function() {
        return window.modalStack.length > 0 ? window.modalStack[window.modalStack.length - 1] : null;
    };

    /**
     * Clear all modals from the stack
     */
    window.clearModalStack = function() {
        window.modalStack = [];
    };

    // ===== SIDEBAR MANAGEMENT =====

    /**
     * Open sidebar - idempotent (do nothing if already open)
     */
    window.openSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        const main = document.getElementById('dashboardMain');
        const openBtn = document.getElementById('sidebarOpenBtn');

        // If already open, do nothing
        if (!sidebar.classList.contains('sidebar-hidden')) {
            return;
        }

        // Remove hidden class and collapsed state
        sidebar.classList.remove('sidebar-hidden');
        main.classList.remove('sidebar-collapsed');

        // Hide open button
        if (openBtn) {
            openBtn.style.display = 'none';
        }
    };

    /**
     * Close sidebar
     */
    window.closeSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        const main = document.getElementById('dashboardMain');
        const openBtn = document.getElementById('sidebarOpenBtn');

        // Hide sidebar and mark main as collapsed
        sidebar.classList.add('sidebar-hidden');
        main.classList.add('sidebar-collapsed');

        // Show open button
        if (openBtn) {
            openBtn.style.display = 'inline-flex';
        }
    };

    /**
     * Toggle sidebar open/closed state
     */
    window.toggleSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('sidebar-hidden')) {
            window.openSidebar();
        } else {
            window.closeSidebar();
        }
    };

    // ===== ALERT/NOTIFICATION MANAGEMENT =====

    /**
     * Show an alert notification
     * @param {string} message - The message to display
     * @param {string} type - The type of alert ('info', 'success', 'warning', 'error')
     * @param {number} duration - Duration in milliseconds (default: 5000)
     */
    window.showAlert = function(message, type = 'info', duration = 5000) {
        const container = document.getElementById('alertContainer');
        if (!container) {
            console.warn('Alert container not found, logging message:', message);
            return;
        }

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        container.appendChild(alert);

        // Auto-remove after duration
        setTimeout(() => {
            alert.remove();
        }, duration);
    };

    // ===== HTML/TEXT UTILITIES =====

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} text - The text to escape
     * @returns {string} HTML-escaped text
     */
    window.escapeHtml = function(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    /**
     * Capitalize first letter of a string
     * @param {string} str - The string to capitalize
     * @returns {string} String with first letter capitalized
     */
    window.capitalizeFirst = function(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    /**
     * Truncate text to a maximum length
     * @param {string} text - The text to truncate
     * @param {number} maxLength - Maximum length
     * @param {string} suffix - Suffix to add when truncated (default: '...')
     * @returns {string} Truncated text
     */
    window.truncateText = function(text, maxLength, suffix = '...') {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    };

    // ===== FILTER/SORT UTILITIES =====

    /**
     * Toggle sort direction between ascending and descending
     * @param {string} currentDirection - Current direction ('asc' or 'desc')
     * @returns {string} New direction
     */
    window.toggleSortDirectionValue = function(currentDirection) {
        return currentDirection === 'desc' ? 'asc' : 'desc';
    };

    /**
     * Update sort direction UI button
     * @param {string} direction - Sort direction ('asc' or 'desc')
     * @param {string} buttonId - ID of the button element
     */
    window.updateSortDirectionButton = function(direction, buttonId = 'sort-direction') {
        const btn = document.getElementById(buttonId);
        if (btn) {
            btn.textContent = direction === 'desc' ? '⬇️' : '⬆️';
        }
    };

    /**
     * Generic filter function for arrays
     * @param {Array} items - Array of items to filter
     * @param {string} searchValue - Search term
     * @param {Function} searchFn - Function to extract searchable text from item
     * @returns {Array} Filtered items
     */
    window.filterItems = function(items, searchValue, searchFn) {
        if (!searchValue || !searchValue.trim()) return items;

        const lowerSearch = searchValue.toLowerCase().trim();
        return items.filter(item => {
            const searchableText = searchFn(item);
            return searchableText.toLowerCase().includes(lowerSearch);
        });
    };

    /**
     * Generic sort function for arrays
     * @param {Array} items - Array of items to sort
     * @param {string} sortKey - Key to sort by
     * @param {string} direction - Sort direction ('asc' or 'desc')
     * @param {Object} sortHandlers - Object mapping sort keys to comparison functions
     * @returns {Array} Sorted items
     */
    window.sortItems = function(items, sortKey, direction, sortHandlers) {
        const sorted = [...items];

        sorted.sort((a, b) => {
            let result = 0;

            if (sortHandlers[sortKey]) {
                result = sortHandlers[sortKey](a, b);
            } else {
                // Default: compare by key directly
                result = a[sortKey] > b[sortKey] ? 1 : (a[sortKey] < b[sortKey] ? -1 : 0);
            }

            return direction === 'desc' ? -result : result;
        });

        return sorted;
    };

    // ===== COUNTRY/LOCALE UTILITIES =====

    /**
     * Get country flag emoji from country code
     * @param {string} countryCode - ISO country code (e.g., 'IT', 'US')
     * @returns {string} Flag emoji or default globe emoji
     */
    window.getCountryFlag = function(countryCode) {
        const flags = {
            'IT': '🇮🇹',
            'US': '🇺🇸',
            'GB': '🇬🇧',
            'DE': '🇩🇪',
            'FR': '🇫🇷',
            'ES': '🇪🇸',
            'CA': '🇨🇦',
            'AU': '🇦🇺',
            'JP': '🇯🇵',
            'CN': '🇨🇳',
            'BR': '🇧🇷',
            'IN': '🇮🇳'
        };

        return flags[countryCode?.toUpperCase()] || '🌐';
    };

    /**
     * Format date to locale string
     * @param {string|Date} date - Date to format
     * @param {string} locale - Locale string (default: browser locale)
     * @returns {string} Formatted date string
     */
    window.formatDate = function(date, locale = navigator.language) {
        if (!date) return 'N/A';
        try {
            return new Date(date).toLocaleDateString(locale);
        } catch (e) {
            return 'Invalid Date';
        }
    };

    /**
     * Format date with time
     * @param {string|Date} date - Date to format
     * @param {string} locale - Locale string (default: browser locale)
     * @returns {string} Formatted date and time string
     */
    window.formatDateTime = function(date, locale = navigator.language) {
        if (!date) return 'N/A';
        try {
            return new Date(date).toLocaleString(locale);
        } catch (e) {
            return 'Invalid Date';
        }
    };

    // ===== RISK LEVEL UTILITIES =====

    /**
     * Get risk level class based on risk value
     * @param {number} riskValue - Risk value (0-1)
     * @returns {string} CSS class name
     */
    window.getRiskClass = function(riskValue) {
        if (riskValue < 0.3) return 'risk-low';
        if (riskValue < 0.7) return 'risk-medium';
        return 'risk-high';
    };

    /**
     * Get risk level label based on risk value
     * @param {number} riskValue - Risk value (0-1)
     * @returns {string} Risk label
     */
    window.getRiskLabel = function(riskValue) {
        if (riskValue < 0.3) return '🟢 Low';
        if (riskValue < 0.7) return '🟡 Medium';
        return '🔴 High';
    };

    /**
     * Get simple risk level (without emoji)
     * @param {number} riskValue - Risk value (0-1)
     * @returns {string} Risk level ('Low', 'Medium', 'High')
     */
    window.getSimpleRiskLevel = function(riskValue) {
        if (riskValue < 0.33) return 'Low';
        if (riskValue < 0.66) return 'Medium';
        return 'High';
    };

    // ===== PERCENTAGE FORMATTING =====

    /**
     * Format a number as percentage
     * @param {number} value - Value to format (0-1 or 0-100 depending on normalize param)
     * @param {number} decimals - Number of decimal places (default: 0)
     * @param {boolean} normalize - Whether to multiply by 100 (default: true)
     * @returns {string} Formatted percentage
     */
    window.formatPercentage = function(value, decimals = 0, normalize = true) {
        if (value === null || value === undefined) return 'N/A';
        const pct = normalize ? value * 100 : value;
        return `${pct.toFixed(decimals)}%`;
    };

    // ===== LOADING STATE MANAGEMENT =====

    /**
     * Show loading indicator
     * @param {string} elementId - ID of the element to show loading state
     * @param {string} message - Loading message (optional)
     */
    window.showLoading = function(elementId, message = 'Loading...') {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>${window.escapeHtml(message)}</p>
                </div>
            `;
            element.style.display = 'block';
        }
    };

    /**
     * Hide loading indicator
     * @param {string} elementId - ID of the element to hide
     */
    window.hideLoading = function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    };

    console.log('✅ CPF UI Utilities loaded successfully');

})();
