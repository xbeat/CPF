# Dashboard Huge Refactoring - Context & Plan

## 📋 Current State Analysis

### Existing Dashboards

#### 1. **Dashboard SOC** (`/dashboard/soc/`)
- **Purpose**: SOC + Bayesian Analysis Dashboard
- **Main File**: `index.html` (651 lines)
- **Features**:
  - Multi-organization sidebar
  - Overall risk assessment with Bayesian inference
  - Category heatmap (10 categories: authority, temporal, social, etc.)
  - Prioritization matrix
  - SOC vs Human convergence chart
  - Indicator grid (100 indicators)
  - Indicator detail modal with GitHub integration
- **Technology**:
  - Vanilla JavaScript (inline in HTML)
  - Canvas-based charts
  - Shared CSS (`../shared/styles.css`)
- **Dependencies**:
  - `bayesian.js` - Bayesian inference engine
  - `visualizations.js` - Chart rendering

#### 2. **Dashboard Auditing** (`/dashboard/auditing/`)
- **Purpose**: Field Kit Progress Tracking + Risk Analysis
- **Main File**: `index.html` (2,623 lines - HUGE!)
- **Features**:
  - Two-tab interface (Progress Tracking / Risk Analysis)
  - Organization selector sidebar
  - Progress tracking:
    - Overall completion percentage
    - Category-level progress bars
    - 10×10 indicator grid
    - Missing indicators list
  - Risk analysis (similar to SOC dashboard):
    - Overall risk score
    - Category heatmap
    - Prioritization matrix
    - Convergence chart
    - Indicator grid with risk colors
- **Technology**:
  - Vanilla JavaScript (inline in HTML - 2000+ lines!)
  - Inline CSS styles (mixed with shared CSS)
  - Duplicated code from SOC dashboard
- **Dependencies**:
  - Uses shared Bayesian logic (duplicated inline)

#### 3. **Client Tool** (`/dashboard/client/`)
- **Purpose**: Auditor Field Kit Assessment Tool
- **Main File**: `index.html` (118 lines)
- **Features**:
  - Load indicator JSON
  - Assessment form
  - Export data
  - Validation
- **Technology**:
  - External JS files: `script.js`, `validator.js`
  - External CSS: `styles.css`
  - Better modularity than dashboards

---

## 🔍 Common Components Identified

### 1. **Shared UI Components**
- ✅ Header with title/subtitle
- ✅ Sidebar with organization list
- ✅ Sidebar open/close buttons (two-button system)
- ✅ Organization cards with:
  - Name, industry
  - Risk badge (low/medium/high)
  - Progress stats
  - Active state
- ✅ Modal dialogs (indicator details, reference guide)
- ✅ Risk cards with:
  - Risk value (percentage)
  - Risk bar (color-coded)
  - Metadata (confidence, trend, last updated)
- ✅ Loading states
- ✅ Empty states

### 2. **Shared Data Processing**
- ✅ Bayesian inference engine (`bayesian.js`)
  - Category risk calculation
  - Bayesian network inference
  - Overall risk calculation
  - Prioritization generation
  - Trend analysis
- ✅ API data fetching:
  - `/api/organizations`
  - `/api/organizations/{id}`
- ✅ Data format conversion (API v2.0 → Bayesian format)

### 3. **Shared Visualizations**
- ✅ Category heatmap
- ✅ Prioritization table
- ✅ Indicator grid (10×10, 100 indicators)
- ✅ Convergence chart (SOC vs Human)
- ✅ Risk bars and badges

### 4. **Shared Styles**
- Partial: SOC uses `shared/styles.css`
- Problem: Auditing has massive inline CSS duplication
- Color scheme:
  ```css
  --primary: #1a1a2e / #1e3a8a
  --success: #2ecc71 / #10b981
  --warning: #f39c12 / #f59e0b
  --danger: #e74c3c / #ef4444
  ```

---

## 🚨 Critical Issues

