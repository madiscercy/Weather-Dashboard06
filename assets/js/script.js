let buttonInfo = document.querySelector('.btn-info');
let longitude = 0;
let latitude = 0;

buttonInfo.addEventListener('click', function (event) {
    longitude = 0;
    latitude = 0;
    event.preventDefault();
    const cityName = document.getElementById('q').value;

    const urlCoords = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=c95faba63532c2d2027b22a1c108d7d3'

    fetch(urlCoords)
        .then((response) => response.json())
        .then((data) => extractCoordinates(data));
});

function extractCoordinates(cityCoords) {
    if (cityCoords && cityCoords.length > 0) {
        const cityCoordsObj = cityCoords[0];
        longitude = cityCoordsObj.lon;
        latitude = cityCoordsObj.lat;
    } else {
        console.log('nothing in here')
    }

}

