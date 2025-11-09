#!/bin/bash

# CPF Dashboard Launcher
# Starts HTTP server and opens browser

echo "🚀 Starting CPF Dashboard..."
echo ""

# Check if data exists
if [ ! -f "data/organizations.json" ]; then
    echo "⚠️  Data not found. Generating synthetic data..."
    cd scripts
    node generate_synthetic_data.js
    cd ..
    echo ""
fi

# Start HTTP server
echo "🌐 Starting HTTP server on http://localhost:8000"
echo ""
echo "📊 Dashboard will open at: http://localhost:8000/dashboard.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Open browser after 2 seconds (gives server time to start)
(sleep 2 && open http://localhost:8000/dashboard.html 2>/dev/null || xdg-open http://localhost:8000/dashboard.html 2>/dev/null || firefox http://localhost:8000/dashboard.html 2>/dev/null) &

# Start Python HTTP server
python3 -m http.server 8000
