const weather = require('openweathermap-js')

const Command = require('./Command')

module.exports = new Command({
    name: 'weather',
    command: getWeather
})

function getWeather(context, zip) {
    const { config, logger, message } = context 
    weather.defaults({
        appid: config.appid,
        ZIPcode: '02532,us',
        method: 'zip'
    })
}

