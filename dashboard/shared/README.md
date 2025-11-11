# Dashboard Shared Resources

This folder contains common resources shared across all CPF dashboard modules.

## Files

- **styles.css**: Common CSS styles used by both Auditing and SOC dashboards
  - Used by: `auditing/index.html`, `soc/index.html`
  - Contains: base variables, typography, layout, components

## Usage

Reference shared resources using relative paths:

```html
<link rel="stylesheet" href="../shared/styles.css">
```

## Maintenance

When updating shared styles:
1. Test changes in both Auditing and SOC dashboards
2. Ensure no breaking changes to existing components
3. Document any new CSS variables or classes
