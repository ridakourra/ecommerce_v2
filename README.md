# 🌌 Galaxy Market

**Galaxy Market** est une application e-commerce moderne développée avec **Laravel 12**, **React.js** et **Inertia.js**. Elle fournit une API performante ainsi qu'une interface utilisateur dynamique en Single Page Application (SPA).

## ⚙️ Technologies

- Laravel 12 (Backend)
- React.js (Frontend)
- Inertia.js (Navigation SPA)
- MySQL (Base de données)

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- PHP >= 8.2
- Composer
- Node.js & NPM
- MySQL
- Laravel CLI (optionnel)

## 🚀 Installation

Suivez les étapes ci-dessous pour configurer le projet localement :

```bash
# Cloner le dépôt
git clone https://github.com/ridakourra/ecommerce_v2.git

# Accéder au dossier du projet
cd ecommerce_v2

# Installer les dépendances PHP
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé de l'application
php artisan key:generate
```

### Configuration de la base de données

⚠️ Avant d'exécuter les migrations :

1. Vérifiez que la base de données dans `.env` n'existe pas déjà
2. Si elle existe, vous devez :
    - La supprimer via phpMyAdmin
    - Ou modifier `DB_DATABASE` dans `.env`

```bash
# Lancer les migrations
php artisan migrate

# (Optionnel) Ajouter des données fictives
php artisan db:seed

# Installer les dépendances JavaScript
npm install
```

## 🛠️ Lancement du projet

### Option 1 : Artisan + NPM
```bash
php artisan serve
npm run dev
```

### Option 2 : Script Composer
```bash
composer run dev
```

## 🌐 Accès

L'application est accessible sur : http://localhost:8000

## 📁 Structure du projet

- `resources/js` : Composants React
- `routes/web.php` : Routes front-end
- `app/Http/Controllers` : Logique serveur
- `app/Models` : Modèles Eloquent
