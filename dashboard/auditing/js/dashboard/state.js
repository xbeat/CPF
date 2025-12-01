let organizations = [];
let selectedOrgId = null;
let selectedOrgData = null;
let categoryFilter = null;
let sortDirection = 'desc';
let categoryDescriptions = null;
let currentOrgLanguage = 'en-US';

// Getters
export function getOrganizations() { return organizations; }
export function getSelectedOrgId() { return selectedOrgId; }
export function getSelectedOrgData() { return selectedOrgData; }
export function getCategoryFilter() { return categoryFilter; }
export function getSortDirection() { return sortDirection; }
export function getCategoryDescriptions() { return categoryDescriptions; }
export function getCurrentOrgLanguage() { return currentOrgLanguage; }

// Setters
export function setOrganizations(orgs) { organizations = orgs; }
export function setSelectedOrgId(id) { selectedOrgId = id; }
export function setSelectedOrgData(data) { selectedOrgData = data; }
export function setCategoryFilter(filter) { categoryFilter = filter; }
export function setSortDirection(dir) { sortDirection = dir; }
export function setCategoryDescriptions(desc) { categoryDescriptions = desc; }
export function setCurrentOrgLanguage(lang) { currentOrgLanguage = lang; }

// Legacy exports for backward compatibility (but recommend using getters)
export { organizations, selectedOrgId, selectedOrgData, categoryFilter, sortDirection, categoryDescriptions, currentOrgLanguage };