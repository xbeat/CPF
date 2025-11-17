# CPF - Python Development Setup

Complete guide for setting up the Python development environment for the CPF (Cognitive Persuasion Framework) project.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Git

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/xbeat/CPF.git
cd CPF
```

### 2. Create Virtual Environment

**On Linux/macOS:**
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
```

**On Windows:**
```cmd
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate
```

You should see `(venv)` appear in your command prompt when the virtual environment is active.

### 3. Upgrade pip

```bash
python -m pip install --upgrade pip
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist yet, see the "Dependencies" section below.

## Python Project Structure

```
CPF/
├── api/                    # Backend API (Flask/FastAPI)
│   ├── __init__.py
│   ├── app.py             # Main application
│   ├── models/            # Database models
│   ├── routes/            # API endpoints
│   └── utils/             # Helper functions
├── dashboard/             # Frontend dashboard
│   └── auditing/
│       └── client-v3/     # Refactored client
├── venv/                  # Virtual environment (gitignored)
├── requirements.txt       # Python dependencies
├── .gitignore
└── README.md
```

## Dependencies

### Core Dependencies

Create or update `requirements.txt`:

```txt
# Web Framework
Flask==3.0.0
flask-cors==4.0.0

# Database
SQLAlchemy==2.0.23
psycopg2-binary==2.9.9

# API & Validation
marshmallow==3.20.1
python-dotenv==1.0.0

# Development
pytest==7.4.3
pytest-cov==4.1.0
black==23.11.0
flake8==6.1.0
mypy==1.7.1
```

### Optional Dependencies

For additional features:

```txt
# Data Processing
pandas==2.1.3
numpy==1.26.2

# Authentication
PyJWT==2.8.0
bcrypt==4.1.1

# Async support (if using FastAPI)
fastapi==0.104.1
uvicorn==0.24.0
```

## Environment Configuration

### 1. Create `.env` File

```bash
# Copy example environment file
cp .env.example .env

# Edit with your settings
nano .env
```

### 2. Environment Variables

Add to `.env`:

```bash
# Flask Configuration
FLASK_APP=api/app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cpf_db

# API Configuration
API_PORT=5000
API_HOST=0.0.0.0

# CORS
CORS_ORIGINS=http://localhost:8000,http://localhost:3000

# Session
SESSION_TYPE=filesystem
PERMANENT_SESSION_LIFETIME=3600
```

## Running the Application

### Development Server

```bash
# Activate virtual environment
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate     # Windows

# Run Flask development server
flask run

# Or with custom host/port
flask run --host=0.0.0.0 --port=5000

# Or directly with Python
python api/app.py
```

### Production Server

```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 api.app:app

# Or with multiple workers and timeout
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 120 api.app:app
```

## Database Setup

### Initialize Database

```bash
# Create database (PostgreSQL example)
createdb cpf_db

# Run migrations
flask db upgrade

# Or manually with Python
python -c "from api.app import db; db.create_all()"
```

### Database Migrations (with Flask-Migrate)

```bash
# Install Flask-Migrate
pip install Flask-Migrate

# Initialize migrations
flask db init

# Create migration
flask db migrate -m "Initial migration"

# Apply migration
flask db upgrade

# Rollback migration
flask db downgrade
```

## Testing

### Run Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=api --cov-report=html

# Run specific test file
pytest tests/test_api.py

# Run with verbose output
pytest -v

# Run and stop at first failure
pytest -x
```

### Run Linters

```bash
# Format code with Black
black api/

# Check code style with Flake8
flake8 api/

# Type checking with mypy
mypy api/
```

## Common Commands

### Virtual Environment

```bash
# Activate
source venv/bin/activate       # Linux/macOS
venv\Scripts\activate          # Windows

# Deactivate
deactivate

# Delete and recreate
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Package Management

```bash
# Install new package
pip install package-name

# Install with specific version
pip install package-name==1.0.0

# Save current dependencies
pip freeze > requirements.txt

# Uninstall package
pip uninstall package-name

# List installed packages
pip list

# Show package info
pip show package-name
```

### Development Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Activate venv
source venv/bin/activate

# 3. Update dependencies
pip install -r requirements.txt

# 4. Run migrations
flask db upgrade

# 5. Run tests
pytest

# 6. Start development server
flask run
```

## Serving Frontend (Dashboard)

The dashboard is static HTML/CSS/JS. Serve it with:

### Option 1: Python HTTP Server

```bash
cd dashboard/auditing

# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Access at: http://localhost:8000
```

### Option 2: Node.js (http-server)

```bash
# Install globally
npm install -g http-server

# Run
cd dashboard/auditing
http-server -p 8000
```

### Option 3: PHP

```bash
cd dashboard/auditing
php -S localhost:8000
```

## Troubleshooting

### Issue: `pip: command not found`

```bash
# Install pip
python3 -m ensurepip --upgrade
```

### Issue: `Permission denied` on Linux/macOS

```bash
# Don't use sudo, use virtual environment instead
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: `Module not found`

```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt

# Check Python path
python -c "import sys; print(sys.path)"
```

### Issue: Database connection failed

```bash
# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Test PostgreSQL connection
psql -h localhost -U user -d cpf_db

# Create database if missing
createdb cpf_db
```

### Issue: Port already in use

```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
flask run --port=5001
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/python-tests.yml`:

```yaml
name: Python Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'

    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt

    - name: Run tests
      run: |
        pytest --cov=api

    - name: Lint
      run: |
        flake8 api/
```

## Additional Resources

- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [pytest Documentation](https://docs.pytest.org/)

## Quick Reference

```bash
# Setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Development
flask run                    # Start server
pytest                       # Run tests
black api/                   # Format code
flake8 api/                  # Lint code

# Database
flask db migrate             # Create migration
flask db upgrade             # Apply migration

# Package management
pip install package          # Install
pip freeze > requirements.txt  # Save deps
pip install -r requirements.txt  # Install deps

# Frontend
python3 -m http.server 8000  # Serve dashboard
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `FLASK_APP` | Main application file | `api/app.py` |
| `FLASK_ENV` | Environment mode | `development` or `production` |
| `SECRET_KEY` | Flask secret key | `your-secret-key` |
| `DATABASE_URL` | Database connection | `postgresql://user:pass@host/db` |
| `API_PORT` | API server port | `5000` |
| `API_HOST` | API server host | `0.0.0.0` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:8000` |

## Contact & Support

For issues or questions:
- GitHub Issues: https://github.com/xbeat/CPF/issues
- Documentation: See README.md
