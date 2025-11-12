/**
 * Generatore di certificati CPF3 PVMS in PDF
 * CPF3: Cybersecurity Psychology Framework
 * PVMS: Psychological Vulnerability Management System
 */

const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

class CPF3PVMSCertificateGenerator {
    constructor() {
        // A4 size in points (72 points = 1 inch)
        this.width = 595.28;  // A4 width in points
        this.height = 841.89; // A4 height in points
        this.margin = 42.52;  // 15mm in points (15 * 2.834)
        this.mm = 2.834;      // Conversion factor: 1mm = 2.834 points
    }

    /**
     * Disegna un singolo esagono
     * Nota: reportlab usa coordinate con origine in basso, pdfkit usa origine in alto
     * Le coordinate Y sono invertite
     */
    drawHexagon(doc, cx, cy, size) {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = Math.PI / 3 * i - Math.PI / 6;
            const px = cx + size * Math.cos(angle);
            const py = cy + size * Math.sin(angle);
            points.push([px, py]);
        }

        doc.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            doc.lineTo(points[i][0], points[i][1]);
        }
        doc.closePath();
        doc.stroke();
    }

    /**
     * Disegna il pattern esagonale di sfondo
     */
    drawHexagonPattern(doc) {
        doc.save();
        doc.strokeColor('#E8E8E8');
        doc.lineWidth(0.5);

        const hexSize = 15;
        const h = hexSize * 0.866;  // altezza di un esagono
        const w = hexSize * 1.5;    // larghezza tra centri

        const rows = Math.floor(this.height / h) + 2;
        const cols = Math.floor(this.width / w) + 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let x = col * w;
                let y = row * h;
                // Offset per righe alternate
                if (row % 2 === 1) {
                    x += w / 2;
                }
                this.drawHexagon(doc, x, y, hexSize);
            }
        }

        doc.restore();
    }

    /**
     * Disegna l'intestazione con il box scuro
     * In reportlab: header_y = height - margin - header_height (dal basso)
     * In pdfkit: header_y = margin (dall'alto)
     */
    drawHeader(doc, certificateId) {
        const headerHeight = 50 * this.mm;
        const headerY = this.margin; // Dall'alto in pdfkit

        // Box scuro
        doc.save();
        doc.fillColor('#2C3E50');
        doc.rect(this.margin, headerY, this.width - 2 * this.margin, headerHeight);
        doc.fill();
        doc.restore();

        // Testo intestazione centrato
        // In reportlab: header_y è l'angolo in basso a sinistra del box
        // Il testo è a header_y + 30*mm (baseline) - quindi 30mm dal fondo del box verso l'alto
        // In pdfkit: header_y è l'angolo in alto a sinistra del box
        // Quindi: headerY + (headerHeight - 30*mm) è equivalente
        // Ma doc.text() usa il TOP del testo, non la baseline
        // Font 32 ha circa 23 punti di ascent, quindi sottraggo questo
        doc.save();
        doc.fillColor('#FFFFFF');
        doc.fontSize(32);
        doc.font('Helvetica-Bold');
        const titleText = "CPF3 PVMS CERTIFICATE";

        // Posizione: dal top del box + altezza box - 30mm - ascent del font
        const titleY = headerY + headerHeight - 30 * this.mm - 23; // ~23 punti di ascent per font 32

        doc.text(titleText, 0, titleY, {
            width: this.width,
            align: 'center',
            lineBreak: false
        });

        // ID del certificato
        doc.fontSize(14);
        doc.font('Helvetica');
        // Font 14 ha circa 10 punti di ascent
        const idY = headerY + headerHeight - 15 * this.mm - 10;

        doc.text(certificateId, 0, idY, {
            width: this.width,
            align: 'center',
            lineBreak: false
        });

        doc.restore();
    }

    /**
     * Disegna il testo introduttivo
     * In reportlab: y_position è passato e il testo è disegnato lì (baseline)
     * In pdfkit: dobbiamo convertire la posizione
     */
    drawIntroText(doc, yPosition) {
        doc.save();
        doc.fontSize(11);
        doc.font('Helvetica');
        doc.fillColor('#333333');

        const text1 = "The Authority referred hereunder hereby certifies that files and data in the Project";
        const text2 = "below existed at the Registration Date.";

        doc.text(text1, 0, yPosition, {
            width: this.width,
            align: 'center',
            lineBreak: false
        });

        doc.text(text2, 0, yPosition + 5 * this.mm, {
            width: this.width,
            align: 'center',
            lineBreak: false
        });

        doc.restore();
        return yPosition + 15 * this.mm;
    }

    /**
     * Disegna l'intestazione di una sezione
     */
    drawSectionHeader(doc, yPosition, title, underlineColor = '#FFA500') {
        doc.save();
        doc.fontSize(20);
        doc.font('Helvetica-Bold');
        doc.fillColor('#000000');

        const textWidth = doc.widthOfString(title);
        const xCenter = this.width / 2;

        doc.text(title, 0, yPosition, {
            width: this.width,
            align: 'center',
            lineBreak: false
        });

        // Linea di sottolineatura
        // In reportlab: underline_y = y_position - 2*mm (sotto il testo)
        // In pdfkit: il testo parte da yPosition, quindi la linea deve essere più giù
        const fontSize = 20;
        const underlineY = yPosition + fontSize + 2 * this.mm;

        doc.strokeColor(underlineColor);
        doc.lineWidth(3);
        doc.moveTo(xCenter - textWidth / 2, underlineY);
        doc.lineTo(xCenter + textWidth / 2, underlineY);
        doc.stroke();

        doc.restore();
        return yPosition + 12 * this.mm;
    }

    /**
     * Disegna un campo label: valore
     * In reportlab: y è la baseline, il testo si estende sopra
     * In pdfkit: y è il top, il testo si estende sotto
     */
    drawField(doc, x, y, label, value, labelWidth = 40 * this.mm) {
        doc.save();

        // Label
        doc.fontSize(10);
        doc.font('Helvetica-Bold');
        doc.fillColor('#000000');
        doc.text(label, x, y, { lineBreak: false, continued: false });

        // Value
        doc.fontSize(9);
        doc.font('Courier');
        doc.fillColor('#333333');

        const maxWidth = this.width - 2 * this.margin - labelWidth - 15 * this.mm;
        const valueWidth = doc.widthOfString(value, { font: 'Courier', size: 9 });

        if (valueWidth > maxWidth) {
            // Spezza il testo per carattere
            const lines = [];
            let currentLine = "";

            for (let char of value) {
                const testLine = currentLine + char;
                const testWidth = doc.widthOfString(testLine, { font: 'Courier', size: 9 });
                if (testWidth <= maxWidth) {
                    currentLine = testLine;
                } else {
                    if (currentLine) {
                        lines.push(currentLine);
                    }
                    currentLine = char;
                }
            }

            if (currentLine) {
                lines.push(currentLine);
            }

            // Disegna tutte le righe
            for (let i = 0; i < lines.length; i++) {
                doc.text(lines[i], x + labelWidth, y + i * 4 * this.mm, {
                    lineBreak: false,
                    continued: false
                });
            }

            doc.restore();
            return y + lines.length * 4 * this.mm + 3 * this.mm;
        } else {
            doc.text(value, x + labelWidth, y, { lineBreak: false, continued: false });
            doc.restore();
            return y + 7 * this.mm;
        }
    }

    /**
     * Disegna un QR code nel PDF
     */
    async drawQRCode(doc, url, x, y, size = 25 * this.mm) {
        try {
            // Genera il QR code come buffer
            const qrBuffer = await QRCode.toBuffer(url, {
                errorCorrectionLevel: 'L',
                margin: 1,
                width: size * 3 // Alta risoluzione
            });

            // In reportlab: y è l'angolo in basso a sinistra
            // In pdfkit: y è l'angolo in alto a sinistra
            // Quindi devo convertire: y_pdfkit = height - y_reportlab - size
            const yConverted = this.height - y - size;

            // Disegna l'immagine sul PDF
            doc.image(qrBuffer, x, yConverted, { width: size, height: size });
        } catch (error) {
            console.error('❌ Errore generazione QR code:', error);
        }
    }

    /**
     * Disegna il logo e il testo del footer
     */
    drawFooter(doc, logoPath = null) {
        doc.save();

        // In reportlab: footer text baseline a 30*mm dal basso
        // In pdfkit: dobbiamo convertire baseline -> top del testo
        // Font 22 ha circa 16 punti di ascent
        // footerTextY_pdfkit = height - 30*mm - ascent = height - 30*mm - 16
        const footerTextY = this.height - 30 * this.mm - 16;

        // Scritta CPF3.org
        doc.fontSize(22);
        doc.font('Helvetica-Bold');
        doc.fillColor('#2C3E50');
        const footerText = "CPF3.org";

        doc.text(footerText, 0, footerTextY, {
            width: this.width,
            align: 'center',
            lineBreak: false
        });

        // Logo sopra la scritta (se fornito)
        // In reportlab: logo con angolo in basso a sinistra a (logo_x, 38*mm)
        // In pdfkit: angolo in alto a sinistra a (logo_x, height - 38*mm - logo_height)
        if (logoPath && fs.existsSync(logoPath)) {
            try {
                const logoWidth = 45 * this.mm;
                const logoHeight = 22 * this.mm;
                const logoX = (this.width - logoWidth) / 2;
                const logoY = this.height - 38 * this.mm - logoHeight;

                doc.image(logoPath, logoX, logoY, {
                    width: logoWidth,
                    height: logoHeight,
                    fit: [logoWidth, logoHeight],
                    align: 'center',
                    valign: 'center'
                });
                console.log(`✅ Logo caricato: ${logoPath}`);
            } catch (error) {
                console.error(`⚠️ Errore caricamento logo: ${error}`);
            }
        } else if (logoPath) {
            console.warn(`⚠️ Logo non trovato: ${logoPath}`);
        }

        doc.restore();
    }

    /**
     * Genera il certificato PDF
     */
    async generateCertificate(outputFilename, data, qrUrl = null, logoPath = null) {
        return new Promise(async (resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    margins: {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    },
                    autoFirstPage: true
                });

                // Crea lo stream di output
                const stream = fs.createWriteStream(outputFilename);
                doc.pipe(stream);

                // Pattern esagonale
                this.drawHexagonPattern(doc);

                // Intestazione
                this.drawHeader(doc, data.certificate_id);

                // Testo introduttivo
                // In Python: y_pos = height - margin - 65*mm
                // In pdfkit: y_pos = margin + 65*mm
                let yPos = this.margin + 65 * this.mm;
                yPos = this.drawIntroText(doc, yPos);

                // Sezione Project Data
                yPos = this.drawSectionHeader(doc, yPos, "Project Data");

                const xStart = this.margin + 15 * this.mm;
                yPos = this.drawField(doc, xStart, yPos, "Project ID:", data.project_id);
                yPos = this.drawField(doc, xStart, yPos, "Project Title:", data.project_title);
                yPos = this.drawField(doc, xStart, yPos, "Submitted by:", data.submitted_by);
                yPos = this.drawField(doc, xStart, yPos, "Content:", data.content);
                yPos = this.drawField(doc, xStart, yPos, "Fingerprint:", data.fingerprint);

                // Linea separatrice
                yPos += 5 * this.mm;
                doc.save();
                doc.strokeColor('#CCCCCC');
                doc.lineWidth(1);
                doc.moveTo(this.width / 2 - 50 * this.mm, yPos);
                doc.lineTo(this.width / 2 + 50 * this.mm, yPos);
                doc.stroke();
                doc.restore();
                yPos += 10 * this.mm;

                // Sezione Timestamping Data
                yPos = this.drawSectionHeader(doc, yPos, "Timestamping Data");

                yPos = this.drawField(doc, xStart, yPos, "Registration Date:", data.registration_date);
                yPos = this.drawField(doc, xStart, yPos, "Authority:", data.authority);
                yPos = this.drawField(doc, xStart, yPos, "TSA:", data.tsa);
                yPos = this.drawField(doc, xStart, yPos, "Serial number:", data.serial_number);
                yPos = this.drawField(doc, xStart, yPos, "Status:", data.status);
                yPos = this.drawField(doc, xStart, yPos, "Policy:", data.policy);

                // Footer con logo
                this.drawFooter(doc, logoPath);

                // QR Code (se fornito)
                if (qrUrl) {
                    // In reportlab: qr_x = width - margin - 30*mm, qr_y = 25*mm
                    const qrX = this.width - this.margin - 30 * this.mm;
                    const qrY = 25 * this.mm; // Questa è la posizione reportlab (dal basso)
                    await this.drawQRCode(doc, qrUrl, qrX, qrY, 25 * this.mm);
                }

                // Bordo della pagina
                doc.save();
                doc.strokeColor('#000000');
                doc.lineWidth(2);
                doc.rect(this.margin, this.margin, this.width - 2 * this.margin, this.height - 2 * this.margin);
                doc.stroke();
                doc.restore();

                // Finalizza il documento
                doc.end();

                stream.on('finish', () => {
                    console.log(`✅ Certificato generato: ${outputFilename}`);
                    resolve();
                });

                stream.on('error', (error) => {
                    console.error(`❌ Errore durante la scrittura del file: ${error}`);
                    reject(error);
                });

            } catch (error) {
                console.error(`❌ Errore durante la generazione del certificato: ${error}`);
                reject(error);
            }
        });
    }
}

