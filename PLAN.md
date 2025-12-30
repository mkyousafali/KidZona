# KidZona - Product & Technical Plan

## Product Overview

**KidZona** is an offline-first, PWA learning app for kids (ages 2–9).

### Core Goals
- ✅ Works fully offline after initial install
- ✅ No login required
- ✅ Child profile: name + birth date + avatar
- ✅ Learning modules: Computer Skills, Spelling/Typing, Languages, Math, Science, Animals, Sounds
- ✅ Reward system: stars, badges, celebrations
- ✅ Device-first sync to Supabase when online
- ✅ Auto-deploy to Vercel with silent PWA updates

---

## UX Flow

### First Run
**Create Profile → Home**

### Home Screen
- **"Continue"** button (age-based next activity)
- **Module Tiles:**
  - Computer Skills
  - Spelling & Typing
  - Languages (4+ languages)
  - Math Operations
  - Science Basics
  - Animals
  - Sounds

### Module Experience
- Short, bite-sized activities
- Instant visual feedback
- Reward celebrations (stars, badges)
- Age-appropriate content progression

---

## Technical Architecture

### Offline System (Must-Have)

#### PWA & Caching
- **Service Worker** caches app shell + content packs
- Silent background updates
- Vercel auto-deployment

#### Local Storage (IndexedDB)
```
- profile              (child name, birthdate, avatar, language)
- progress             (activity completion, scores, timestamps)
- content_packs        (manifests + asset references)
- sync_queue           (queued events when offline)
```

### Online Sync (When Available)

#### Device Identification
- Generate and persist `device_id` locally
- Used for multi-device sync tracking

#### Sync Strategy
1. **Queue offline events** to sync_queue (IndexedDB)
2. **When online:**
   - Push queued progress events to Supabase
   - Pull new content pack manifests (optional)
   - Update local packs
3. **Conflict resolution:** Latest timestamp wins

#### Supabase Backend
- Store progress events (device_id, user_id, activity_id, score, timestamp)
- Serve content pack manifests
- Analytics & optional parental dashboard

---

## Folder Structure

```
kidzona/
├─ package.json
├─ svelte.config.js
├─ vite.config.ts
├─ static/
│  ├─ icons/
│  │  ├─ icon-192.png
│  │  ├─ icon-512.png
│  ├─ audio/                    # bundled starter audio (small)
│  ├─ images/
│  ├─ manifest.webmanifest
│  ├─ robots.txt
│  └─ offline.html
├─ src/
│  ├─ app.html
│  ├─ app.d.ts
│  ├─ hooks.client.ts           # online/offline listeners, update prompts
│  ├─ lib/
│  │  ├─ config/
│  │  │  ├─ app.ts              # app name, supported languages, age bands
│  │  │  ├─ routes.ts
│  │  │  └─ supabase.ts         # supabase URL + anon key (env-based)
│  │  ├─ stores/
│  │  │  ├─ profile.store.ts
│  │  │  ├─ progress.store.ts
│  │  │  ├─ language.store.ts
│  │  │  ├─ network.store.ts     # online/offline state
│  │  │  └─ rewards.store.ts
│  │  ├─ db/
│  │  │  ├─ indexeddb.ts         # IDB init + helpers
│  │  │  ├─ tables.ts            # profile, progress, queue, packs
│  │  │  └─ migrate.ts           # schema versioning for IDB
│  │  ├─ sync/
│  │  │  ├─ device.ts            # create/load device_id
│  │  │  ├─ queue.ts             # enqueue progress events
│  │  │  ├─ sync.ts              # push/pull logic
│  │  │  └─ conflicts.ts         # "latest timestamp wins"
│  │  ├─ i18n/
│  │  │  ├─ index.ts             # language switch logic
│  │  │  ├─ en.json
│  │  │  ├─ hi.json
│  │  │  ├─ ml.json
│  │  │  └─ ar.json
│  │  ├─ content/
│  │  │  ├─ packs/
│  │  │  │  ├─ animals/
│  │  │  │  │  ├─ manifest.json
│  │  │  │  │  └─ items.json
│  │  │  │  ├─ sounds/
│  │  │  │  ├─ spelling/
│  │  │  │  ├─ math/
│  │  │  │  └─ science/
│  │  │  ├─ loader.ts            # load packs from cache/IDB
│  │  │  └─ age-map.ts           # map content by age band
│  │  ├─ modules/
│  │  │  ├─ computer/
│  │  │  │  ├─ activities/
│  │  │  │  │  ├─ tap-accuracy.ts
│  │  │  │  │  ├─ drag-drop.ts
│  │  │  │  │  ├─ click-accuracy.ts
│  │  │  │  │  ├─ hover-practice.ts
│  │  │  │  │  └─ keyboard-basics.ts
│  │  │  │  ├─ screens/
│  │  │  │  │  ├─ ComputerHome.svelte
│  │  │  │  │  └─ ActivityPlayer.svelte
│  │  │  │  └─ index.ts
│  │  │  ├─ spelling/
│  │  │  ├─ languages/
│  │  │  ├─ math/
│  │  │  ├─ science/
│  │  │  ├─ animals/
│  │  │  └─ sounds/
│  │  ├─ components/
│  │  │  ├─ ui/
│  │  │  │  ├─ BigTile.svelte
│  │  │  │  ├─ PrimaryButton.svelte
│  │  │  │  ├─ Modal.svelte
│  │  │  │  ├─ ProgressStars.svelte
│  │  │  │  └─ BadgeShelf.svelte
│  │  │  ├─ audio/
│  │  │  │  ├─ VoicePlayer.svelte
│  │  │  │  └─ useVoice.ts
│  │  │  ├─ avatar/
│  │  │  │  ├─ AvatarPicker.svelte
│  │  │  │  └─ avatars.ts
│  │  │  └─ layout/
│  │  │     ├─ TopBar.svelte
│  │  │     └─ SafeArea.svelte
│  │  ├─ utils/
│  │  │  ├─ age.ts               # age band calculation
│  │  │  ├─ sound.ts             # sfx helpers
│  │  │  ├─ haptics.ts           # optional (mobile)
│  │  │  ├─ ids.ts               # uuid helpers
│  │  │  └─ time.ts
│  │  └─ styles/
│  │     ├─ app.css
│  │     └─ fonts.css
│  ├─ routes/
│  │  ├─ +layout.svelte
│  │  ├─ +layout.ts              # preload profile, language, packs
│  │  ├─ +page.svelte            # entry -> redirect setup/home
│  │  ├─ setup/
│  │  │  └─ +page.svelte         # name + birthdate + avatar
│  │  ├─ home/
│  │  │  └─ +page.svelte         # tiles + continue
│  │  ├─ rewards/
│  │  │  └─ +page.svelte         # badges/stars overview (kid-friendly)
│  │  ├─ module/
│  │  │  └─ [name]/
│  │  │     └─ +page.svelte      # module hub
│  │  └─ play/
│  │     └─ [activityId]/
│  │        └─ +page.svelte      # generic activity runner
│  └─ service-worker.ts          # PWA caching rules
├─ .env.example
└─ README.md
```

