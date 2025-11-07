# MisResultados PWA

Progressive Web App for accessing medical laboratory results from misresultados.com on mobile devices.

## Features

- 📱 **Mobile-First Design**: Optimized for mobile browsers (Safari, Chrome)
- 🔒 **Privacy-First**: All data stored locally on your device
- 🌐 **Works Offline**: Patient information available offline
- 🌍 **Bilingual**: Spanish and English support
- ⚡ **Fast & Lightweight**: No heavy frameworks
- 📥 **Easy PDF Access**: View and download results directly

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Deployment

The PWA can be deployed to any static hosting service:

- **GitHub Pages** (Free)
- **Vercel** (Free)
- **Netlify** (Free)
- **Cloudflare Pages** (Free)

#### Deploy to GitHub Pages

```bash
# Build the project
pnpm build

# Deploy to GitHub Pages
# (Configure GitHub Pages to serve from /docs or use gh-pages branch)
```

#### Deploy to Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

## How It Works

### User Flow

1. **First Visit**
   - User visits PWA URL
   - Enters patient information (last names, birth date)
   - Information saved to browser's localStorage

2. **Fetching Results**
   - User receives email with lab results link
   - Opens PWA and enters control number + lab license
   - Or pastes the full email link
   - App fetches results from misresultados.com

3. **Viewing Results**
   - Results displayed in clean, mobile-friendly list
   - Tap to view PDF in new tab
   - Or download PDF to device

### Technical Architecture

```
pwa/
├── src/
│   ├── api/              # API client for misresultados.com
│   │   ├── client.js     # Fetch API client
│   │   ├── parser.js     # HTML parsing
│   │   └── constants.js  # URLs and patterns
│   ├── components/       # UI components
│   │   ├── ui.js         # UI utilities
│   │   └── i18n.js       # Internationalization
│   ├── storage/          # Local storage management
│   │   └── localStorage.js
│   ├── locales/          # Translations
│   │   ├── es.js         # Spanish
│   │   └── en.js         # English
│   ├── styles/           # CSS
│   │   └── main.css      # Main stylesheet
│   └── main.js           # Application entry point
├── public/
│   └── icons/            # PWA icons
├── index.html            # Main HTML file
└── vite.config.js        # Vite configuration
```

## Privacy & Security

- **Local Storage Only**: Patient information stored only in browser's localStorage
- **No Cloud Sync**: Data never leaves your device
- **No Third-Party APIs**: Only communicates with misresultados.com
- **Open Source**: Fully auditable code
- **HTTPS Required**: PWA must be served over HTTPS

## Browser Compatibility

- ✅ iOS Safari 12+
- ✅ Android Chrome 80+
- ✅ Desktop Chrome, Firefox, Edge, Safari

## PWA Features

- **Installable**: Add to home screen on mobile
- **Offline Ready**: Service worker caches app shell
- **App-Like**: Full-screen mode, splash screen
- **Fast**: Optimized for performance

## Development

### Code Style

This project uses Prettier for code formatting:

```bash
# Format code
pnpm format

# Check formatting
pnpm format:check
```

### Testing

Manual testing checklist:

- [ ] Patient setup form saves data
- [ ] Manual results fetch works
- [ ] Link parsing works
- [ ] Results display correctly
- [ ] PDF viewing works
- [ ] PDF downloading works
- [ ] Language toggle works
- [ ] Works offline (patient info accessible)
- [ ] Responsive on mobile
- [ ] Installable to home screen

## Known Limitations

- **CORS**: If misresultados.com changes their CORS policy, the app may break
- **Session Cookies**: Browser security may limit access to session cookies
- **PDF Downloads**: May open in new tab instead of downloading on iOS
- **Storage Limits**: Browser may clear localStorage under storage pressure

## Future Enhancements

- [ ] Dark mode
- [ ] Result history cache
- [ ] Multiple patient profiles
- [ ] Biometric authentication
- [ ] Push notifications (requires backend)
- [ ] Deep linking support

## License

MIT License - See [LICENSE](../LICENSE) for details

## Credits

Built with:
- [Vite](https://vitejs.dev/) - Build tool
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) - PWA plugin
- Vanilla JavaScript (no frameworks!)

Part of [MisResultados Tools](https://github.com/Boricua-Tools/resultados-medicos)