### 1. **Code Duplication**
- **Severity**: HIGH
- **Details**:
  - Bayesian analysis code duplicated between SOC and Auditing
  - Organization sidebar rendering duplicated
  - Modal logic duplicated
  - Indicator grid rendering duplicated
  - Risk calculation duplicated
- **Impact**: Maintenance nightmare, bug fixes need to be applied twice

### 2. **Monolithic HTML Files**
- **Severity**: CRITICAL
- **Details**:
  - Auditing dashboard: 2,623 lines in ONE file
  - Inline JavaScript: ~1,800 lines
  - Inline CSS: ~600 lines
  - No separation of concerns
- **Impact**: Unmaintainable, hard to debug, difficult to enhance

### 3. **Style Inconsistency**
- **Severity**: MEDIUM
- **Details**:
  - SOC uses `shared/styles.css`
  - Auditing has its own inline styles
  - Client has separate `styles.css`
  - Color values differ slightly between dashboards
- **Impact**: Inconsistent UX, harder to maintain brand identity

### 4. **No Component Reusability**
- **Severity**: HIGH
- **Details**:
  - Every dashboard reimplements the same UI components
  - No shared JavaScript modules (except bayesian.js, visualizations.js)
  - No templating system
- **Impact**: Adding new features requires changes in multiple places

### 5. **Poor Modularity**
- **Severity**: HIGH
- **Details**:
  - No clear module boundaries
  - Global state management
  - Functions not organized
- **Impact**: Hard to test, hard to extend

---

## 🎯 Refactoring Goals

### 1. **Create Shared Component Library**
- Extract common UI components:
  - `Sidebar.js` - Organization list with open/close
  - `Header.js` - Dashboard header
  - `Modal.js` - Generic modal dialog
  - `RiskCard.js` - Risk display component
  - `CategoryHeatmap.js` - Category visualization
  - `IndicatorGrid.js` - 10×10 indicator matrix
  - `PrioritizationTable.js` - Priority matrix
  - `ConvergenceChart.js` - SOC vs Human chart
  - `OrganizationCard.js` - Organization list item
  - `LoadingState.js` - Loading spinner
  - `EmptyState.js` - Empty state message

### 2. **Modularize JavaScript**
- Separate concerns:
  - `api.js` - API calls
  - `state.js` - State management
  - `utils.js` - Utility functions
  - `formatter.js` - Data formatting
  - `renderer.js` - DOM rendering
- Use ES6 modules
- Remove global variables

### 3. **Unified Styling System**
- Create comprehensive `shared/styles.css`:
  - CSS variables for theming
  - Component-specific styles
  - Utility classes
  - Responsive breakpoints
- Remove all inline styles
- Standardize color palette

### 4. **Dashboard-Specific Files**
- SOC Dashboard:
  - `soc/index.html` - Minimal HTML shell
  - `soc/dashboard.js` - SOC-specific logic
  - `soc/config.js` - Configuration
- Auditing Dashboard:
  - `auditing/index.html` - Minimal HTML shell
  - `auditing/dashboard.js` - Auditing-specific logic
  - `auditing/tabs.js` - Tab management
  - `auditing/config.js` - Configuration

### 5. **Improve Architecture**
```
dashboard/
├── shared/
│   ├── styles.css           # Unified styles
│   ├── components/          # Reusable UI components
│   │   ├── Sidebar.js
│   │   ├── Header.js
│   │   ├── Modal.js
│   │   ├── RiskCard.js
│   │   ├── CategoryHeatmap.js
│   │   ├── IndicatorGrid.js
│   │   ├── PrioritizationTable.js
│   │   └── ConvergenceChart.js
│   ├── lib/                 # Core libraries
│   │   ├── api.js
│   │   ├── state.js
│   │   ├── utils.js
│   │   ├── formatter.js
│   │   └── bayesian.js      # (moved from root)
│   └── assets/              # Images, icons
├── soc/
│   ├── index.html           # Minimal shell (~100 lines)
│   ├── dashboard.js         # SOC-specific logic
│   └── config.js
├── auditing/
│   ├── index.html           # Minimal shell (~100 lines)
│   ├── dashboard.js         # Auditing-specific logic
│   ├── tabs.js
│   └── config.js
└── client/
    ├── index.html
    ├── script.js
    └── styles.css
```

