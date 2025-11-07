# MisResultados PWA - Development Guide for AI Assistants

This document provides comprehensive guidance for AI assistants working on the MisResultados Progressive Web App.

## Project Overview

The PWA is a mobile-first web application that provides easy access to medical laboratory results from misresultados.com. It's designed for non-technical users who primarily use mobile default browsers (Safari on iOS, Chrome on Android).

## Architecture

### Technology Stack

- **Build Tool**: Vite 5.x
- **Language**: Vanilla JavaScript (ES6+ modules)
- **Styling**: Pure CSS (no frameworks)
- **PWA Plugin**: vite-plugin-pwa
- **Dependencies**: Zero runtime dependencies (intentional)

### Design Philosophy

1. **Minimal Dependencies**: Only essential dev dependencies
2. **Privacy-First**: All data stored locally, no cloud sync
3. **Mobile-First**: Designed for small screens first
4. **Progressive Enhancement**: Works on older browsers, better on newer
5. **Accessibility**: WCAG 2.1 Level AA compliant

### Project Structure

```
pwa/
├── src/
│   ├── api/                    # API layer
│   │   ├── client.js          # Fetch-based HTTP client
│   │   ├── parser.js          # HTML/URL parsing utilities
│   │   └── constants.js       # API constants and patterns
│   │
│   ├── components/            # UI components
│   │   ├── ui.js             # UI utilities (screens, toasts, loading)
│   │   └── i18n.js           # Internationalization
│   │
│   ├── storage/              # Data persistence
│   │   └── localStorage.js   # LocalStorage wrapper
│   │
│   ├── locales/              # Translations
│   │   ├── es.js            # Spanish (default)
│   │   └── en.js            # English
│   │
│   ├── styles/
│   │   └── main.css         # All application styles
│   │
│   └── main.js              # Application entry point
│
├── public/
│   ├── icons/               # PWA icons
│   │   ├── icon.svg        # Source icon
│   │   └── *.png           # Generated icons (72-512px)
│   └── service-worker-fallback.js  # Manual SW (if plugin fails)
│
├── index.html               # Main HTML file
├── vite.config.js          # Vite + PWA configuration
├── package.json
└── README.md
```

## Core Concepts

### 1. Screen Management

The app has three main screens:

- **Setup Screen** (`setup-screen`): Patient information entry
- **Fetch Screen** (`fetch-screen`): Results search interface
- **Results Screen** (`results-screen`): Results display

Screens are toggled using the `showScreen(id)` utility:

```javascript
import { showScreen } from './components/ui.js';
showScreen('fetch-screen'); // Shows fetch screen, hides others
```

### 2. Patient Information Flow

```
First Visit → Setup Screen → Save to localStorage → Fetch Screen
Returning Visit → Load from localStorage → Fetch Screen
Edit Patient → Pre-fill Setup Screen → Update localStorage
```

Patient data structure:
```javascript
{
  name: "Apellidos Del Paciente",
  day: "15",    // DD (zero-padded)
  month: "01",  // MM (zero-padded)
  year: "1990"  // YYYY
}
```

### 3. Results Fetching

Two methods:

**Method 1: Manual Entry**
```javascript
// User enters control number and lab license
control: "98765432"
license: "5678"
```

**Method 2: Link Parsing**
```javascript
// User pastes full URL
url: "https://misresultados.com/soy-un-paciente/?controlnumber=98765432&lablicense=5678"
// Automatically extracts control and license
```

### 4. API Client

The `MisResultadosClient` class handles all API interactions:

```javascript
const client = new MisResultadosClient();

// Fetch results
const results = await client.fetchResults(patientInfo, control, license);
// Returns: [{ order, license, transmitted, pdfUrl }, ...]

// Open PDF in new tab
client.downloadPDF(pdfUrl);

// Get PDF as blob for download
const blob = await client.getPDFBlob(pdfUrl);
```

**Important**: The API client uses the Fetch API with `credentials: 'include'` to handle session cookies automatically. The browser manages PHPSESSID cookies transparently.

### 5. Internationalization

The app supports Spanish (default) and English:

```javascript
import { t, setLanguage } from './components/i18n.js';

// Get translation
const message = t('errors.fetchFailed');

// With parameters
const count = t('results.count', { count: 5 }); // "5 resultado(s) encontrado(s)"

// Change language
setLanguage('en'); // Automatically updates all UI
```

Translation keys use dot notation:
```javascript
t('app.title')           // "MisResultados Helper"
t('setup.nameLabel')     // "Apellidos completos"
t('errors.fetchFailed')  // "Error al buscar resultados..."
```