// ESEMPIO DI UTILIZZO
async function main() {
    // Dati del certificato - MODIFICA QUESTI VALORI
    const certId = '891a43a8-d0e9-4dc2-9aad-d7aeb8bddc89';
    const projId = 'c6c535ce-cacd-435b-94af-002792817e75';
    const title = 'CPF3';
    const author = 'Giuseppe Canale';
    const content = '1 file + Project cover';
    const fingerprint = '4fe7b050ae4020d6baf57ee6663f3790465ea6e22efc1f00cf2c0faa8adabbe2';
    const regDate = 'Aug 27, 2025 at 01:42:18 UTC';
    const authority = 'DigiCert, Inc.';
    const tsa = 'C=US/O=DigiCert, Inc./CN=DigiCert SHA256 RSA4096 Timestamp Responder 2025 1';
    const serial = '00E0F685106A87AB6FC11EE1A95C9BE96B';
    const status = 'CONFIRMED';
    const policy = '2.16.840.1.114412.7.1';

    const certificateData = {
        certificate_id: certId,
        project_id: projId,
        project_title: title,
        submitted_by: author,
        content: content,
        fingerprint: fingerprint,
        registration_date: regDate,
        authority: authority,
        tsa: tsa,
        serial_number: serial,
        status: status,
        policy: policy
    };

    // Genera il certificato
    const generator = new CPF3PVMSCertificateGenerator();

    // Percorso del logo (nella stessa cartella)
    const logoPath = path.join(__dirname, 'logo_cpf3.png');

    try {
        await generator.generateCertificate(
            'cpf3_pvms_certificate_node.pdf',
            certificateData,
            'https://cpf3.org',
            logoPath
        );

        console.log('\n✨ Certificato generato con successo!');
    } catch (error) {
        console.error('\n❌ Errore durante la generazione:', error);
        process.exit(1);
    }
}

// Esegui se chiamato direttamente
if (require.main === module) {
    main();
}

module.exports = CPF3PVMSCertificateGenerator;
