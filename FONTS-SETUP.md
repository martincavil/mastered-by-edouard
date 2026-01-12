# Setup des Fonts Locales

## Fichiers requis

Tu as besoin des fichiers `.ttf` suivants dans `public/fonts/` :

### Platform
- Platform-Regular.ttf
- Platform-Medium.ttf
- Platform-Bold.ttf

### Poppins
- Poppins-Regular.ttf
- Poppins-Medium.ttf
- Poppins-SemiBold.ttf
- Poppins-Bold.ttf

## Comment copier tes fonts depuis ton Mac

### Option 1 : Copier depuis Font Book

1. Ouvre **Font Book** (Livre des polices)
2. Cherche "Platform" et "Poppins"
3. Clic droit sur chaque font → **Afficher dans le Finder**
4. Copie les fichiers `.ttf` dans `public/fonts/`

### Option 2 : Chercher dans ~/Library/Fonts

```bash
# Chercher les fonts Platform
find ~/Library/Fonts -name "Platform*.ttf"

# Chercher les fonts Poppins
find ~/Library/Fonts -name "Poppins*.ttf"

# Copier toutes les fonts nécessaires
cp ~/Library/Fonts/Platform-*.ttf public/fonts/
cp ~/Library/Fonts/Poppins-Regular.ttf public/fonts/
cp ~/Library/Fonts/Poppins-Medium.ttf public/fonts/
cp ~/Library/Fonts/Poppins-SemiBold.ttf public/fonts/
cp ~/Library/Fonts/Poppins-Bold.ttf public/fonts/
```

### Option 3 : Chercher dans /Library/Fonts (fonts système)

```bash
# Chercher dans les fonts système
find /Library/Fonts -name "Platform*.ttf"
find /Library/Fonts -name "Poppins*.ttf"
```

## Vérifier que tout fonctionne

Après avoir copié les fonts :

```bash
# Liste les fonts présentes
ls -la public/fonts/

# Redémarre le serveur
npm run dev
```

Les fonts devraient maintenant être chargées !

## Utilisation dans le code

```tsx
// Heading avec Platform
<h1 className="font-platform">Mon Titre</h1>

// Body avec Poppins (par défaut)
<p>Mon texte</p>

// Explicit Poppins
<p className="font-poppins">Mon texte</p>
```

## Troubleshooting

Si les fonts ne se chargent pas :

1. Vérifie que les fichiers existent : `ls public/fonts/`
2. Vérifie les noms exacts des fichiers (sensible à la casse)
3. Vérifie la console du navigateur pour les erreurs de chargement
4. Hard refresh : `Cmd + Shift + R`
