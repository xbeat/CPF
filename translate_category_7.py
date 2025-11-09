#!/usr/bin/env python3
"""
Script per tradurre i file JSON della categoria 7.x-stress da en-US a it-IT
Mantiene le chiavi JSON in inglese, traduce i valori in italiano con registro formale "Lei"
"""

import json
import os
import re
from pathlib import Path

# Traduzioni comuni (mantenendo termini tecnici con inglese tra parentesi)
TRANSLATIONS = {
    # Metadati
    "language": "it-IT",
    "language_name": "Italiano (Italia)",
    "is_translation": True,
    "translated_from": "en-US",
    "translation_date": "2025-11-09",
    "translator": "Claude AI",

    # Livelli di maturità
    "Low Vulnerability - Resilient": "Bassa Vulnerabilità - Resiliente",
    "Moderate Vulnerability - Developing": "Vulnerabilità Moderata - In Sviluppo",
    "High Vulnerability - Critical": "Alta Vulnerabilità - Critica",

    # Comuni
    "QUICK ASSESSMENT": "VALUTAZIONE RAPIDA",
    "CLIENT CONVERSATION": "CONVERSAZIONE CON IL CLIENTE",
}

def translate_text(text, context=""):
    """
    Traduce il testo mantenendo formule, riferimenti scientifici e termini tecnici
    """
    if not isinstance(text, str):
        return text

    # Non tradurre formule matematiche
    if re.match(r'^[A-Z_]+\(.*\)\s*=', text) or '×' in text or '∏' in text or '∑' in text or 'Σ' in text:
        return text

    # Non tradurre riferimenti scientifici (autore + anno)
    if re.match(r'^[A-Z][a-z]+,\s+[A-Z]\..*\(\d{4}\)', text):
        return text

    # Non tradurre query SQL/codice
    if 'SELECT' in text or 'FROM' in text or 'WHERE' in text:
        return text

    # Non tradurre nomi di API/sistemi
    if 'API' in text and '-' in text and '/' in text:
        return text

    # Traduzioni dirette
    if text in TRANSLATIONS:
        return TRANSLATIONS[text]

    # Se il testo è già stato tradotto (indicatore: presenza di caratteri accentati italiani)
    if any(c in text for c in 'àèéìòù'):
        return text

    return text  # Lasciare invariato se non c'è traduzione specifica

# Questo è uno script stub - la traduzione completa richiederebbe un servizio di traduzione
# Per ora, continuiamo manualmente con i file rimanenti

print("Script preparato. Continuare con traduzione manuale dei file rimanenti.")
