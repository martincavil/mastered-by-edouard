# Changelog - MasteredByEdouard

## 2025-01-12 - i18n sans URLs localisées + Downgrade Tailwind v3

### 🌍 Changement majeur : i18n sans `/fr` ni `/en`

Le système de langue a été complètement restructuré :

**Avant :**
- URLs : `/fr`, `/en`, `/fr/listen`, `/en/studio`
- Navigation par middleware + redirections
- Segment dynamique `[lang]`

**Maintenant :**
- URLs : `/`, `/listen`, `/studio`, `/contact` (pas de langue dans l'URL)
- Changement de langue instantané via React Context
- Cookie persistant pour mémoriser la préférence
- Auto-détection de la langue du navigateur

**Fichiers créés :**
- `lib/i18n/LanguageProvider.tsx` - Context React pour la langue
- `lib/i18n/useTranslations.tsx` - Hook pour les traductions
- `I18N-WITHOUT-URL.md` - Documentation complète

**Fichiers supprimés :**
- `middleware.ts` - Plus de redirections nécessaires
- `app/[lang]/` - Structure avec segment dynamique

**Pages migrées vers Client Components :**
- `app/page.tsx`
- `app/listen/page.tsx`
- `app/send-files/page.tsx`
- `app/studio/page.tsx`
- `app/contact/page.tsx`

### 🎨 Downgrade : Tailwind v4 → v3

Tailwind v4 (beta) avait des problèmes de compatibilité avec Next.js 16.

**Actions :**
- Désinstallé `tailwindcss@^4` et `@tailwindcss/postcss`
- Installé `tailwindcss@^3`, `postcss`, `autoprefixer`
- Recréé `tailwind.config.ts` (syntaxe v3)
- Mis à jour `postcss.config.js` (config standard)
- Corrigé `app/globals.css` (syntaxe v3)

**Résultat :** Toutes les utilities Tailwind fonctionnent maintenant (padding, margin, spacing, etc.)

## 2025-01-12 - Configuration Tailwind v4 + Fonts + Couleurs

### ✅ Corrections

- **Tailwind CSS v4** : Migration vers la nouvelle syntaxe `@import "tailwindcss"` et `@theme`
- **PostCSS** : Configuration correcte avec `@tailwindcss/postcss`
- **Framer Motion** : Ajout de la dépendance manquante

### 🎨 Design System

#### Couleurs
- `white` : #FFFFFF
- `black` : #161616
- `red` : #E20600
- `red-dark` : #710600

Utilisation dans Tailwind :
```tsx
className="bg-red text-white"
className="bg-black text-white"
className="text-black/70"  // black avec 70% opacity
```

#### Fonts
- **Platform** : Font pour les titres/headings
  - Regular (400)
  - Medium (500)
  - Bold (700)

- **Poppins** : Font par défaut pour le body
  - Regular (400)
  - Medium (500)
  - SemiBold (600)
  - Bold (700)

Utilisation :
```tsx
className="font-platform"  // Platform font
className="font-poppins"   // Poppins font (default)
```

### 📁 Fichiers modifiés

- `app/globals.css` - Migration Tailwind v4 + fonts + couleurs
- `app/[lang]/layout.tsx` - Suppression config Inter
- `app/[lang]/page.tsx` - Nouvelles couleurs
- `app/[lang]/listen/page.tsx` - Nouvelles couleurs
- `app/[lang]/send-files/page.tsx` - Nouvelles couleurs
- `app/[lang]/studio/page.tsx` - Nouvelles couleurs
- `app/[lang]/contact/page.tsx` - Nouvelles couleurs
- `components/language-switcher.tsx` - Nouvelles couleurs
- `package.json` - Ajout framer-motion

### 📁 Fichiers supprimés

- `tailwind.config.ts` - Plus nécessaire avec Tailwind v4

### 📁 Nouveaux fichiers

- `public/fonts/` - Dossier pour fonts locales
- `public/fonts/README.md` - Instructions fonts
- `FONTS-SETUP.md` - Guide de setup des fonts
- `CHANGELOG.md` - Ce fichier

### 📋 Todo

1. **Copier les fonts** dans `public/fonts/` (voir `FONTS-SETUP.md`)
   - Platform-Regular.ttf
   - Platform-Medium.ttf
   - Platform-Bold.ttf
   - Poppins-Regular.ttf
   - Poppins-Medium.ttf
   - Poppins-SemiBold.ttf
   - Poppins-Bold.ttf

2. **Tester** : `npm run dev` et vérifier que tout fonctionne

### 🚀 Prochaines étapes

- Intégrer le design complet
- Ajouter les composants UI
- Configurer Strapi CMS
- Déployer sur Vercel