### 6. Local Storage

All patient data is stored in browser's localStorage:

```javascript
import { savePatientInfo, getPatientInfo, clearPatientInfo } from './storage/localStorage.js';

// Save
savePatientInfo({ name, day, month, year });

// Retrieve
const patient = getPatientInfo(); // Returns object or null

// Clear
clearPatientInfo();
```

**Storage Keys**:
- `misresultados_patient_info`: Patient data (JSON)
- `misresultados_language`: Language preference ('es' or 'en')
- `misresultados_theme`: Theme preference (future: 'light' or 'dark')

### 7. UI Utilities

Common UI operations:

```javascript
import { showToast, showLoading, hideLoading } from './components/ui.js';

// Toast notifications
showToast('Guardado exitosamente', 'success');
showToast('Error al conectar', 'error');
showToast('Verifica los datos', 'warning');
showToast('Procesando...', 'info');

// Loading overlay
showLoading('Buscando resultados...');
// ... async operation ...
hideLoading();
```

## Common Tasks

### Adding a New Translation

1. Add to `src/locales/es.js`:
```javascript
export default {
  // ...
  newFeature: {
    title: 'Nuevo Título',
    description: 'Nueva descripción'
  }
};
```

2. Add to `src/locales/en.js`:
```javascript
export default {
  // ...
  newFeature: {
    title: 'New Title',
    description: 'New description'
  }
};
```

3. Use in code:
```javascript
const title = t('newFeature.title');
```

4. Use in HTML:
```html
<h2 data-i18n="newFeature.title">Nuevo Título</h2>
```

### Adding a New Screen

1. Add HTML to `index.html`:
```html
<section id="new-screen" class="screen hidden">
  <div class="container">
    <h2>New Screen</h2>
    <!-- Content -->
  </div>
</section>
```

2. Add navigation in `main.js`:
```javascript
function showNewScreen() {
  showScreen('new-screen');
}
```

3. Add CSS for screen-specific styles in `main.css`:
```css
#new-screen .custom-element {
  /* styles */
}
```

### Adding a New Form

1. Add form HTML:
```html
<form id="new-form" class="new-form">
  <div class="field-group">
    <label for="field">Label</label>
    <input type="text" id="field" required />
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

2. Add event listener in `main.js`:
```javascript
function setupEventListeners() {
  // ...
  const newForm = document.getElementById('new-form');
  if (newForm) {
    newForm.addEventListener('submit', handleNewForm);
  }
}

async function handleNewForm(e) {
  e.preventDefault();
  const value = document.getElementById('field').value;
  // Process form
}
```

### Styling Guidelines

**CSS Variables** (defined in `:root`):
```css
var(--primary-green)      /* #4CAF50 - Primary actions */
var(--text-primary)       /* #2c3e50 - Main text */
var(--spacing-md)         /* 16px - Standard spacing */
var(--radius-sm)          /* 4px - Border radius */
var(--shadow-md)          /* Box shadow */
```

**Button Styles**:
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary">Secondary Action</button>
<button class="btn-back">← Back</button>
<button class="btn-icon">✏️</button>
```

**Responsive Breakpoints**:
```css
/* Mobile first - base styles are for mobile */
@media (min-width: 768px) {
  /* Tablet and up */
}
```

## Testing

### Manual Testing Checklist

**Patient Setup**:
- [ ] Form validates required fields
- [ ] Date dropdowns populate correctly
- [ ] Data saves to localStorage
- [ ] Privacy note displays

**Results Fetching**:
- [ ] Manual entry (control + license) works
- [ ] Link parsing extracts correct values
- [ ] Loading overlay shows during fetch
- [ ] Error handling works (invalid data, network errors)

**Results Display**:
- [ ] Results list renders correctly
- [ ] Result count displays
- [ ] PDF view button opens in new tab
- [ ] PDF download works (blob download)

**Localization**:
- [ ] Language toggle switches all text
- [ ] Both Spanish and English complete
- [ ] Date formats appropriate for locale

**Offline/PWA**:
- [ ] App works offline (cached resources)
- [ ] "Add to Home Screen" prompt appears
- [ ] Icon displays on home screen
- [ ] Splash screen shows on iOS

**Mobile**:
- [ ] Touch targets ≥44px
- [ ] Forms usable with on-screen keyboard
- [ ] Toast notifications don't overlap content
- [ ] Scrolling smooth on all screens

### Browser Testing

Test on:
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)
- Desktop Chrome, Firefox, Safari

### Debugging

Enable console logs:
```javascript
// In browser console:
localStorage.debug = '*';
// Reload page to see debug logs
```

