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

### 3. Générer un refresh token (recommandé)

Pour une application en production, il est recommandé d'utiliser un refresh token qui ne expire pas et permet de générer automatiquement de nouveaux access tokens.

1. Allez dans l'onglet "Settings"
2. Notez votre **App key** et **App secret**
3. Activez "Access token expiration" si ce n'est pas déjà fait
4. Construisez l'URL d'autorisation suivante (remplacez `YOUR_APP_KEY` par votre App key) :
   ```
   https://www.dropbox.com/oauth2/authorize?client_id=YOUR_APP_KEY&token_access_type=offline&response_type=code
   ```
5. Visitez cette URL dans votre navigateur et autorisez l'application
6. Vous serez redirigé vers une page avec un code d'autorisation, copiez-le
7. Utilisez ce code pour obtenir un refresh token en exécutant cette commande curl (remplacez les valeurs) :
   ```bash
   curl https://api.dropbox.com/oauth2/token \
     -d code=YOUR_AUTHORIZATION_CODE \
     -d grant_type=authorization_code \
     -u YOUR_APP_KEY:YOUR_APP_SECRET
   ```
8. La réponse contiendra un `refresh_token` - conservez-le précieusement !

**Alternative : Générer un access token simple (expirera)**

1. Allez dans l'onglet "Settings"
2. Descendez jusqu'à "OAuth 2"
3. Sous "Generated access token", cliquez sur "Generate"
4. Copiez le token généré

**⚠️ Important**: Les access tokens simples expirent. Pour la production, utilisez un refresh token.

## Configuration de l'environnement

### Fichier `.env.local`

Créez un fichier `.env.local` à la racine du projet et ajoutez :

**Option 1 : Avec refresh token (recommandé pour production)**

```env
# Dropbox Refresh Token Configuration
DROPBOX_APP_KEY=your_app_key_here
DROPBOX_APP_SECRET=your_app_secret_here
DROPBOX_REFRESH_TOKEN=your_refresh_token_here

# Email configuration (optionnel pour les notifications)
RESEND_API_KEY=your_resend_api_key
RESEND_TO_EMAIL=contact@masteredbyedouard.com
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**Option 2 : Avec access token simple (développement uniquement)**

```env
# Dropbox Access Token (expirera)
DROPBOX_ACCESS_TOKEN=your_access_token_here

# Email configuration (optionnel pour les notifications)
RESEND_API_KEY=your_resend_api_key
RESEND_TO_EMAIL=contact@masteredbyedouard.com
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**Note** : Le système utilisera automatiquement le refresh token s'il est disponible, sinon il utilisera l'access token statique en fallback.

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

### Gestion automatique des tokens

L'application gère automatiquement le rafraîchissement des tokens expirés :

1. Si `DROPBOX_REFRESH_TOKEN` est configuré, il sera utilisé pour générer automatiquement de nouveaux access tokens
2. Les tokens sont mis en cache et rafraîchis 5 minutes avant leur expiration
3. Si le refresh échoue, le système bascule automatiquement sur `DROPBOX_ACCESS_TOKEN` (si disponible)

### Que faire si vous avez l'erreur "expired_access_token"

Si vous voyez cette erreur, cela signifie que votre access token a expiré. Deux solutions :

1. **Solution recommandée** : Configurez un refresh token (voir section "Générer un refresh token" ci-dessus)
2. **Solution temporaire** : Générez un nouveau access token simple (mais il expirera à nouveau)

## Support

Pour toute question sur l'intégration Dropbox, consultez :
- [Documentation officielle Dropbox](https://www.dropbox.com/developers/documentation)
- [Upload API Reference](https://www.dropbox.com/developers/documentation/http/documentation#files-upload)
