# misresultados-tools

## Overview

This monorepo contains tools for interacting with [misresultados.com](https://misresultados.com/), a healthcare results platform in Puerto Rico. The project consists of two main components: a CLI tool and a Firefox browser extension.

**Purpose**: Personal productivity tools to simplify access to medical laboratory results from misresultados.com
**Author**: Raúl Negrón-Otero
**License**: MIT
**Tech Stack**: Node.js (ES modules), JavaScript, WebExtensions API

## Project Structure

```
.
├── cli/                        # CLI tool for fetching and downloading medical results
│   ├── bin/
│   │   └── resultados.js      # CLI entry point
│   ├── lib/
│   │   ├── config.js          # Config management (~/.misresultados-cli/config.json)
│   │   ├── constants.js       # API URLs and constants
│   │   ├── http.js            # HTTP client for misresultados.com API
│   │   ├── parser.js          # HTML response parsing
│   │   ├── services.js        # Core business logic (fetch/download)
│   │   ├── ui.js              # CLI output formatting
│   │   └── index.js           # Library exports
│   └── tests/
│       ├── unit/              # Unit tests
│       └── integration/       # Integration tests
│
├── extension/                  # Firefox extension for auto-filling patient data
│   ├── popup/
│   │   ├── popup.html         # Extension settings UI
│   │   └── popup.js           # Settings logic
│   ├── content/
│   │   ├── autofill.js        # Content script for form auto-fill
│   │   └── styles.css         # Autofill indicator styles
│   ├── _locales/              # i18n support (es, en)
│   ├── icons/
│   └── manifest.json          # Extension manifest (v3)
│
└── .github/
    └── workflows/
        ├── cli-ci.yml         # CLI testing workflow
        ├── extension-ci.yml   # Extension linting workflow
        └── release.yml        # Release automation
```

## Components

### CLI Tool (`cli/`)

A command-line interface for programmatically accessing medical records from misresultados.com.

**Key Features**:
- Fetch available laboratory results
- Download PDFs automatically
- Store credentials locally (optional)
- Output as table or JSON
- Direct API communication (no intermediaries)

**Main Commands**:
- `misresultados config` - Save patient credentials
- `misresultados fetch` - List available results
- `misresultados download` - Download PDF files

**Dependencies**:
- `commander` - CLI framework
- `ora` - Spinner UI
- `picocolors` - Terminal colors
- `debug` - Debug logging

**Testing**: Vitest with unit and integration tests
**Package Manager**: pnpm@10.14.0

### Browser Extension (`extension/`)

A Firefox extension that auto-fills patient data on misresultados.com forms.

**Key Features**:
- Auto-fill last names and date of birth
- Storage of user preferences
- Visual indicators for auto-fill capability
- Support for both misresultados.com and e-labresults.com

**Architecture**:
- Manifest v3 WebExtension
- Content script injection on specific pages
- Browser storage API for preferences
- Bilingual support (Spanish/English)

## Development

### Prerequisites
- Node.js >= 18.0.0
- pnpm 10.14.0

### Getting Started

```bash
# Install dependencies for CLI
cd cli
pnpm install

# Install dependencies for extension
cd extension
pnpm install
```

### CLI Development

```bash
cd cli

# Run tests
pnpm test                # Run once
pnpm test:watch          # Watch mode
pnpm test:coverage       # With coverage

# Code formatting
pnpm format              # Format code
pnpm format:check        # Check formatting

# Run locally
pnpm start -- fetch --control 12345 --licencia 5678
```

### Extension Development

```bash
cd extension

# Lint extension
pnpm lint

# Build for distribution
pnpm build

# Run in Firefox
pnpm start               # Stable Firefox
pnpm start:dev           # Developer Edition

# Code formatting
pnpm format              # Format code
pnpm format:check        # Check formatting
```

## Architecture Notes

### CLI Architecture

**HTTP Client** (`http.js`):
- Handles all API communication with misresultados.com
- Manages authentication and session handling
- Cookie management for authenticated requests
- No external service communication (privacy-first)

**Service Layer** (`services.js`):
- `fetchResults()` - Retrieves available lab results
- `downloadPDFs()` - Downloads all available PDFs
- Session management and error handling

**Parser** (`parser.js`):
- Parses HTML responses from misresultados.com
- Extracts result metadata and download links
- No external dependencies for parsing

**Config** (`config.js`):
- Stores user preferences in `~/.misresultados-cli/config.json`
- Only stores locally (never transmitted)
- Optional - can use CLI without storing credentials

### Extension Architecture

**Content Script** (`content/autofill.js`):
- Runs on patient form pages only
- Detects compatible forms automatically
- Retrieves stored data from browser.storage
- Fills form fields and adds visual indicators

**Popup UI** (`popup/popup.js`):
- Settings interface for user data
- Saves to browser.storage.sync
- Simple, accessible form

## Security & Privacy

**Key Principles**:
1. **No data transmission to third parties** - Only communicates with misresultados.com
2. **Local storage only** - All data stays on user's machine
3. **Open source** - Fully auditable code
4. **No telemetry** - No usage tracking or analytics
5. **Minimal dependencies** - Reduces attack surface

**Data Storage**:
- CLI: `~/.misresultados-cli/config.json` (user's home directory)
- Extension: Browser's storage.sync API
- PDFs: User-specified output directory (default: `./resultados`)

## CI/CD

### Workflows

**CLI CI** (`.github/workflows/cli-ci.yml`):
- Runs on: Push to main, PRs
- Tests on Node 18.x, 20.x, 22.x
- Runs unit and integration tests
- Code coverage reporting

**Extension CI** (`.github/workflows/extension-ci.yml`):
- Runs on: Push to main, PRs
- Lints extension code
- Format checking

**Release** (`.github/workflows/release.yml`):
- Automated release workflow

## Testing

### CLI Tests
- **Unit tests**: Mock HTTP responses, test parsing logic
- **Integration tests**: Test HTTP client against mocked API
- **Coverage**: Tracked via codecov
- **Framework**: Vitest with nock for HTTP mocking

### Extension
- Manual testing in Firefox
- Linting via web-ext

## Common Tasks

### Adding a new CLI command
1. Add command definition in `cli/bin/resultados.js` using Commander
2. Implement logic in `cli/lib/services.js`
3. Add tests in `cli/tests/unit/` or `cli/tests/integration/`
4. Update README with new command usage

### Modifying API interactions
1. Update `cli/lib/http.js` for HTTP client changes
2. Update `cli/lib/parser.js` if response format changes
3. Update `cli/lib/constants.js` for URLs or constants
4. Add tests to verify behavior

### Extension modifications
1. Content script changes: `extension/content/autofill.js`
2. UI changes: `extension/popup/popup.html` and `popup.js`
3. Update manifest version if needed
4. Test in Firefox using `pnpm start`

## Important Files

- `cli/lib/services.js` - Core CLI business logic
- `cli/lib/http.js` - API communication layer
- `extension/content/autofill.js` - Form auto-fill logic
- `extension/manifest.json` - Extension configuration
- `.github/workflows/` - CI/CD pipelines

## Links

- **Repository**: https://github.com/rnegron/misresultados-tools
- **NPM Package**: https://www.npmjs.com/package/misresultados-cli
- **Issues**: https://github.com/rnegron/misresultados-tools/issues
- **Feedback**: Use GitHub issue template

## Notes for AI Assistants

- This is a **privacy-focused** project - never add telemetry, analytics, or external API calls
- All data must remain local (user's machine only)
- Prefer minimal dependencies
- Spanish is the primary language for user-facing content
- Tests are required for CLI changes
- Use pnpm (not npm or yarn)
- Code style enforced via Prettier
- The author built this as a learning project with Claude Code