Check localStorage:
```javascript
// In browser console:
localStorage.getItem('misresultados_patient_info');
```

## Deployment

### Prerequisites

- HTTPS required (PWAs must be secure)
- Static hosting with SPA support

### Build

```bash
pnpm build
# Output: dist/
```

### Deployment Options

**GitHub Pages**:
```bash
# Set base in vite.config.js
export default defineConfig({
  base: '/resultados-medicos/',
  // ...
});

# Build and push dist/ to gh-pages branch
```

**Vercel**:
```bash
vercel --prod
```

**Netlify**:
```bash
# Add netlify.toml:
[build]
  publish = "dist"
  command = "pnpm build"
```

### Post-Deployment

1. Test PWA installability (Chrome DevTools → Application → Manifest)
2. Test offline functionality (Network throttling → Offline)
3. Run Lighthouse audit (Performance, PWA, Accessibility)

## Known Issues & Workarounds

### Issue 1: CORS with misresultados.com

**Problem**: If misresultados.com changes CORS policy, fetch may fail.

**Workaround**: Deploy a simple proxy server or use browser extension to bypass CORS (dev only).

### Issue 2: Session Cookies on iOS

**Problem**: iOS Safari may block cookies in some contexts.

**Workaround**: Ensure PWA is accessed from same origin or installed to home screen.

### Issue 3: PDF Downloads on iOS

**Problem**: iOS may open PDFs in new tab instead of downloading.

**Workaround**: This is expected behavior. Users can still save from PDF viewer.

### Issue 4: localStorage Clearing

**Problem**: Browsers may clear localStorage under storage pressure.

**Workaround**: Future: Add export/import functionality for patient data.

## Performance Optimization

### Current Optimizations

1. **No runtime dependencies**: Reduces bundle size
2. **CSS in single file**: One HTTP request
3. **Service worker caching**: Instant load on repeat visits
4. **Lazy loading**: Results only rendered when needed

### Future Optimizations

1. **Code splitting**: Separate vendor chunks (if adding dependencies)
2. **Image optimization**: Compress PNG icons
3. **Critical CSS**: Inline above-fold styles
4. **Preload fonts**: If using custom fonts

## Security Considerations

### Data Privacy

- Patient info never leaves device (except during API calls to misresultados.com)
- No analytics or tracking
- No third-party requests
- localStorage is origin-bound (only this app can access)

### Content Security Policy

Recommended CSP headers:
```
Content-Security-Policy:
  default-src 'self';
  connect-src 'self' https://misresultados.com;
  style-src 'self' 'unsafe-inline';
  script-src 'self';
```

### XSS Prevention

- All user input is escaped when rendered
- No use of `innerHTML` with user data
- No `eval()` or `Function()` constructors

## Accessibility

### Current Features

- Semantic HTML (proper heading hierarchy)
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators (`:focus-visible`)
- High contrast mode support
- Reduced motion support
- Sufficient color contrast (WCAG AA)

### Testing

Use browser tools:
- Chrome DevTools → Lighthouse → Accessibility
- Firefox DevTools → Accessibility Inspector
- Screen reader testing (VoiceOver on iOS, TalkBack on Android)

## Code Style

### JavaScript

- ES6+ modules
- Async/await over promises
- Descriptive variable names
- JSDoc comments for exported functions
- No semicolons (Prettier default)

### CSS

- BEM-like naming for specific components
- Mobile-first media queries
- CSS variables for theming
- Logical grouping with section comments

### Naming Conventions

- Files: `kebab-case.js`
- Functions: `camelCase()`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- CSS classes: `kebab-case` or `component-name`

## Troubleshooting

### App doesn't load

1. Check console for errors
2. Verify all files are in `dist/` after build
3. Check service worker registration
4. Clear cache and reload

### Results don't fetch

1. Verify patient info is saved
2. Check network tab for failed requests
3. Verify control/license numbers are correct
4. Test directly on misresultados.com

### PDFs don't open

1. Check if user is logged in (session cookies)
2. Verify PDF URL is correct
3. Try opening PDF URL directly in browser
4. Check browser console for errors

### Translations missing

1. Verify key exists in both `es.js` and `en.js`
2. Check for typos in key path
3. Run `t()` function in console to test
4. Ensure `initI18n()` called on load

## Contributing

When making changes:

1. Test on mobile devices (real devices preferred)
2. Verify translations complete in both languages
3. Run `pnpm format` before committing
4. Update this guide if adding major features
5. Keep dependencies minimal (justify any additions)

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA Checklist](https://web.dev/pwa-checklist/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated**: November 2025
**Version**: 0.1.0 (MVP)
