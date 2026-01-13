# Configuration Strapi pour Mastered by Edouard

## Démarrage de Strapi

### 1. Lancer Strapi en mode développement

```bash
cd cms
npm run develop
```

Strapi va démarrer sur `http://localhost:1337`

### 2. Créer un compte administrateur

Lors du premier lancement, tu seras redirigé vers `http://localhost:1337/admin` pour créer ton compte admin.

Remplis les informations :
- Prénom
- Nom
- Email
- Mot de passe

## Configuration de la collection "Artists"

### 3. Créer la collection Artists

1. Dans le panel admin, va dans **Content-Type Builder** (icône cube dans le menu de gauche)
2. Clique sur **Create new collection type**
3. Nomme la collection : `artist` (Strapi mettra automatiquement au pluriel "artists")
4. Clique sur **Continue**

### 4. Ajouter les champs à la collection

Ajoute les champs suivants :

#### Champ 1 : Name
- Type : **Text**
- Name : `name`
- Type : **Short text**
- Clique sur **Add another field**

#### Champ 2 : Links
- Type : **Rich text (Blocks)** ou **JSON** (si tu veux stocker plusieurs liens)
- Name : `links`
- Pour simplifier, utilise **Text** (Long text) et stocke les liens séparés par des virgules ou retours à la ligne
- Clique sur **Add another field**

#### Champ 3 : Picture
- Type : **Media**
- Name : `picture`
- Type : **Single media**
- Allowed types : **Images** uniquement
- Clique sur **Finish**

5. Clique sur **Save** en haut à droite

Strapi va redémarrer le serveur automatiquement.

### 5. Configurer les permissions API (IMPORTANT)

Pour que Next.js puisse accéder aux données :

1. Va dans **Settings** (⚙️ en bas à gauche)
2. Sous **USERS & PERMISSIONS PLUGIN**, clique sur **Roles**
3. Clique sur **Public**
4. Scroll jusqu'à **Permissions**
5. Trouve **Artist** et coche :
   - ☑ `find` (liste tous les artists)
   - ☑ `findOne` (récupérer un artist spécifique)
6. Clique sur **Save** en haut à droite

### 6. Ajouter des artists de test

1. Va dans **Content Manager** (icône liste dans le menu)
2. Clique sur **Artist** dans la colonne de gauche
3. Clique sur **Create new entry**
4. Remplis :
   - Name : ex. "Booba"
   - Links : ex. "https://open.spotify.com/artist/xxx"
   - Picture : Upload une image
5. Clique sur **Save**
6. Clique sur **Publish** en haut à droite

Répète pour ajouter plusieurs artists.

## Test de l'API

Une fois configuré, tu peux tester l'API en allant sur :
```
http://localhost:1337/api/artists?populate=*
```

Tu devrais voir un JSON avec tes artists.

## Prochaines étapes

Maintenant que Strapi est configuré, nous allons :
1. Créer un service Next.js pour fetch les artists
2. Afficher les artists dans la page listen

## Scripts utiles

```bash
# Démarrer Strapi en dev
cd cms && npm run develop

# Démarrer Next.js (dans un autre terminal)
npm run dev

# Build Strapi pour production
cd cms && npm run build && npm run start
```

## Variables d'environnement

Crée un fichier `.env.local` à la racine du projet Next.js :

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=  # Optionnel pour les APIs privées
```