---

## 📝 Refactoring Plan (Phased Approach)

### Phase 1: Foundation (CURRENT)
- [x] Analyze current structure
- [x] Identify common components
- [x] Document architecture
- [ ] Create refactoring plan

### Phase 2: Shared Infrastructure
- [ ] Create `shared/components/` directory
- [ ] Move and enhance `bayesian.js` to `shared/lib/`
- [ ] Move `visualizations.js` to `shared/lib/`
- [ ] Create `shared/lib/api.js`
- [ ] Create `shared/lib/state.js`
- [ ] Create `shared/lib/utils.js`
- [ ] Unify and expand `shared/styles.css`

### Phase 3: Component Extraction
- [ ] Extract `Sidebar.js` from SOC dashboard
- [ ] Extract `Header.js`
- [ ] Extract `Modal.js`
- [ ] Extract `RiskCard.js`
- [ ] Extract `CategoryHeatmap.js`
- [ ] Extract `IndicatorGrid.js`
- [ ] Extract `PrioritizationTable.js`
- [ ] Extract `ConvergenceChart.js` (refactor from visualizations.js)
- [ ] Extract `OrganizationCard.js`

### Phase 4: Refactor SOC Dashboard
- [ ] Create new `soc/index.html` (minimal shell)
- [ ] Create `soc/dashboard.js` using shared components
- [ ] Create `soc/config.js`
- [ ] Test all features
- [ ] Remove old inline code

### Phase 5: Refactor Auditing Dashboard
- [ ] Create new `auditing/index.html` (minimal shell)
- [ ] Create `auditing/dashboard.js` using shared components
- [ ] Create `auditing/tabs.js` (Progress + Risk Analysis)
- [ ] Create `auditing/config.js`
- [ ] Test all features
- [ ] Archive old 2,623-line monster

### Phase 6: Polish & Documentation
- [ ] Add JSDoc comments to all modules
- [ ] Create component usage guide
- [ ] Update README.md
- [ ] Add migration notes
- [ ] Performance optimization
- [ ] Accessibility improvements

---

## 🎨 Design Principles

1. **DRY (Don't Repeat Yourself)**
   - Single source of truth for each component
   - Shared logic extracted to libraries

2. **Separation of Concerns**
   - HTML: Structure only
   - CSS: Presentation only
   - JS: Behavior only

3. **Modularity**
   - Small, focused modules
   - Clear interfaces
   - Easy to test

4. **Reusability**
   - Components work in any dashboard
   - Configuration-driven behavior

5. **Maintainability**
   - Clear file organization
   - Consistent naming conventions
   - Comprehensive documentation

---

## 📊 Success Metrics

- ✅ Reduce Auditing dashboard from 2,623 to ~100 lines HTML
- ✅ Reduce total codebase by ~40% through component reuse
- ✅ All features working in both dashboards
- ✅ Consistent styling across all dashboards
- ✅ Improved performance (faster load, less duplication)
- ✅ Easier to add new features (shared components)

---

## 🔄 Migration Strategy

1. **Non-Breaking**: Keep old dashboards working during refactoring
2. **Parallel Development**: Build new structure alongside old
3. **Incremental Testing**: Test each component independently
4. **Feature Parity**: Ensure all features work in new structure
5. **Archive Old**: Move old files to `_archive/` when complete

---

## 🚀 Next Steps

1. ✅ Create this context document
2. ⏳ Get approval on refactoring approach
3. ⏳ Start Phase 2: Shared Infrastructure
4. ⏳ Extract first component (Sidebar.js)
5. ⏳ Iterate on remaining components

---

**Status**: Context created, awaiting approval to proceed with refactoring.

**Last Updated**: 2025-11-12
