// Redirect to login or dashboard based on auth state
(function() {
    const token = localStorage.getItem('cpf_access_token');
    if (token) {
        // Has token, redirect to dashboard
        window.location.href = '/dashboard';
    } else {
        // No token, redirect to login
        window.location.href = '/login';
    }
})();