---

## Quick Mapping

| Layer | Location |
|-------|----------|
| **Activities** | `src/lib/modules/*/activities/` |
| **Shared UI Components** | `src/lib/components/` |
| **Offline Storage** | `src/lib/db/` |
| **Sync Logic** | `src/lib/sync/` |
| **Content Packs** | `src/lib/content/packs/` (cached in IDB) |
| **PWA Caching** | `src/service-worker.ts` |
| **Routes & Pages** | `src/routes/` |
| **Stores & State** | `src/lib/stores/` |
| **Config** | `src/lib/config/` |
| **i18n** | `src/lib/i18n/` |

---

## Implementation Roadmap

### Phase 1: Foundation
- [ ] SvelteKit project setup
- [ ] IndexedDB schema & helpers
- [ ] Device ID generation & storage
- [ ] Network state monitoring
- [ ] Profile store (Svelte stores)

### Phase 2: Offline PWA
- [ ] Service worker setup
- [ ] App shell caching
- [ ] Offline fallback page
- [ ] IndexedDB initialization

### Phase 3: Core UI
- [ ] Setup page (profile creation)
- [ ] Home page (tiles + continue)
- [ ] Basic navigation layout
- [ ] Avatar picker component

### Phase 4: First Module (Computer Skills)
- [ ] Activity definitions
- [ ] Tap accuracy activity
- [ ] Drag-drop activity
- [ ] Progress tracking
- [ ] Reward system (basic)

### Phase 5: Content System
- [ ] Content pack structure
- [ ] Loader logic
- [ ] Age-based content mapping
- [ ] Pack caching in IDB

### Phase 6: Sync System
- [ ] Sync queue (offline events)
- [ ] Supabase integration
- [ ] Push/pull logic
- [ ] Conflict resolution
- [ ] Update notifications

### Phase 7: Additional Modules
- [ ] Spelling & Typing
- [ ] Languages (multi-language support)
- [ ] Math operations
- [ ] Science
- [ ] Animals
- [ ] Sounds

### Phase 8: Polish & Deploy
- [ ] Audio system (voice, SFX)
- [ ] Haptics feedback
- [ ] Vercel deployment setup
- [ ] PWA manifest tuning
- [ ] Performance optimization

---

## Technology Stack

- **Framework:** SvelteKit
- **PWA:** Service Workers + Web App Manifest
- **Database:** IndexedDB (client-side)
- **Backend:** Supabase (Firebase alternative)
- **Deployment:** Vercel
- **State:** Svelte Stores
- **Build:** Vite

---

## Environment Variables

```
# .env.local / .env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyxxx...
```

---

## Notes

- **No login needed:** Device ID is sufficient for tracking
- **Content packs:** Downloaded/cached on-demand, bundled with app for offline starter content
- **Audio files:** Keep initial pack small (< 5MB), more available for download
- **Haptics:** Optional for touch devices (iOS/Android)
- **Accessibility:** Kid-friendly UI, large touch targets, high contrast
- **Privacy:** No personal data sent to cloud except device-anonymized progress

