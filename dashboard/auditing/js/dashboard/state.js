export let organizations = [];
export let selectedOrgId = null;
export let selectedOrgData = null;
export let categoryFilter = null;
export let sortDirection = 'desc';
export let categoryDescriptions = null;
export let currentOrgLanguage = 'en-US';

// Setters
export function setOrganizations(orgs) { organizations = orgs; }
export function setSelectedOrgId(id) { selectedOrgId = id; }
export function setSelectedOrgData(data) { selectedOrgData = data; }
export function setCategoryFilter(filter) { categoryFilter = filter; }
export function setSortDirection(dir) { sortDirection = dir; }
export function setCategoryDescriptions(desc) { categoryDescriptions = desc; }
export function setCurrentOrgLanguage(lang) { currentOrgLanguage = lang; }