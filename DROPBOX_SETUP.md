# Configuration Dropbox pour l'upload de fichiers

Ce document explique comment configurer l'intégration Dropbox pour permettre l'upload de fichiers de plusieurs gigaoctets.

## Obtenir un Dropbox Access Token

### 1. Créer une application Dropbox

1. Allez sur https://www.dropbox.com/developers/apps
2. Cliquez sur "Create app"
3. Choisissez les options suivantes :
   - **Choose an API**: Scoped access
   - **Choose the type of access**: Full Dropbox (ou App folder si vous voulez limiter l'accès)
   - **Name your app**: Donnez un nom à votre application (ex: "Mastered by Edouard Upload")
4. Cliquez sur "Create app"

### 2. Configurer les permissions

1. Dans l'onglet "Permissions", activez les permissions suivantes :
   - `files.metadata.write`
   - `files.metadata.read`
   - `files.content.write`
   - `files.content.read`
2. Cliquez sur "Submit" en bas de la page

### 3. Générer un access token

1. Allez dans l'onglet "Settings"
2. Descendez jusqu'à "OAuth 2"
3. Sous "Generated access token", cliquez sur "Generate"
4. Copiez le token généré

**⚠️ Important**: Ce token ne sera affiché qu'une seule fois. Conservez-le en lieu sûr.

## Configuration de l'environnement

### Fichier `.env.local`

Créez un fichier `.env.local` à la racine du projet et ajoutez :

```env
# Dropbox Access Token
DROPBOX_ACCESS_TOKEN=your_access_token_here

# Email configuration (optionnel pour les notifications)
RESEND_API_KEY=your_resend_api_key
RESEND_TO_EMAIL=contact@masteredbyedouard.com
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### Vérification

Pour vérifier que l'intégration fonctionne :

1. Démarrez le serveur de développement : `npm run dev`
2. Allez sur `/send-files`
3. Sélectionnez l'onglet "audio files"
4. Testez l'upload d'un fichier

## Fonctionnalités

### Upload en chunks

- **Taille des chunks**: 8 MB
- **Fichiers supportés**: .wav, .aif
- **Taille maximale**: Illimitée (théoriquement)
- **Barre de progression**: Oui, pour chaque fichier

### Organisation des fichiers

Les fichiers uploadés sont organisés dans Dropbox comme suit :

```
/01_uploads/
  └── artistname-timestamp/
      ├── fichier1.wav
      ├── fichier2.wav
      └── ...
```

## Architecture technique

### Frontend (`AudioFiles.tsx`)

- Découpe les fichiers en chunks de 8MB
- Envoie chaque chunk séquentiellement
- Affiche la progression en temps réel
- Gère les erreurs pour chaque fichier

### Backend (`/api/upload-chunked/route.ts`)

- **POST avec action "start"**: Initialise une session d'upload Dropbox
- **POST avec FormData**: Envoie un chunk (append ou finish)
- Maintient les sessions d'upload en mémoire
- Nettoie automatiquement les sessions terminées

### API Dropbox utilisée

1. `files/create_folder_v2` : Crée le dossier de destination
2. `files/upload_session/start` : Commence une session d'upload
3. `files/upload_session/append_v2` : Ajoute des chunks
4. `files/upload_session/finish` : Finalise l'upload

## Limitations et notes

### Production

En production, il est recommandé de :

- Utiliser Redis ou une base de données pour stocker les sessions d'upload (au lieu de la mémoire)
- Implémenter un système de nettoyage des sessions expirées
- Ajouter une authentification pour l'API
- Monitorer les uploads et ajouter des logs

### Tokens expirés

Les access tokens générés manuellement n'expirent pas, mais pour une application en production, il est recommandé d'implémenter OAuth 2.0 avec refresh tokens.

## Support

Pour toute question sur l'intégration Dropbox, consultez :
- [Documentation officielle Dropbox](https://www.dropbox.com/developers/documentation)
- [Upload API Reference](https://www.dropbox.com/developers/documentation/http/documentation#files-upload)
