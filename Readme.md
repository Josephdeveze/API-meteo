# Application Météo

Une application web moderne qui permet de consulter la météo en France en utilisant l'API Météo Concept.

## Fonctionnalités

- 🔍 Recherche par code INSEE
- 📍 Géolocalisation automatique
- 🌡️ Affichage des températures en °C et °F
- 🌤️ Prévisions sur 5 jours
- 📊 Informations détaillées:
  - Température actuelle, minimale et maximale
  - Probabilité de pluie
  - Vitesse du vent
  - Taux d'humidité 
- 📝 Historique des 5 dernières recherches
- 🎨 Interface responsive et moderne

## Technologies Utilisées

- HTML5
- CSS3 (avec variables CSS et Flexbox/Grid)
- JavaScript (Vanilla)
- Font Awesome pour les icônes
- API Météo Concept

## Installation

1. Clonez ce repository
2. Remplacez la clé API dans `meteo.js`:
```javascript
const apiKey = 'VOTRE_CLE_API';
```
3. Ouvrez `index.html` dans votre navigateur

## Structure du Projet

```
├── index.html      # Structure HTML de l'application
├── styles.css      # Styles et mise en page
├── meteo.js        # Logique JavaScript
├── background.jpg  # Image d'arrière-plan
└── README.md       # Documentation
```

## Configuration de l'API

L'application utilise l'API Météo Concept. Pour utiliser l'application, vous devez:
1. Créer un compte sur [Météo Concept](https://api.meteo-concept.com/)
2. Obtenir une clé API
3. Remplacer la clé API dans le fichier `meteo.js`

## Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## License

MIT License