const weather = require('openweathermap-js')

const Command = require('./Command')

module.exports = new Command({
	name: 'weather',
	command: getWeather
})

function getWeather(context, zip) {
	const { logger, message } = context 
	weather.defaults({
		appid: '6382f16f08da7243484a4041a62ce7da',
		ZIPcode: '02532,us',
		method: 'zip'
	})

	weather.current({ method: 'zip', ZIPcode: zip, units: 'imperial' }, function(err, data) {
		if (err) {
			logger.error(err.toString())
		} else {
			console.log(data)
			message.reply('The current weather for ' + data.name + ', ' + data.weather[0].description + ', temperature is ' + data.main.temp + ' degrees. Humidity ' + data.main.humidity + ', wind speed: ' + data.wind.speed + ' mph.')
		}
	})
}

