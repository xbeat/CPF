#!/bin/bash

# CPF Dashboard Launcher
# Starts Node server and opens browser

echo "🚀 Starting CPF Dashboard..."
echo ""

# Check if demo data exists
if [ ! -f "data/soc/organizations_index.json" ]; then
    echo "⚠️  Demo data not found. Generating..."
    npm run generate:demo
    echo ""
fi

# Start Node server
echo "🌐 Starting server on http://localhost:3000"
echo ""
echo "🏠 Landing: http://localhost:3000/"
echo "📊 Dashboard: http://localhost:3000/dashboard/"
echo "📋 Auditing: http://localhost:3000/dashboard/auditing/"
echo "🔄 SOC: http://localhost:3000/dashboard/soc/"
echo "🎮 Simulator: http://localhost:3000/dashboard/simulator/"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Open browser after 2 seconds (landing page at root)
(sleep 2 && open http://localhost:3000/ 2>/dev/null || xdg-open http://localhost:3000/ 2>/dev/null) &

# Start server
npm start
