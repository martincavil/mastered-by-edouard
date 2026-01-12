# Système i18n sans URLs localisées

## ✅ Changement effectué

Le système de langue a été restructuré pour fonctionner **sans `/fr` ni `/en` dans les URLs**.

### URLs avant

```
/fr              → Page d'accueil française
/en              → Page d'accueil anglaise
/fr/listen       → Page Listen en français
/en/studio       → Page Studio en anglais
```

### URLs maintenant

```
/                → Page d'accueil (langue selon préférence)
/listen          → Page Listen (langue selon préférence)
/studio          → Page Studio (langue selon préférence)
/contact         → Page Contact (langue selon préférence)
```

## 🔧 Comment ça fonctionne

### 1. Détection automatique de la langue

Au premier chargement, le système détecte la langue via :

1. **Cookie `NEXT_LOCALE`** (si existe)
2. **Langue du navigateur** (`navigator.language`)
3. **Fallback** : Français (par défaut)

### 2. Changement de langue

Le bouton FR/EN change la langue **instantanément** :
- Change le contenu affiché
- Sauvegarde dans un cookie
- Pas de rechargement de page
- Pas de changement d'URL

### 3. Persistance

La langue choisie est sauvegardée dans un cookie valide **1 an**.

Au prochain visit, le site s'affiche directement dans la langue préférée.

## 📁 Architecture technique

### Nouveaux fichiers

```
lib/i18n/
  ├── LanguageProvider.tsx    # Context React pour la langue
  └── useTranslations.tsx     # Hook pour utiliser les traductions
```

### Structure des pages

```
app/
  ├── layout.tsx              # Root layout avec LanguageProvider
  ├── page.tsx                # Home
  ├── listen/page.tsx         # Listen
  ├── send-files/page.tsx     # Send Files
  ├── studio/page.tsx         # Studio
  └── contact/page.tsx        # Contact
```

**Toutes les pages sont des Client Components** (`'use client'`)

### Fichiers supprimés

- ❌ `middleware.ts` (plus besoin de redirection)
- ❌ `app/[lang]/` (structure avec segment dynamique)

## 💻 Usage dans le code

### Utiliser les traductions

```tsx
'use client';

import { useTranslations } from '@/lib/i18n/useTranslations';

export default function MyPage() {
  const t = useTranslations();

  return (
    <h1>{t.home.title}</h1>
  );
}
```

### Changer la langue

```tsx
'use client';

import { useLanguage } from '@/lib/i18n/LanguageProvider';

export default function MyComponent() {
  const { locale, setLocale } = useLanguage();

  return (
    <button onClick={() => setLocale('fr')}>
      Français
    </button>
  );
}
```

### Language Switcher

Le composant `<LanguageSwitcher />` est déjà prêt :

```tsx
import { LanguageSwitcher } from '@/components/language-switcher';

// Dans votre page
<LanguageSwitcher />
```

## 🎯 Avantages

✅ **URLs propres** : Pas de `/fr` ou `/en` visible
✅ **Expérience fluide** : Changement instantané sans reload
✅ **SEO simplifié** : Une seule URL par page
✅ **Cookie persistant** : Mémorisation de la préférence
✅ **Auto-détection** : Langue du navigateur au premier visit

## ⚠️ Limitations

❌ **SEO multilingue** : Pas de balises `hreflang` automatiques
❌ **URLs partagées** : Un lien partagé n'inclut pas la langue
❌ **Indexation** : Les moteurs voient une seule version (français par défaut)

Si le SEO multilingue est critique, il faudrait revenir aux URLs localisées (`/fr`, `/en`).

## 🚀 Déploiement

Aucun changement nécessaire pour Vercel :
- Pas de configuration de routes i18n
- Pas de redirections
- Fonctionne comme une SPA classique

## 🧪 Test

```bash
npm run dev
```

Visite http://localhost:3000 :
- Le site s'affiche en français (ou selon ta langue navigateur)
- Clique sur EN → contenu change en anglais
- Recharge la page → reste en anglais
- Ferme/rouvre le navigateur → encore en anglais (cookie)

Tout fonctionne sans `/fr` ni `/en` dans l'URL ! 🎉
