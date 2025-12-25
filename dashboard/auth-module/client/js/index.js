// Redirect to login or dashboard based on auth state
(function() {
    const token = localStorage.getItem('cpf_access_token');
    if (token) {
        // Has token, redirect to dashboard
        const dashboardUrl = localStorage.getItem('dashboardUrl') || 'http://localhost:3000';
        window.location.href = dashboardUrl + '/auditing/';
    } else {
        // No token, redirect to login
        window.location.href = '/login';
    }
})();
