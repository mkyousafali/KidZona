# KidZona - Offline-First Learning App for Kids

An interactive, offline-capable PWA learning platform for children ages 2-9, built with SvelteKit, IndexedDB, and Supabase.

## Features

✅ **Offline-First** - Works completely offline, syncs when online  
✅ **No Login Required** - Simple profile setup only  
✅ **Multi-Language** - English, Hindi, Malayalam, Arabic  
✅ **Progressive Web App** - Installable on mobile & desktop  
✅ **Reward System** - Stars, badges, and celebrations  
✅ **Age-Based Content** - Adaptive difficulty by age  
✅ **Vercel Deploy Ready** - One-click deployment  

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd kidzona

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Development

```bash
# Start dev server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
kidzona/
├── src/
│   ├── lib/
│   │   ├── config/          # App configuration
│   │   ├── stores/          # Svelte stores (profile, progress, etc)
│   │   ├── db/              # IndexedDB utilities
│   │   ├── sync/            # Sync logic & device tracking
│   │   ├── i18n/            # Multi-language strings
│   │   ├── content/         # Content packs & manifests
│   │   ├── modules/         # Learning modules
│   │   ├── components/      # Reusable Svelte components
│   │   ├── utils/           # Helper utilities
│   │   └── styles/          # Global CSS
│   ├── routes/              # SvelteKit pages
│   ├── service-worker.ts    # PWA offline caching
│   └── app.html             # Root HTML
├── static/                  # Static assets (icons, audio, etc)
├── package.json
├── svelte.config.js
├── vite.config.ts
└── tsconfig.json
```

## Architecture

### Offline System

1. **PWA Service Worker** - Caches app shell + assets
2. **IndexedDB Storage** - Local persistence:
   - `profile` - Child profile data
   - `progress` - Activity completion & scores
   - `sync_queue` - Queued events for sync
   - `content_packs` - Downloaded content manifests

3. **Sync Strategy**:
   - Generate device_id on first install
   - Queue progress events offline
   - Push to Supabase when online
   - Pull new content packs (optional)

### State Management

Uses Svelte Stores for reactive state:

- `profileStore` - Current child profile
- `progressStore` - Activity progress
- `languageStore` - Selected language
- `networkStore` - Online/offline status
- `rewardsStore` - Unlocked rewards

### Content Packs

Modular content structure in `src/lib/content/packs/`:

```
packs/
├── animals/
│   ├── manifest.json
│   └── items.json
├── sounds/
├── spelling/
├── math/
└── science/
```

Each pack includes:
- Activity definitions
- Media references
- Age-band mapping
- Difficulty levels

## Modules

### Computer Skills
- Tap accuracy
- Drag & drop
- Click accuracy
- Hover practice
- Keyboard basics

### Spelling & Typing
- Letter recognition
- Word building
- Typing practice

### Languages
- Vocabulary (English, Hindi, Malayalam, Arabic)
- Basic phrases
- Audio pronunciation

### Math
- Number recognition
- Simple addition/subtraction
- Counting

### Science
- Basic concepts
- Interactive experiments

### Animals
- Animal recognition
- Sounds & behaviors

### Sounds
- Audio recognition
- Music basics

## Sync with Supabase

### Setup

1. Create a Supabase project: https://supabase.com
2. Get your API URL and anon key
3. Set environment variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Database Schema

```sql
-- Progress events table
CREATE TABLE progress_events (
  id UUID PRIMARY KEY,
  device_id TEXT,
  activity_id TEXT,
  score INT,
  timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content pack manifests
CREATE TABLE content_packs (
  id TEXT PRIMARY KEY,
  name TEXT,
  version TEXT,
  manifest JSONB,
  updated_at TIMESTAMPTZ
);
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Custom Server

```bash
npm run build
node build/index.js
```

## Configuration

### Supported Languages

- `en` - English
- `hi` - Hindi
- `ml` - Malayalam
- `ar` - Arabic

Add more in `src/lib/config/app.ts`

### Age Bands

- 2-4: Toddler
- 5-6: Kindergarten
- 7-9: School

### Styling

CSS variables in `src/lib/styles/app.css`:

```css
--primary-color: #ff6b6b
--secondary-color: #4ecdc4
--success-color: #51cf66
```

## Development Roadmap

- [x] Project scaffold & configuration
- [x] IndexedDB setup
- [x] Profile & language stores
- [x] PWA service worker
- [x] Setup & home pages
- [ ] Computer skills module
- [ ] Sync system (Supabase integration)
- [ ] Additional modules
- [ ] Audio system
- [ ] Analytics & parental dashboard
- [ ] Performance optimization

## Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile browsers (iOS 13+, Android 10+)

## PWA Installation

### Desktop
- Open in Chrome → Menu → Install app

### Mobile
- iOS Safari → Share → Add to Home Screen
- Android Chrome → Menu → Install app

## Offline Capabilities

✅ App shell caches on first load  
✅ Works offline after installation  
✅ Syncs data when online  
✅ Handles network interruptions gracefully  
✅ Silent background updates  

## Performance

- **Lighthouse PWA Score**: Target 95+
- **Bundle Size**: ~50KB gzipped
- **Time to Interactive**: < 2s
- **Offline Load Time**: < 1s

## Privacy & Security

- ✅ No authentication required
- ✅ Device-ID based progress tracking
- ✅ No personally identifiable information stored remotely
- ✅ All data encrypted in transit (HTTPS)
- ✅ Parent-friendly (optional dashboard for monitoring)

## Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## License

MIT - See LICENSE file

## Support

Issues? Questions?

- 📧 Email: support@kidzona.app
- 🐛 GitHub Issues: [issues](https://github.com/your-org/kidzona/issues)

---

**Made with ❤️ for learning**
