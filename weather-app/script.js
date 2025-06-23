const apiKey = "cdd131fae455315375ea6d8a5183ecdc";

document.addEventListener("DOMContentLoaded", () => {
  getLocation(); // Auto-show weather on page load
});

function getWeather() {
  const city = document.getElementById("cityInput").value;
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(currentWeatherURL)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => displayWeather(data))
    .catch(error => {
      document.getElementById("weatherResult").innerHTML = `<p>${error.message}</p>`;
    });
}

function getWeatherByCoords(lat, lon) {
  const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(urlCurrent)
    .then(response => {
      if (!response.ok) throw new Error("Location not found");
      return response.json();
    })
    .then(data => displayWeather(data))
    .catch(error => {
      document.getElementById("weatherResult").innerHTML = `<p>${error.message}</p>`;
    });
}

function displayWeather(data) {
  const weather = data.weather[0].main.toLowerCase();
  const icon = data.weather[0].icon;
  const background = document.getElementById('background');

  // Animate weather
  showWeatherAnimation(weather);

  // Background
  background.className = "background";
  if (weather.includes("cloud")) background.classList.add("cloudy");
  else if (weather.includes("rain")) background.classList.add("rainy");
  else if (weather.includes("clear")) background.classList.add("clear");
  else if (weather.includes("sun")) background.classList.add("sunny");
  else background.classList.add("default");

  // Show current date
  const todayDate = new Date();
  const formattedDate = todayDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentWeatherHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>📅 ${formattedDate}</p>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
    <p><strong>${data.weather[0].main}</strong></p>
    <p>🌡 Temp: ${data.main.temp}°C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬 Wind: ${data.wind.speed} m/s</p>
  `;

  document.getElementById("weatherResult").innerHTML = currentWeatherHTML;
}

function showWeatherAnimation(weather) {
  const animDiv = document.getElementById('weatherAnimation');
  animDiv.innerHTML = ''; // Clear previous animation

  if (weather.includes("clear") || weather.includes("sun")) {
    const sun = document.createElement('div');
    sun.classList.add('sun');
    animDiv.appendChild(sun);
  } else if (weather.includes("cloud")) {
    const cloud = document.createElement('div');
    cloud.classList.add('cloud');
    animDiv.appendChild(cloud);
  } else if (weather.includes("rain")) {
    const cloud = document.createElement('div');
    cloud.classList.add('cloud');
    animDiv.appendChild(cloud);

    for (let i = 0; i < 3; i++) {
      const drop = document.createElement('div');
      drop.classList.add('raindrop');
      drop.style.left = `${30 + i * 20}%`;
      drop.style.animationDelay = `${i * 0.3}s`;
      animDiv.appendChild(drop);
    }
  }
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherByCoords(lat, lon);
    }, error => {
      alert('Could not get your location. Please allow location access or search manually.');
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}
