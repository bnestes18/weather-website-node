const request = require('postman-request');


const forecast = (lat, lon, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=db73977d9d7b31f7f22867385ce50814&query=' + lat + ',' + lon + '&units=f';

    request({ url, json: true }, (error, { body }) => {

        if (error) {
            callback('Unable to connect to weather service!', undefined);
        } else if (body.error) {
            callback('Please provide valid location coordinates', undefined);
        } else {
            const weather_description = body.current.weather_descriptions[0];
            const temperature = body.current.temperature;
            const humidity = body.current.humidity;

            callback(undefined, weather_description + '.' + ' It is ' + temperature + ' degrees out. It feels like ' + body.current.feelslike + ' degrees out. The humidity is ' + humidity + '%.');
        }
    })
}

module.exports = forecast;