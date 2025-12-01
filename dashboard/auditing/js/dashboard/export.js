import { selectedOrgData, selectedOrgId } from './state.js';
import { showAlert } from '../shared/utils.js';

function triggerDownload(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportCurrentOrgXLSX() {
    if (!selectedOrgId) return showAlert('No org selected', 'error');
    showAlert('Generating XLSX...', 'info');
    const url = `/api/organizations/${selectedOrgId}/export/xlsx?user=Dashboard`;
    triggerDownload(url, `Audit_${selectedOrgId}.xlsx`);
}

export function exportCurrentOrgPDF() {
    if (!selectedOrgId) return showAlert('No org selected', 'error');
    showAlert('Generating PDF...', 'info');
    const url = `/api/organizations/${selectedOrgId}/export/pdf?user=Dashboard`;
    triggerDownload(url, `Audit_${selectedOrgId}.pdf`);
}

export function exportCurrentOrgZIP() {
    if (!selectedOrgId) return showAlert('No org selected', 'error');
    showAlert('Generating ZIP...', 'info');
    const url = `/api/organizations/${selectedOrgId}/export/zip?user=Dashboard`;
    triggerDownload(url, `Audit_${selectedOrgId}.zip`);
}