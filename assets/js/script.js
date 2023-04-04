
const apiKey = 'c95faba63532c2d2027b22a1c108d7d3';
let forecastData = [];
let buttonInfo = document.querySelector('.btn-info');
let longitude = 0;
let latitude = 0;
let isSearching = false;
const cityNamesKey = 'cityNames'
const citySearchEl = document.querySelector('.city-searches')
const weeklyWeatherEl = document.querySelector('.weekly-weather')
const weatherInfoEl = document.querySelector('.weather-info');

buttonInfo.addEventListener('click', function (event) {
    event.preventDefault();
    const cityName = document.getElementById('q').value;
    saveCityName(cityName);
    clearWeatherData();
    getWeather(cityName);
});

async function getWeather(cityName) {
    if (!isSearching) {
        isSearching = true;
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
        isSearching = false;
    }
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
    let previousDate = '';
    for (let i = 0; i < weatherDataList.length; i++) {
        const currentDate = formatDate(weatherDataList[i].dt_txt);
        if (previousDate !== currentDate) {
            let index = i;
            if (index !== 0 && index + 4 <= 40) {
                index = index + 4;
            }
            const weatherObj = {
                cityName: weatherData.city.name,
                temp: weatherDataList[index].main.temp,
                wind: weatherDataList[index].wind.speed,
                humidity: weatherDataList[index].main.humidity,
                iconUrl: iconBaseUrl + weatherDataList[index].weather[0].icon + '.png',
                iconAltText: weatherDataList[index].weather[0].description,
                date: currentDate
            }
            forecastData.push(weatherObj);
            previousDate = currentDate;
        }

    }
    console.log(forecastData)
}

function displayWeatherData() {
    weatherInfoEl.classList.remove('hide');
    weatherInfoEl.classList.add('show');
    displayCurrentDayData();
    displayWeeklyData();
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

function displayWeeklyData() {
    for (let i = 1; i < forecastData.length; i++) {
        const dailyData = forecastData[i];
        const forecastEl = document.createElement('div');
        forecastEl.classList.add('col-md-2');
        console.log(forecastEl.textContent);
        const headerEl = document.createElement('h3');
        const imageEl = document.createElement('img');
        const tempEl = document.createElement('p');
        const windEl = document.createElement('p');
        const humidityEl = document.createElement('p');
        headerEl.textContent = dailyData.date;
        forecastEl.appendChild(headerEl);
        imageEl.src = dailyData.iconUrl;
        imageEl.alt = dailyData.iconAltText;
        forecastEl.appendChild(imageEl);
        windEl.textContent = 'Wind: ' + dailyData.wind + ' MPH';
        forecastEl.appendChild(windEl);
        tempEl.textContent = 'Temp: ' + dailyData.temp + '°F';
        forecastEl.appendChild(tempEl);
        humidityEl.textContent = 'Humidity: ' + dailyData.humidity + '%';
        forecastEl.appendChild(humidityEl);
        weeklyWeatherEl.appendChild(forecastEl);
    }
}

function clearWeatherData() {
    weatherInfoEl.classList.remove('show');
    weatherInfoEl.classList.add('hide');
    while (weeklyWeatherEl.firstChild) {
        weeklyWeatherEl.removeChild(weeklyWeatherEl.firstChild);
    }
}



function formatDate(unformattedDate) {
    const month = unformattedDate.slice(5, 7);
    const day = unformattedDate.slice(8, 10);
    const year = unformattedDate.slice(0, 4);
    const formattedDate = month + '/' + day + '/' + year;
    return formattedDate
}

function saveCityName(cityName) {

    let localCityNames = localStorage.getItem(cityNamesKey);

    if (localCityNames) {
        let localCityNamesArray = JSON.parse(localCityNames);
        if (localCityNamesArray.includes(cityName) == false) {
            localCityNamesArray.push(cityName);
            localStorage.setItem(cityNamesKey, JSON.stringify(localCityNamesArray));
        }
    } else {
        let localCityNamesArray = [];
        localCityNamesArray.push(cityName);
        localStorage.setItem(cityNamesKey, JSON.stringify(localCityNamesArray));
    }
    console.log(cityName);
    clearCityButtons();
    displayCityNames();
}

function displayCityNames() {
    let localCityNames = JSON.parse(localStorage.getItem(cityNamesKey));
    if (localCityNames && localCityNames.length > 0) {
        for (let i = 0; i < localCityNames.length; i++) {
            const cityName = localCityNames[i];
            let buttonEl = document.createElement('a');
            buttonEl.textContent = cityName;
            buttonEl.classList.add('btn', 'btn-secondary', 'w-100', 'mt-3');
            buttonEl.addEventListener('click', function (event) {
                clearWeatherData();
                getWeather(cityName);
            });
            citySearchEl.appendChild(buttonEl);
        }
    }
}

function clearCityButtons() {
    while (citySearchEl.firstChild) {
        citySearchEl.removeChild(citySearchEl.firstChild);
    }
}


displayCityNames();