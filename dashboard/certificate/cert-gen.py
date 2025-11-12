"""
Generatore di certificati CPF3 PVMS in PDF
CPF3: Cybersecurity Psychology Framework
PVMS: Psychological Vulnerability Management System
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.utils import ImageReader
from datetime import datetime
import qrcode
from io import BytesIO
import math
import os

class CPF3PVMSCertificateGenerator:
	def __init__(self):
		self.width, self.height = A4
		self.margin = 15 * mm
		
	def draw_hexagon_pattern(self, c):
		"""Disegna il pattern esagonale di sfondo"""
		c.saveState()
		c.setStrokeColor(HexColor('#E8E8E8'))
		c.setLineWidth(0.5)
		
		hex_size = 15
		h = hex_size * 0.866  # altezza di un esagono
		w = hex_size * 1.5    # larghezza tra centri
		
		rows = int(self.height / h) + 2
		cols = int(self.width / w) + 2
		
		for row in range(rows):
			for col in range(cols):
				x = col * w
				y = row * h
				# Offset per righe alternate
				if row % 2 == 1:
					x += w / 2
				self._draw_hexagon(c, x, y, hex_size)
		
		c.restoreState()
	
	def _draw_hexagon(self, c, cx, cy, size):
		"""Disegna un singolo esagono centrato in cx, cy"""
		points = []
		for i in range(6):
			angle = math.pi / 3 * i - math.pi / 6
			px = cx + size * math.cos(angle)
			py = cy + size * math.sin(angle)
			points.append((px, py))
		
		path = c.beginPath()
		path.moveTo(points[0][0], points[0][1])
		for point in points[1:]:
			path.lineTo(point[0], point[1])
		path.close()
		c.drawPath(path, stroke=1, fill=0)
	
	def draw_header(self, c, certificate_id):
		"""Disegna l'intestazione con il box scuro"""
		header_height = 50 * mm
		header_y = self.height - self.margin - header_height
		
		# Box scuro - ora occupa tutta la larghezza
		c.setFillColor(HexColor('#2C3E50'))
		c.rect(self.margin, header_y, self.width - 2 * self.margin, header_height, fill=1, stroke=0)
		
		# Testo intestazione centrato
		c.setFillColor(white)
		c.setFont("Helvetica", 32)
		title_text = "CPF3 PVMS CERTIFICATE"
		text_width = c.stringWidth(title_text, "Helvetica", 32)
		c.drawString((self.width - text_width) / 2, header_y + 30*mm, title_text)
		
		c.setFont("Helvetica", 14)
		id_width = c.stringWidth(certificate_id, "Helvetica", 14)
		c.drawString((self.width - id_width) / 2, header_y + 15*mm, certificate_id)
	
	def draw_intro_text(self, c, y_position):
		"""Disegna il testo introduttivo"""
		c.setFont("Helvetica", 11)
		c.setFillColor(HexColor('#333333'))
		
		text = "The Authority referred hereunder hereby certifies that files and data in the Project"
		text2 = "below existed at the Registration Date."
		
		c.drawCentredString(self.width / 2, y_position, text)
		c.drawCentredString(self.width / 2, y_position - 5*mm, text2)
		
		return y_position - 15*mm
	
	def draw_section_header(self, c, y_position, title, underline_color='#FFA500'):
		"""Disegna l'intestazione di una sezione"""
		c.setFont("Helvetica-Bold", 20)
		c.setFillColor(HexColor('#000000'))
		
		text_width = c.stringWidth(title, "Helvetica-Bold", 20)
		x_center = self.width / 2
		c.drawCentredString(x_center, y_position, title)
		
		# Linea di sottolineatura
		c.setStrokeColor(HexColor(underline_color))
		c.setLineWidth(3)
		underline_y = y_position - 2*mm
		c.line(x_center - text_width/2, underline_y, x_center + text_width/2, underline_y)
		
		return y_position - 12*mm
	
	def draw_field(self, c, x, y, label, value, label_width=40*mm):
		"""Disegna un campo label: valore con gestione multiriga migliorata"""
		c.setFont("Helvetica-Bold", 10)
		c.setFillColor(HexColor('#000000'))
		c.drawString(x, y, label)
		
		c.setFont("Courier", 9)
		c.setFillColor(HexColor('#333333'))
		
		# Calcola la larghezza massima disponibile prima del bordo
		max_width = self.width - 2*self.margin - label_width - 15*mm
		
		if c.stringWidth(value, "Courier", 9) > max_width:
			# Spezza il testo per carattere
			lines = []
			current_line = ""
			
			for char in value:
				test_line = current_line + char
				if c.stringWidth(test_line, "Courier", 9) <= max_width:
					current_line = test_line
				else:
					if current_line:
						lines.append(current_line)
					current_line = char
			
			# Aggiungi l'ultima riga
			if current_line:
				lines.append(current_line)
			
			# Disegna tutte le righe
			for i, line in enumerate(lines):
				c.drawString(x + label_width, y - i*4*mm, line)
			
			# Ritorna la posizione Y dopo tutte le righe
			return y - len(lines)*4*mm - 3*mm
		else:
			c.drawString(x + label_width, y, value)
			return y - 7*mm
	
	def draw_qr_code(self, c, url, x, y, size=25*mm):
		"""
		Disegna un QR code nel PDF
		
		Args:
			c: Canvas di reportlab
			url: URL da codificare nel QR code
			x, y: Posizione (angolo in basso a sinistra)
			size: Dimensione del QR code
		"""
		# Genera il QR code
		qr = qrcode.QRCode(
			version=1,
			error_correction=qrcode.constants.ERROR_CORRECT_L,
			box_size=10,
			border=1,
		)
		qr.add_data(url)
		qr.make(fit=True)
		
		# Crea l'immagine del QR code
		img = qr.make_image(fill_color="black", back_color="white")
		
		# Salva in un buffer BytesIO
		buffer = BytesIO()
		img.save(buffer, format='PNG')
		buffer.seek(0)
		
		# Disegna sul canvas direttamente dal buffer
		img_reader = ImageReader(buffer)
		c.drawImage(img_reader, x, y, width=size, height=size)
	
	def draw_footer(self, c, logo_path=None):
		"""Disegna il logo in basso (supporta PNG, JPG, o testo)"""
		# Sempre la scritta CPF3.org
		c.setFont("Helvetica-Bold", 22)
		c.setFillColor(HexColor('#2C3E50'))
		footer_text = "CPF3.org"
		text_width = c.stringWidth(footer_text, "Helvetica-Bold", 22)
		c.drawString((self.width - text_width) / 2, 30*mm, footer_text)
		
		# Logo sopra la scritta (se fornito)
		if logo_path and os.path.exists(logo_path):
			try:
				logo_width = 45*mm
				logo_height = 22*mm
				logo_x = (self.width - logo_width) / 2
				logo_y = 38*mm  # Sopra la scritta
				
				img = ImageReader(logo_path)
				c.drawImage(img, logo_x, logo_y, width=logo_width, height=logo_height, 
						   preserveAspectRatio=True, mask='auto')
				print(f"✅ Logo caricato: {logo_path}")
			except Exception as e:
				print(f"⚠️ Errore caricamento logo: {e}")
		elif logo_path:
			print(f"⚠️ Logo non trovato: {logo_path}")
	
	def generate_certificate(self, output_filename, data, qr_url=None, logo_path=None):
		"""
		Genera il certificato PDF
		
		Args:
			output_filename: Nome del file PDF da creare
			data: Dizionario con i dati del certificato
			qr_url: URL per il QR code (opzionale)
			logo_path: Percorso del logo PNG/JPG (opzionale)
		"""
		c = canvas.Canvas(output_filename, pagesize=A4)
		
		# Pattern esagonale
		self.draw_hexagon_pattern(c)
		
		# Intestazione
		self.draw_header(c, data['certificate_id'])
		
		# Testo introduttivo
		y_pos = self.height - self.margin - 65*mm
		y_pos = self.draw_intro_text(c, y_pos)
		
		# Sezione Project Data
		y_pos = self.draw_section_header(c, y_pos, "Project Data")
		
		x_start = self.margin + 15*mm
		y_pos = self.draw_field(c, x_start, y_pos, "Project ID:", data['project_id'])
		y_pos = self.draw_field(c, x_start, y_pos, "Project Title:", data['project_title'])
		y_pos = self.draw_field(c, x_start, y_pos, "Submitted by:", data['submitted_by'])
		y_pos = self.draw_field(c, x_start, y_pos, "Content:", data['content'])
		y_pos = self.draw_field(c, x_start, y_pos, "Fingerprint:", data['fingerprint'])
		
		# Linea separatrice
		y_pos -= 5*mm
		c.setStrokeColor(HexColor('#CCCCCC'))
		c.setLineWidth(1)
		c.line(self.width/2 - 50*mm, y_pos, self.width/2 + 50*mm, y_pos)
		y_pos -= 10*mm
		
		# Sezione Timestamping Data
		y_pos = self.draw_section_header(c, y_pos, "Timestamping Data")
		
		y_pos = self.draw_field(c, x_start, y_pos, "Registration Date:", data['registration_date'])
		y_pos = self.draw_field(c, x_start, y_pos, "Authority:", data['authority'])
		y_pos = self.draw_field(c, x_start, y_pos, "TSA:", data['tsa'])
		y_pos = self.draw_field(c, x_start, y_pos, "Serial number:", data['serial_number'])
		y_pos = self.draw_field(c, x_start, y_pos, "Status:", data['status'])
		y_pos = self.draw_field(c, x_start, y_pos, "Policy:", data['policy'])
		
		# Footer con logo
		self.draw_footer(c, logo_path)
		
		# QR Code (se fornito)
		if qr_url:
			# Posiziona il QR code in basso a destra
			qr_x = self.width - self.margin - 30*mm
			qr_y = 25*mm
			self.draw_qr_code(c, qr_url, qr_x, qr_y, size=25*mm)
		
		# Bordo della pagina
		c.setStrokeColor(HexColor('#000000'))
		c.setLineWidth(2)
		c.rect(self.margin, self.margin, self.width - 2*self.margin, self.height - 2*self.margin, fill=0, stroke=1)
		
		c.save()
		print(f"✅ Certificato generato: {output_filename}")


