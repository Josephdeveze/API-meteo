const apiKey = 'da0778353e0ab00520d750bd21cd23b578d6f2af390c1a7b8af011a84852dbb8';
let useCelsius = true;
let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');

// Conversion de température
function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5/9;
}

function toggleUnit() {
  useCelsius = !useCelsius;
  updateTemperatureDisplay();
}

function updateTemperatureDisplay() {
  const currentTemp = document.getElementById('current-temp');
  const tempMin = document.getElementById('temperature-min');
  const tempMax = document.getElementById('temperature-max');
  
  if (currentTemp.dataset.celsius) {
    const celsius = parseFloat(currentTemp.dataset.celsius);
    const temp = useCelsius ? celsius : celsiusToFahrenheit(celsius);
    currentTemp.textContent = `${Math.round(temp)}°${useCelsius ? 'C' : 'F'}`;
  }

  if (tempMin.dataset.celsius) {
    const celsius = parseFloat(tempMin.dataset.celsius);
    const temp = useCelsius ? celsius : celsiusToFahrenheit(celsius);
    tempMin.textContent = `Min: ${Math.round(temp)}°${useCelsius ? 'C' : 'F'}`;
  }

  if (tempMax.dataset.celsius) {
    const celsius = parseFloat(tempMax.dataset.celsius);
    const temp = useCelsius ? celsius : celsiusToFahrenheit(celsius);
    tempMax.textContent = `Max: ${Math.round(temp)}°${useCelsius ? 'C' : 'F'}`;
  }
}

// Géolocalisation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const url = `https://api.meteo-concept.com/api/location/coordinates?token=${apiKey}&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
            if (data.city) {
              document.getElementById('insee-input').value = data.city.insee;
              getWeather();
            }
          })
          .catch(error => {
            console.error('Erreur lors de la géolocalisation:', error);
            showError('Erreur lors de la géolocalisation');
          });
      },
      error => {
        console.error('Erreur de géolocalisation:', error);
        showError('Erreur de géolocalisation');
      }
    );
  } else {
    showError('La géolocalisation n\'est pas supportée par votre navigateur');
  }
}

// Gestion de l'historique
function addToHistory(inseeCode) {
  if (!searchHistory.includes(inseeCode)) {
    searchHistory.unshift(inseeCode);
    if (searchHistory.length > 5) {
      searchHistory.pop();
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    updateHistoryList();
  }
}

function updateHistoryList() {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';
  searchHistory.forEach(insee => {
    const li = document.createElement('li');
    li.textContent = insee;
    li.onclick = () => {
      document.getElementById('insee-input').value = insee;
      getWeather();
    };
    historyList.appendChild(li);
  });
}

// Affichage des erreurs
function showError(message) {
  const weatherInfo = document.getElementById('weather-info');
  weatherInfo.innerHTML = `<div class="error">${message}</div>`;
}

// Mise à jour de l'icône météo
function updateWeatherIcon(weatherCode) {
  const iconElement = document.querySelector('.weather-icon i');
  // Correspondance des codes météo avec les icônes Font Awesome
  const weatherIcons = {
    0: 'sun',
    1: 'cloud-sun',
    2: 'cloud',
    3: 'cloud',
    4: 'cloud',
    5: 'cloud-sun',
    6: 'fog',
    7: 'cloud-rain',
    8: 'cloud-showers-heavy',
    9: 'cloud-bolt',
    10: 'snowflake',
    11: 'cloud-rain',
    12: 'cloud-showers-heavy',
    13: 'cloud-bolt',
    14: 'snowflake',
    15: 'smog'
  };
  
  const iconName = weatherIcons[weatherCode] || 'cloud';
  iconElement.className = `fas fa-${iconName}`;
}

// Fonction principale de récupération de la météo
function getWeather() {
  const inseeCode = document.getElementById('insee-input').value.trim();
  if (!inseeCode) {
    showError('Veuillez entrer un code INSEE');
    return;
  }

  const url = `https://api.meteo-concept.com/api/forecast/daily?token=${apiKey}&insee=${inseeCode}`;
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const forecast = data.forecast[0];
      const city = data.city;
      
      // Mise à jour des informations principales
      document.querySelector('.city').textContent = city.name;
      document.getElementById('weather-description').textContent = getWeatherDescription(forecast.weather);
      
      // Stockage et affichage des températures
      const currentTemp = document.getElementById('current-temp');
      currentTemp.dataset.celsius = forecast.temp2m;
      
      const tempMin = document.getElementById('temperature-min');
      tempMin.dataset.celsius = forecast.tmin;
      
      const tempMax = document.getElementById('temperature-max');
      tempMax.dataset.celsius = forecast.tmax;
      
      updateTemperatureDisplay();
      
      // Autres informations météo
      document.getElementById('probability-rain').textContent = `Pluie: ${forecast.probarain}%`;
      document.getElementById('wind-speed').textContent = `Vent: ${forecast.wind10m} km/h`;
      document.getElementById('humidity').textContent = `Humidité: ${forecast.rh2m}%`;
      
      // Mise à jour de l'icône
      updateWeatherIcon(forecast.weather);
      
      // Ajout à l'historique
      addToHistory(inseeCode);
      
      // Affichage des prévisions sur 5 jours
      updateForecast(data.forecast.slice(1, 6));
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données météo:', error);
      showError('Erreur lors de la récupération des données météo');
    });
}

// Mise à jour des prévisions sur 5 jours
function updateForecast(forecasts) {
  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = '';
  
  forecasts.forEach(day => {
    const forecastItem = document.createElement('div');
    forecastItem.className = 'forecast-item';
    
    const date = new Date();
    date.setDate(date.getDate() + forecasts.indexOf(day) + 1);
    
    forecastItem.innerHTML = `
      <div class="forecast-date">${date.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
      <i class="fas fa-${getWeatherIcon(day.weather)}"></i>
      <div class="forecast-temp">${Math.round(day.temp2m)}°C</div>
      <div class="forecast-rain">${day.probarain}%</div>
    `;
    
    forecastContainer.appendChild(forecastItem);
  });
}

// Fonction pour obtenir la description de la météo
function getWeatherDescription(code) {
  const descriptions = {
    0: 'Soleil',
    1: 'Peu nuageux',
    2: 'Ciel voilé',
    3: 'Nuageux',
    4: 'Très nuageux',
    5: 'Couvert',
    6: 'Brouillard',
    7: 'Pluie faible',
    8: 'Pluie',
    9: 'Orage',
    10: 'Neige',
    11: 'Pluie et neige',
    12: 'Pluie forte',
    13: 'Orage fort',
    14: 'Neige forte',
    15: 'Brouillard givrant'
  };
  return descriptions[code] || 'Météo inconnue';
}

// Fonction pour obtenir l'icône météo
function getWeatherIcon(code) {
  const icons = {
    0: 'sun',
    1: 'cloud-sun',
    2: 'cloud',
    3: 'cloud',
    4: 'cloud',
    5: 'cloud',
    6: 'fog',
    7: 'cloud-rain',
    8: 'cloud-showers-heavy',
    9: 'bolt',
    10: 'snowflake',
    11: 'cloud-rain',
    12: 'cloud-showers-heavy',
    13: 'bolt',
    14: 'snowflake',
    15: 'smog'
  };
  return icons[code] || 'cloud';
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  updateHistoryList();
  // Écouteur d'événements pour la touche Entrée
  document.getElementById('insee-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      getWeather();
    }
  });
});