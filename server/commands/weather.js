'use strict'

const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY

const request = require('superagent')
require('superagent-as-promised')(request)

module.exports = (location) => {
  let encodedLocation = encodeURIComponent(location)

  return request
    .get('http://api.openweathermap.org/data/2.5/forecast?mode=json&units=metric' +
      `&q=${encodedLocation}&appid=${apiKey}`)
    .then(response => {
      let result = JSON.parse(response.text)
      let lastDate = ''
      let lines = []

      lines.push(`Showing weather for ${result.city.name} (${result.city.country})`)

      result.list.forEach(item => {
        let date = item.dt_txt.split(' ')[0]

        if (date !== lastDate) lines.push('')
        lastDate = date

        lines.push(`${item.dt_txt}` +
          `\tmin: ${item.main.temp_min} ºC` +
          `\tmax: ${item.main.temp_max} ºC` +
          `\t\t${item.weather[0].description}`)
      })

      return lines.join('\n')
    })
    .catch(() => 'Error querying the Open Weather Map API')
}