# ESEMPIO DI UTILIZZO
if __name__ == "__main__":
	# Dati del certificato - MODIFICA QUESTI VALORI
	# Definisci le variabili prima
	cert_id = '891a43a8-d0e9-4dc2-9aad-d7aeb8bddc89'
	proj_id = 'c6c535ce-cacd-435b-94af-002792817e75'
	title = 'CPF3'
	author = 'Giuseppe Canale'
	content = '1 file + Project cover'
	fingerprint = '4fe7b050ae4020d6baf57ee6663f3790465ea6e22efc1f00cf2c0faa8adabbe2'
	reg_date = 'Aug 27, 2025 at 01:42:18 UTC'
	authority = 'DigiCert, Inc.'
	tsa = 'C=US/O=DigiCert, Inc./CN=DigiCert SHA256 RSA4096 Timestamp Responder 2025 1'
	serial = '00E0F685106A87AB6FC11EE1A95C9BE96B'
	status = 'CONFIRMED'
	policy = '2.16.840.1.114412.7.1'

	# Poi usa le variabili
	certificate_data = {
		'certificate_id': cert_id,
		'project_id': proj_id,
		'project_title': title,
		'submitted_by': author,
		'content': content,
		'fingerprint': fingerprint,
		'registration_date': reg_date,
		'authority': authority,
		'tsa': tsa,
		'serial_number': serial,
		'status': status,
		'policy': policy
	}
	
	# Genera il certificato
	generator = CPF3PVMSCertificateGenerator()
	
	# Con logo PNG (il file deve essere nella stessa cartella)
	generator.generate_certificate(
		"cpf3_pvms_certificate.pdf", 
		certificate_data, 
		qr_url="https://cpf3.org",
		logo_path="logo_cpf3.png"
	)
	
	# Esempio con dati diversi
	# new_data = certificate_data.copy()
	# new_data['project_title'] = 'NUOVO_PROGETTO'
	# new_data['submitted_by'] = 'Mario Rossi'
	# new_data['registration_date'] = 'Oct 13, 2025 at 10:30:00 UTC'
	
	# generator.generate_certificate(
	#    "cpf3_pvms_certificate_nuovo.pdf", 
	#    new_data, 
	#    qr_url="https://cpf3.org/nuovo"
	#)