
const apiKey = 'c95faba63532c2d2027b22a1c108d7d3';
let forecastData = [];
const weatherIndex = [0, 4, 12, 20, 28, 36];
let buttonInfo = document.querySelector('.btn-info');
let longitude = 0;
let latitude = 0;


buttonInfo.addEventListener('click', function (event) {
    event.preventDefault();
    const cityName = document.getElementById('q').value;
    getWeather(cityName);
});

async function getWeather(cityName) {
    longitude = 0;
    latitude = 0;
    forecastData = [];

    const urlCoords = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + apiKey;
    await fetch(urlCoords)
        .then((response) => response.json())
        .then((data) => extractCoordinates(data));

    const urlWeather = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey;

    await fetch(urlWeather)
        .then((response) => response.json())
        .then((data) => extractWeatherData(data));
    
    displayWeatherData();
}


function extractCoordinates(cityCoords) {
    if (cityCoords && cityCoords.length > 0) {
        const cityCoordsObj = cityCoords[0];
        longitude = cityCoordsObj.lon;
        latitude = cityCoordsObj.lat;
    } else {
        console.log('nothing in here')
    }

}

function extractWeatherData(weatherData) {
    const weatherDataList = weatherData.list;
    const iconBaseUrl = 'https://openweathermap.org/img/wn/';
    console.log(weatherData);
    for (let i = 0; i < weatherIndex.length; i++) {
        const weatherListInd = weatherIndex[i];
        const  weatherObj = {
            cityName: weatherData.city.name,
            temp: weatherDataList[weatherListInd].main.temp,
            wind: weatherDataList[weatherListInd].wind.speed,
            humidity: weatherDataList[weatherListInd].main.humidity,
            iconUrl: iconBaseUrl + weatherDataList[weatherListInd].weather[0].icon + '.png',
            iconAltText: weatherDataList[weatherListInd].weather[0].description,
            date: formatDate(weatherDataList[weatherListInd].dt_txt)
        }
        
        forecastData.push(weatherObj)
    }
    console.log(forecastData)
}

function displayWeatherData() {
    displayCurrentDayData();

}

function displayCurrentDayData() {
    const cityNameEl = document.querySelector('.city-name');
    const weatherImgEl = document.querySelector('.weather-img');
    const currentWindEl = document.querySelector('.current-wind');
    const currentTempEl = document.querySelector('.current-temp');
    const currentHumidityEl = document.querySelector('.current-humidity');
    
    const currentDayData = forecastData[0];
    console.log(currentDayData);
    cityNameEl.textContent = currentDayData.cityName + ' ' + currentDayData.date;
    weatherImgEl.src = currentDayData.iconUrl;
    weatherImgEl.alt = currentDayData.iconAltText;
    currentWindEl.textContent = 'Wind: ' + currentDayData.wind + ' MPH';
    currentTempEl.textContent = 'Temp: ' + currentDayData.temp + '°F';
    currentHumidityEl.textContent = 'Humidity: ' + currentDayData.humidity + '%';
}

function formatDate(unformattedDate) {
    const month = unformattedDate.slice(5,7);
    const day = unformattedDate.slice(8,10);
    const year = unformattedDate.slice(0,4);
    const formattedDate = month + '/' + day + '/' + year;
    return formattedDate
}