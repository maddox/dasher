var url = require('url')
var dashButton = require('node-dash-button');
var request = require('request')

function DasherButton(button) {
  var options = {headers: button.headers, body: button.body, json: button.json}

  this.dashButton = dashButton(button.address, button.interface)

  this.dashButton.on("detected", function() {
    console.log(button.name + " pressed.")
    doRequest(button.url, button.method, options)
  })

  console.log(button.name + " added.")
}

function doRequest(requestUrl, method, options, callback) {
  options = options || {}
  options.query = options.query || {}
  options.json = options.json || false
  options.headers = options.headers || {}

  var reqOpts = {
    url: url.parse(requestUrl),
    method: method || 'GET',
    qs: options.query,
    body: options.body,
    json: options.json,
    headers: options.headers
  }

  request(reqOpts, function onResponse(error, response, body) {
    if (error) {
      console.log("there was an error");
      console.log(error);
    }
    if (response.statusCode === 401) {
      console.log("Not authenticated");
      console.log(error);
    }
    if (response.statusCode !== 200) {
      console.log("Not a 200");
      console.log(error);
    }

    if (callback) {
      callback(error, response, body)
    }
  })
}

module.exports = DasherButton
