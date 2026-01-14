# Guide de Déploiement Strapi sur Render (GRATUIT)

## Prérequis
- Compte Render (gratuit) : https://render.com
- Code poussé sur GitHub (✅ Fait)

## Étapes de Déploiement Manuel (100% Gratuit)

### 1. Créer la Base de Données PostgreSQL

1. Va sur https://dashboard.render.com
2. Clique sur **"New +"** → **"PostgreSQL"**
3. Configure :
   - **Name** : `mastered-strapi-db`
   - **Database** : `strapi`
   - **User** : `strapi`
   - **Region** : Choisir la plus proche (ex: Frankfurt)
   - **PostgreSQL Version** : 16 (ou la plus récente)
   - **Plan** : Sélectionne **"Free"** ⚠️ Important !
4. Clique sur **"Create Database"**
5. ⏱️ Attends 2-3 minutes que la base soit créée
6. Une fois créée, va dans l'onglet **"Connect"** et **copie l'URL "Internal Database URL"** (commence par `postgresql://`)

### 2. Créer le Service Web Strapi

1. Sur le dashboard Render, clique sur **"New +"** → **"Web Service"**
2. Connecte ton compte GitHub si nécessaire
3. Sélectionne le repository **"martincavil/mastered-by-edouard"**
4. Configure le service :

**Basic Configuration:**
- **Name** : `mastered-strapi`
- **Region** : Même région que ta base de données
- **Branch** : `main`
- **Root Directory** : `cms`
- **Runtime** : `Node`

**Build & Deploy:**
- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm run start`

**Plan:**
- ⚠️ **Sélectionne "Free"** (pas Starter !)

5. **Ne clique pas encore sur "Create Web Service"** ! On doit d'abord configurer les variables d'environnement.

### 3. Configurer les Variables d'Environnement

Scroll vers le bas jusqu'à la section **"Environment Variables"**.

Clique sur **"Add Environment Variable"** et ajoute les variables suivantes :

#### Variables de Base de Données
```
NODE_ENV = production
DATABASE_CLIENT = postgres
DATABASE_URL = [Colle ici l'Internal Database URL de l'étape 1]
```

#### Variables de Sécurité (Secrets)
Pour chaque variable ci-dessous, **génère une valeur aléatoire** :
- Tu peux utiliser : https://generate-secret.vercel.app/32
- Ou en terminal : `openssl rand -base64 32`

```
APP_KEYS = [génère 2 clés séparées par une virgule : key1,key2]
API_TOKEN_SALT = [génère une clé aléatoire]
ADMIN_JWT_SECRET = [génère une clé aléatoire]
TRANSFER_TOKEN_SALT = [génère une clé aléatoire]
JWT_SECRET = [génère une clé aléatoire]
```

**Exemple de APP_KEYS** :
```
APP_KEYS = abc123def456ghi789jkl012mno345pqr,xyz789wvu654tsr321qpo098nml876kji
```

6. Une fois toutes les variables ajoutées, clique sur **"Create Web Service"**

### 4. Attendre le Déploiement

- Le premier déploiement prend environ **5-10 minutes**
- Tu peux suivre les logs en temps réel dans le dashboard Render
- Render va :
  1. Cloner ton repo GitHub
  2. Aller dans le dossier `cms/`
  3. Installer les dépendances npm
  4. Builder Strapi
  5. Lancer le serveur
  6. Se connecter à la base de données PostgreSQL

✅ Quand tu vois **"Live"** en vert, c'est prêt !

### 5. Récupérer l'URL de ton Strapi

En haut de la page de ton service, tu verras une URL comme :
```
https://mastered-strapi.onrender.com
```

L'admin panel sera accessible à :
```
https://mastered-strapi.onrender.com/admin
```

⚠️ **Important** : La première visite peut prendre 30 secondes (le serveur gratuit se réveille)

### 6. Créer le Compte Admin

1. Va sur l'URL admin de ton Strapi
2. Crée ton premier compte administrateur
3. ⚠️ **IMPORTANT** : Utilise un mot de passe fort !

### 7. Configurer les Permissions de l'API

1. Dans l'admin Strapi, va dans **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Active les permissions pour l'endpoint "Artist" :
   - ✅ `find` (pour lister les artistes)
   - ✅ `findOne` (pour récupérer un artiste)
3. Clique sur **"Save"**

⚠️ **Important** : Sans ces permissions, ton frontend ne pourra pas récupérer les artistes !

### 8. Mettre à Jour l'URL API dans le Frontend

Une fois ton Strapi déployé, tu devras mettre à jour l'URL de l'API dans ton frontend.

Le code est déjà prêt dans `/lib/strapi/api.ts` :
```typescript
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
```

**Sur Vercel** (ou ta plateforme de déploiement frontend) :

1. Va dans les Settings de ton projet
2. Section **Environment Variables**
3. Ajoute :
```
NEXT_PUBLIC_STRAPI_URL = https://mastered-strapi.onrender.com
```
4. Redéploie ton frontend

---

## 💰 Tarification - Plan GRATUIT

### Base de Données PostgreSQL (Free)
- ✅ **1 GB de stockage**
- ✅ Largement suffisant pour les URLs Dropbox
- ⚠️ Expire après **90 jours**
- Après 90 jours : tu devras recréer une nouvelle DB gratuite OU passer payant ($7/mois)

### Service Web (Free)
- ✅ **750 heures/mois** (suffisant pour un projet)
- ⚠️ Le serveur **se met en veille après 15 min d'inactivité**
- ⚠️ Premier démarrage : **~30 secondes**
- Pour éviter la mise en veille : upgrade vers plan payant ($7/mois)

### Uploads de Fichiers / Images
✅ **Tu utilises Dropbox** : Pas de problème !
- Les URLs Dropbox sont juste du texte stocké dans PostgreSQL
- Aucune limite de stockage côté Render
- Les images restent sur Dropbox (pas de perte lors des redéploiements)

---

## 📋 Récapitulatif Rapide

1. **Créer PostgreSQL** : New + → PostgreSQL → Plan "Free"
2. **Copier Database URL** : Onglet "Connect" → "Internal Database URL"
3. **Créer Web Service** : New + → Web Service → Repository GitHub
   - Root Directory: `cms`
   - Build: `npm install && npm run build`
   - Start: `npm run start`
   - Plan: **Free**
4. **Ajouter Variables d'Environnement** :
   - `DATABASE_URL`, `NODE_ENV`, `DATABASE_CLIENT`
   - Secrets : `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`
5. **Attendre 5-10 min** que ça déploie
6. **Créer compte admin** sur `/admin`
7. **Configurer permissions** pour Artists (find + findOne)
8. **Mettre à jour frontend** avec `NEXT_PUBLIC_STRAPI_URL`

---

## Troubleshooting

### Le build échoue
- Vérifie les logs dans le dashboard Render
- Assure-toi que toutes les dépendances sont dans `package.json`

### Impossible de se connecter à l'admin
- Vérifie que le service est bien "Live" (vert) dans Render
- Vérifie l'URL (doit finir par `/admin`)

### Les images ne s'affichent pas
- Vérifie les permissions dans Strapi (Settings → Users & Permissions)
- Vérifie que `NEXT_PUBLIC_STRAPI_URL` est correctement configuré dans Vercel

## Support

Si tu rencontres des problèmes :
1. Consulte les logs Render
2. Vérifie la documentation Strapi : https://docs.strapi.io/
3. Vérifie la documentation Render : https://docs.render.com/
