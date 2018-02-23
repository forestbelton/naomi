const weather = require('openweathermap-js')

const Command = require('./Command')

module.exports = new Command({
    name: 'weather',
    command: getWeather
})

function getWeather(context, zip) {
    const { config, message } = context

    weather.defaults({
        appid: config.appid,
        ZIPcode: '02532,us',
        method: 'zip'
    })

    weather.current({ method: 'zip', ZIPcode: zip, units: 'imperial' }, function(err, data) {
        message.reply('the current weather for ' + data.name + ' is ' + data.weather[0].description + ', :thermometer: temperature is ' + data.main.temp + ' degrees. :droplet: humidity ' + data.main.humidity + '%, :wind_blowing_face: wind speed: ' + data.wind.speed + ' mph.')
    })
}

