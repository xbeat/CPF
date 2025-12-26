/**
 * CPF Auth Module - Resend Email Configuration
 * Email templates and service configuration
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
    // ==========================================================================
    // Resend API Configuration
    // ==========================================================================
    apiKey: process.env.RESEND_API_KEY || '',

    from: {
        name: process.env.EMAIL_FROM_NAME || 'CPF Dashboard',
        email: process.env.EMAIL_FROM_ADDRESS || 'noreply@cpf-dashboard.com'
    },

    // ==========================================================================
    // Email Subjects (Multilingual)
    // ==========================================================================
    subjects: {
        verify: {
            'en-US': process.env.EMAIL_VERIFY_SUBJECT_EN || 'Verify your CPF Dashboard account',
            'it-IT': process.env.EMAIL_VERIFY_SUBJECT_IT || 'Verifica il tuo account CPF Dashboard'
        },
        reset: {
            'en-US': process.env.EMAIL_RESET_SUBJECT_EN || 'Reset your password',
            'it-IT': process.env.EMAIL_RESET_SUBJECT_IT || 'Reimposta la tua password'
        },
        welcome: {
            'en-US': process.env.EMAIL_WELCOME_SUBJECT_EN || 'Welcome to CPF Dashboard',
            'it-IT': process.env.EMAIL_WELCOME_SUBJECT_IT || 'Benvenuto in CPF Dashboard'
        },
        locked: {
            'en-US': process.env.EMAIL_LOCKED_SUBJECT_EN || 'Account locked - Security alert',
            'it-IT': process.env.EMAIL_LOCKED_SUBJECT_IT || 'Account bloccato - Avviso di sicurezza'
        },
        expiryWarning: {
            'en-US': process.env.EMAIL_EXPIRY_WARNING_SUBJECT_EN || 'Your account expires in 7 days',
            'it-IT': process.env.EMAIL_EXPIRY_WARNING_SUBJECT_IT || 'Il tuo account scade tra 7 giorni'
        },
        expired: {
            'en-US': 'Your CPF Dashboard account has expired',
            'it-IT': 'Il tuo account CPF Dashboard è scaduto'
        },
        approved: {
            'en-US': 'Your account has been approved',
            'it-IT': 'Il tuo account è stato approvato'
        },
        rejected: {
            'en-US': 'Account registration status update',
            'it-IT': 'Aggiornamento stato registrazione account'
        },
        passwordChanged: {
            'en-US': 'Your password has been changed',
            'it-IT': 'La tua password è stata modificata'
        },
        newLogin: {
            'en-US': 'New login to your account',
            'it-IT': 'Nuovo accesso al tuo account'
        }
    },

    // ==========================================================================
    // Email Templates
    // ==========================================================================
    templates: {
        // Base HTML wrapper
        baseHtml: (content, lang = 'en-US') => `
<!DOCTYPE html>
<html lang="${lang.split('-')[0]}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CPF Dashboard</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #16213e 50%, #0f3460 100%);
            color: white;
            padding: 32px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .header .logo {
            font-size: 48px;
            margin-bottom: 16px;
        }
        .content {
            padding: 32px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            margin: 24px 0;
            text-align: center;
        }
        .button:hover {
            opacity: 0.9;
        }
        .info-box {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
        }
        .warning-box {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
        }
        .danger-box {
            background: #fee2e2;
            border: 1px solid #ef4444;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
        }
        .success-box {
            background: #d1fae5;
            border: 1px solid #10b981;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
        }
        .footer {
            background: #f9fafb;
            padding: 24px 32px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
        .footer a {
            color: #1e3a8a;
        }
        .code {
            font-family: monospace;
            background: #e5e7eb;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 14px;
        }
        .small {
            font-size: 13px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div style="padding: 24px;">
        <div class="container">
            <div class="header">
                <div class="logo">🛡️</div>
                <h1>CPF Dashboard</h1>
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} CPF Dashboard - Cognitive Psychological Framework</p>
                <p>${lang === 'it-IT'
                    ? 'Questa email è stata inviata automaticamente. Non rispondere a questo messaggio.'
                    : 'This email was sent automatically. Please do not reply to this message.'}</p>
            </div>
        </div>
    </div>
</body>
</html>
        `,

        // Verification email
        verification: {
            'en-US': (data) => `
                <h2>Verify your email address</h2>
                <p>Hi ${data.firstName || 'there'},</p>
                <p>Thank you for registering on CPF Dashboard. To complete your registration, please verify your email address by clicking the button below:</p>
                <div style="text-align: center;">
                    <a href="${data.verifyUrl}" class="button">Verify Email Address</a>
                </div>
                <div class="info-box">
                    <p class="small"><strong>Link expires in:</strong> 24 hours</p>
                    <p class="small"><strong>If the button doesn't work</strong>, copy and paste this link into your browser:</p>
                    <p class="small" style="word-break: break-all;">${data.verifyUrl}</p>
                </div>
                <p class="small">If you didn't create an account on CPF Dashboard, you can safely ignore this email.</p>
            `,
            'it-IT': (data) => `
                <h2>Verifica il tuo indirizzo email</h2>
                <p>Ciao ${data.firstName || ''},</p>
                <p>Grazie per esserti registrato su CPF Dashboard. Per completare la registrazione, verifica il tuo indirizzo email cliccando il pulsante qui sotto:</p>
                <div style="text-align: center;">
                    <a href="${data.verifyUrl}" class="button">Verifica Indirizzo Email</a>
                </div>
                <div class="info-box">
                    <p class="small"><strong>Il link scade tra:</strong> 24 ore</p>
                    <p class="small"><strong>Se il pulsante non funziona</strong>, copia e incolla questo link nel tuo browser:</p>
                    <p class="small" style="word-break: break-all;">${data.verifyUrl}</p>
                </div>
                <p class="small">Se non hai creato un account su CPF Dashboard, puoi ignorare questa email.</p>
            `
        },

        // Welcome email (after verification or approval)
        welcome: {
            'en-US': (data) => `
                <h2>Welcome to CPF Dashboard! 🎉</h2>
                <p>Hi ${data.firstName || 'there'},</p>
                <p>Your account has been ${data.approved ? 'approved and is now' : 'verified and is now'} active. You can now log in and start using the CPF Dashboard.</p>
                <div style="text-align: center;">
                    <a href="${data.loginUrl}" class="button">Go to Dashboard</a>
                </div>
                <div class="success-box">
                    <p><strong>Your account details:</strong></p>
                    <p>Email: ${data.email}</p>
                    <p>Role: ${data.role}</p>
                    ${data.orgName ? `<p>Organization: ${data.orgName}</p>` : ''}
                </div>
                <p>If you have any questions, please contact your administrator.</p>
            `,
            'it-IT': (data) => `
                <h2>Benvenuto in CPF Dashboard! 🎉</h2>
                <p>Ciao ${data.firstName || ''},</p>
                <p>Il tuo account è stato ${data.approved ? 'approvato ed è ora' : 'verificato ed è ora'} attivo. Puoi ora accedere e iniziare a usare CPF Dashboard.</p>
                <div style="text-align: center;">
                    <a href="${data.loginUrl}" class="button">Vai alla Dashboard</a>
                </div>
                <div class="success-box">
                    <p><strong>Dettagli del tuo account:</strong></p>
                    <p>Email: ${data.email}</p>
                    <p>Ruolo: ${data.role}</p>
                    ${data.orgName ? `<p>Organizzazione: ${data.orgName}</p>` : ''}
                </div>
                <p>Per qualsiasi domanda, contatta il tuo amministratore.</p>
            `
        },

        // Password reset email
        resetPassword: {
            'en-US': (data) => `
                <h2>Reset your password</h2>
                <p>Hi ${data.firstName || 'there'},</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <div style="text-align: center;">
                    <a href="${data.resetUrl}" class="button">Reset Password</a>
                </div>
                <div class="warning-box">
                    <p><strong>⚠️ Security Notice:</strong></p>
                    <p class="small">This link expires in 1 hour for security reasons.</p>
                    <p class="small">If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
                </div>
                <div class="info-box">
                    <p class="small"><strong>Request details:</strong></p>
                    <p class="small">IP Address: ${data.ipAddress || 'Unknown'}</p>
                    <p class="small">Time: ${data.timestamp}</p>
                </div>
            `,
            'it-IT': (data) => `
                <h2>Reimposta la tua password</h2>
                <p>Ciao ${data.firstName || ''},</p>
                <p>Abbiamo ricevuto una richiesta per reimpostare la tua password. Clicca il pulsante qui sotto per creare una nuova password:</p>
                <div style="text-align: center;">
                    <a href="${data.resetUrl}" class="button">Reimposta Password</a>
                </div>
                <div class="warning-box">
                    <p><strong>⚠️ Avviso di sicurezza:</strong></p>
                    <p class="small">Questo link scade tra 1 ora per motivi di sicurezza.</p>
                    <p class="small">Se non hai richiesto il reset della password, ignora questa email e la tua password rimarrà invariata.</p>
                </div>
                <div class="info-box">
                    <p class="small"><strong>Dettagli richiesta:</strong></p>
                    <p class="small">Indirizzo IP: ${data.ipAddress || 'Sconosciuto'}</p>
                    <p class="small">Data/Ora: ${data.timestamp}</p>
                </div>
            `
        },

        // Account locked email
        accountLocked: {
            'en-US': (data) => `
                <h2>🔒 Account Locked</h2>
                <p>Hi ${data.firstName || 'there'},</p>
                <div class="danger-box">
                    <p>Your CPF Dashboard account has been temporarily locked due to multiple failed login attempts.</p>
                </div>
                <p><strong>Details:</strong></p>
                <ul>
                    <li>Failed attempts: ${data.failedAttempts}</li>
                    <li>Locked until: ${data.lockedUntil}</li>
                    <li>Last attempt IP: ${data.ipAddress || 'Unknown'}</li>
                </ul>
                <p>If this was you, please wait until the lockout period expires and try again with the correct password.</p>
                <div class="warning-box">
                    <p><strong>If this wasn't you:</strong></p>
                    <p class="small">Someone may be trying to access your account. We recommend:</p>
                    <ol class="small">
                        <li>Waiting for the lockout to expire</li>
                        <li>Resetting your password immediately</li>
                        <li>Contacting your administrator</li>
                    </ol>
                </div>
            `,
            'it-IT': (data) => `
                <h2>🔒 Account Bloccato</h2>
                <p>Ciao ${data.firstName || ''},</p>
                <div class="danger-box">
                    <p>Il tuo account CPF Dashboard è stato temporaneamente bloccato a causa di molteplici tentativi di accesso falliti.</p>
                </div>
                <p><strong>Dettagli:</strong></p>
                <ul>
                    <li>Tentativi falliti: ${data.failedAttempts}</li>
                    <li>Bloccato fino a: ${data.lockedUntil}</li>
                    <li>Ultimo tentativo IP: ${data.ipAddress || 'Sconosciuto'}</li>
                </ul>
                <p>Se sei stato tu, attendi la fine del periodo di blocco e riprova con la password corretta.</p>
                <div class="warning-box">
                    <p><strong>Se non sei stato tu:</strong></p>
                    <p class="small">Qualcuno potrebbe star tentando di accedere al tuo account. Ti consigliamo di:</p>
                    <ol class="small">
                        <li>Attendere la scadenza del blocco</li>
                        <li>Reimpostare immediatamente la password</li>
                        <li>Contattare il tuo amministratore</li>
                    </ol>
                </div>
            `
        },

        // Expiry warning email
        expiryWarning: {
            'en-US': (data) => `
                <h2>⏰ Account Expiring Soon</h2>
                <p>Hi ${data.firstName || 'there'},</p>
                <div class="warning-box">
                    <p>Your CPF Dashboard account will expire on <strong>${data.expiryDate}</strong>.</p>
                    <p>That's in <strong>${data.daysRemaining} days</strong>.</p>
                </div>
                <p>To maintain access to the dashboard, please contact your administrator to extend your account.</p>
                <div class="info-box">
                    <p class="small"><strong>What happens when your account expires?</strong></p>
                    <ul class="small">
                        <li>You won't be able to log in</li>
                        <li>Your data will be preserved</li>
                        <li>An administrator can reactivate your account</li>
                    </ul>
                </div>
            `,
            'it-IT': (data) => `
                <h2>⏰ Account in Scadenza</h2>
                <p>Ciao ${data.firstName || ''},</p>
                <div class="warning-box">
                    <p>Il tuo account CPF Dashboard scadrà il <strong>${data.expiryDate}</strong>.</p>
                    <p>Mancano <strong>${data.daysRemaining} giorni</strong>.</p>
                </div>
                <p>Per mantenere l'accesso alla dashboard, contatta il tuo amministratore per estendere il tuo account.</p>
                <div class="info-box">
                    <p class="small"><strong>Cosa succede quando il tuo account scade?</strong></p>
                    <ul class="small">
                        <li>Non potrai più accedere</li>
                        <li>I tuoi dati saranno preservati</li>
                        <li>Un amministratore può riattivare il tuo account</li>
                    </ul>
                </div>
            `
        },

        // Password changed notification
        passwordChanged: {
            'en-US': (data) => `
                <h2>Password Changed</h2>
                <p>Hi ${data.firstName || 'there'},</p>
                <div class="success-box">
                    <p>Your CPF Dashboard password has been successfully changed.</p>
                </div>
                <p><strong>Details:</strong></p>
                <ul>
                    <li>Changed at: ${data.timestamp}</li>
                    <li>IP Address: ${data.ipAddress || 'Unknown'}</li>
                </ul>
                <div class="warning-box">
                    <p><strong>Didn't change your password?</strong></p>
                    <p class="small">If you didn't make this change, your account may have been compromised. Please:</p>
                    <ol class="small">
                        <li>Reset your password immediately</li>
                        <li>Contact your administrator</li>
                    </ol>
                </div>
            `,
            'it-IT': (data) => `
                <h2>Password Modificata</h2>
                <p>Ciao ${data.firstName || ''},</p>
                <div class="success-box">
                    <p>La password del tuo account CPF Dashboard è stata modificata con successo.</p>
                </div>
                <p><strong>Dettagli:</strong></p>
                <ul>
                    <li>Modificata il: ${data.timestamp}</li>
                    <li>Indirizzo IP: ${data.ipAddress || 'Sconosciuto'}</li>
                </ul>
                <div class="warning-box">
                    <p><strong>Non hai cambiato la password?</strong></p>
                    <p class="small">Se non hai effettuato questa modifica, il tuo account potrebbe essere stato compromesso. Ti preghiamo di:</p>
                    <ol class="small">
                        <li>Reimpostare immediatamente la password</li>
                        <li>Contattare il tuo amministratore</li>
                    </ol>
                </div>
            `
        },

        // Pending approval notification (to admins)
        pendingApproval: {
            'en-US': (data) => `
                <h2>New User Pending Approval</h2>
                <p>Hi Admin,</p>
                <p>A new user has registered and is waiting for approval:</p>
                <div class="info-box">
                    <p><strong>User details:</strong></p>
                    <p>Name: ${data.firstName} ${data.lastName}</p>
                    <p>Email: ${data.email}</p>
                    <p>Registration time: ${data.timestamp}</p>
                </div>
                <div style="text-align: center;">
                    <a href="${data.approvalUrl}" class="button">Review Registration</a>
                </div>
            `,
            'it-IT': (data) => `
                <h2>Nuovo Utente in Attesa di Approvazione</h2>
                <p>Ciao Admin,</p>
                <p>Un nuovo utente si è registrato ed è in attesa di approvazione:</p>
                <div class="info-box">
                    <p><strong>Dettagli utente:</strong></p>
                    <p>Nome: ${data.firstName} ${data.lastName}</p>
                    <p>Email: ${data.email}</p>
                    <p>Data registrazione: ${data.timestamp}</p>
                </div>
                <div style="text-align: center;">
                    <a href="${data.approvalUrl}" class="button">Rivedi Registrazione</a>
                </div>
            `
        },

        // Approval granted
        approved: {
            'en-US': (data) => `
                <h2>Account Approved! ✅</h2>
                <p>Hi ${data.firstName || 'there'},</p>
                <div class="success-box">
                    <p>Great news! Your CPF Dashboard account has been approved by an administrator.</p>
                </div>
                <p>You can now log in and start using the dashboard:</p>
                <div style="text-align: center;">
                    <a href="${data.loginUrl}" class="button">Log In Now</a>
                </div>
                <div class="info-box">
                    <p><strong>Your account details:</strong></p>
                    <p>Email: ${data.email}</p>
                    <p>Role: ${data.role}</p>
                    ${data.orgName ? `<p>Organization: ${data.orgName}</p>` : ''}
                </div>
            `,
            'it-IT': (data) => `
                <h2>Account Approvato! ✅</h2>
                <p>Ciao ${data.firstName || ''},</p>
                <div class="success-box">
                    <p>Ottime notizie! Il tuo account CPF Dashboard è stato approvato da un amministratore.</p>
                </div>
                <p>Puoi ora accedere e iniziare a usare la dashboard:</p>
                <div style="text-align: center;">
                    <a href="${data.loginUrl}" class="button">Accedi Ora</a>
                </div>
                <div class="info-box">
                    <p><strong>Dettagli del tuo account:</strong></p>
                    <p>Email: ${data.email}</p>
                    <p>Ruolo: ${data.role}</p>
                    ${data.orgName ? `<p>Organizzazione: ${data.orgName}</p>` : ''}
                </div>
            `
        },

        // Approval rejected
        rejected: {
            'en-US': (data) => `
                <h2>Account Registration Update</h2>
                <p>Hi ${data.firstName || 'there'},</p>
                <p>We regret to inform you that your CPF Dashboard registration request has not been approved at this time.</p>
                ${data.reason ? `
                <div class="info-box">
                    <p><strong>Reason:</strong></p>
                    <p>${data.reason}</p>
                </div>
                ` : ''}
                <p>If you believe this is an error, please contact your organization administrator.</p>
            `,
            'it-IT': (data) => `
                <h2>Aggiornamento Registrazione Account</h2>
                <p>Ciao ${data.firstName || ''},</p>
                <p>Ci dispiace informarti che la tua richiesta di registrazione a CPF Dashboard non è stata approvata al momento.</p>
                ${data.reason ? `
                <div class="info-box">
                    <p><strong>Motivo:</strong></p>
                    <p>${data.reason}</p>
                </div>
                ` : ''}
                <p>Se ritieni che si tratti di un errore, contatta l'amministratore della tua organizzazione.</p>
            `
        }
    },

    // ==========================================================================
    // Helper method to get full HTML email
    // ==========================================================================
    getEmailHtml(templateName, language, data) {
        const template = this.templates[templateName];
        if (!template) {
            throw new Error(`Email template not found: ${templateName}`);
        }

        const lang = template[language] ? language : 'en-US';
        const content = template[lang](data);
        return this.templates.baseHtml(content, lang);
    },

    getSubject(templateName, language) {
        const subjects = this.subjects[templateName];
        if (!subjects) {
            return 'CPF Dashboard Notification';
        }
        return subjects[language] || subjects['en-US'];
    }
};
