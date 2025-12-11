# Vectory AI - Implementation & Architecture Guide

## 1. Project Structure
The project is organized as a **Next.js** application wrapped in **Electron**.
```
Vectory-Ai/
├── electron/
│   ├── main.ts              # Electron Main Process (Deep Linking, Window Management)
│   ├── preload.ts           # Preload Script (IPC Bridge)
│   └── tsconfig.json        # TypeScript config for Electron
├── src/
│   ├── app/
│   │   ├── page.tsx         # Main Dashboard (Drag & Drop, Vectorizer)
│   │   ├── admin/           # Protected Admin Route
│   │   ├── pricing/         # License Redemption Page
│   │   ├── layout.tsx       # Root Layout
│   │   └── globals.css      # Tailwind & Global Styles
│   ├── components/
│   │   ├── AuthProvider.tsx # Auth Context & Deep Link Handler
│   │   ├── Header.tsx       # Navigation & Credit Display
│   │   └── VectorizeComponent.tsx # Core Logic
│   └── lib/
│       └── firebase.ts      # Firebase Initialization
├── firestore.rules          # Firestore Security Rules
├── package.json             # Dependencies & Electron Builder Config
├── next.config.mjs          # Next.js Config (Export Mode)
└── tailwind.config.ts       # Styling Config
```

## 2. Configuration Details

### Electron Builder
Configuration is embedded in `package.json` under the `"build"` key.
- **AppId**: `com.vectoryai.app`
- **Output**: Generates installers in `dist/`
- **Resources**: Copies `dist-electron` (Main process compilation) and `out` (Next.js static export).

### Next.js for Electron
We use `output: 'export'` in `next.config.mjs`. This generates a static HTML/CSS/JS site in the `out/` folder, which Electron loads via `file://` protocol. 
*Note: We cannot use Next.js API Routes / SSR in this mode. All backend logic uses Firebase directly.*

## 3. Deep Linking & Authentication
**Problem**: Google Auth doesn't work well in Electron WebViews (security restriction).
**Solution**: Open System Browser -> Login -> Redirect back to App.

**Flow:**
1. User clicks "Sign In" in App.
2. `AuthProvider` opens `https://your-auth-portal.vercel.app/login` in Chrome/Edge.
3. User logs in with Google on that website.
4. Website generates a Firebase Custom Token.
5. Website redirects to `vectory://login?token=CUSTOM_TOKEN`.
6. Electron `main.ts` catches `vectory://`.
7. `main.ts` sends token to Renderer via IPC `deep-link`.
8. `AuthProvider` receives token and calls `signInWithCustomToken`.

## 4. Feature Implementation

### Credit System
- **Storage**: `users` collection in Firestore.
- **Logic**: 
    - Deduct 1 credit on "Download" click.
    - Check `credits > 0` before allowing download.
    - New users get 5 credits automatically via `AuthProvider` logic.

### Admin & Licensing
- **Hardcoded Admin**: In `Header.tsx`, `ADMIN_UID` controls access to `/admin`.
- **License Keys**: Stored in `license_keys` collection.
- **Redemption**: User enters key -> Transaction runs -> Checks validity -> Updates `used` status -> Increments User Credits.

## 5. Development Workflow
To run the app locally:
```bash
npm run dev
```
This runs `next dev` (web view on localhost:3000) AND `electron .` concurrently.
*Note: In `main.ts`, `isDev` flag switches loading URL between localhost and built files.*

## 6. Building for Production
```bash
npm run build
```
1. Builds Next.js (`npm run build`).
2. Compiles Electron TS (`tsc -p electron`).
3. Packages app with `electron-builder`.
