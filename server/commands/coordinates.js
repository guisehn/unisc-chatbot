'use strict'

const request = require('superagent')
require('superagent-as-promised')(request)

module.exports = (address) => {
  let encodedAddress = encodeURIComponent(address)

  return request
    .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`)
    .then(response => {
      let result = JSON.parse(response.text).results[0]

      if (!result) return 'Address not found'

      return `Latitude: ${result.geometry.location.lat}` +
        `\nLongitude: ${result.geometry.location.lng}`
    })
    .catch(() => 'Error querying the Google Server')
}
