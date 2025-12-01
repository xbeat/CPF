// Organization context
export let organizationContext = {
    orgId: null,
    orgName: null,
    language: 'en-US'
};

export let currentData = {
    fieldKit: null,
    metadata: {
        date: new Date().toISOString().split('T')[0],
        auditor: '',
        client: '',
        status: 'in-progress',
        notes: ''
    },
    responses: {},
    score: null // Added to track score in state
};

// Funzione per reimpostare lo stato (usata da resetAll)
export function resetCurrentData() {
    currentData.fieldKit = null;
    currentData.metadata = {
        date: new Date().toISOString().split('T')[0],
        auditor: '',
        client: '',
        status: 'in-progress',
        notes: ''
    };
    currentData.responses = {};
    currentData.score = null;
    
    // Reset organization context partial
    // Non resettiamo orgId/orgName perché siamo ancora nella stessa sessione
}

// Backup automatico
setInterval(() => {
    if (currentData.fieldKit) {
        localStorage.setItem('cpf_current', JSON.stringify(currentData));
    }
}, 30000);