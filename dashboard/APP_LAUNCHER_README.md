# CPF Dashboard - macOS App Launcher

## Installazione

1. Copia la cartella `CPF Dashboard.app` nella cartella `/Applications`
2. Assicurati che la cartella CPF sia in una delle seguenti posizioni:
   - `~/CPF/dashboard/`
   - `~/Desktop/CPF/dashboard/`
   - `~/Documents/CPF/dashboard/`

## Primo avvio

Al primo clic sull'app, macOS potrebbe bloccarla. Per sbloccarla:

1. Vai in **Impostazioni di Sistema** > **Privacy e Sicurezza**
2. Scorri verso il basso e clicca su "**Apri comunque**" accanto a "CPF Dashboard"

Oppure:
- Tasto destro sull'app > **Apri** > **Apri**

## Cosa fa l'app

- Avvia automaticamente il server Node.js sulla porta 3000
- Apre il browser sulla dashboard
- Installa le dipendenze npm se mancanti
- Genera i dati demo se necessario
- Chiude eventuali istanze precedenti sulla porta 3000

## Chiusura

Per chiudere l'applicazione:
- Chiudi la finestra del Terminale che si apre
- Oppure premi `Cmd+Q` sul Terminale

## Requisiti

- macOS 10.13 o successivo
- Node.js installato (https://nodejs.org)
- npm (incluso con Node.js)

## Troubleshooting

Se l'app non trova la cartella dashboard:
1. Assicurati che il progetto CPF sia nella tua home directory
2. Oppure in Desktop/CPF/ o Documents/CPF/

Se il server non si avvia:
1. Controlla che Node.js sia installato: `node --version`
2. Verifica che la porta 3000 sia libera
