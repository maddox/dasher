var url = require('url')
var dashButton = require('node-dash-button');
var request = require('request')

function doLog(message) {
  console.log('[' + (new Date().toISOString()) + '] ' + message);
}

function DasherButton(button) {
  var options = {headers: button.headers, body: button.body, json: button.json, formData: button.formData}
  var debug = button.debug || false;
  this.dashButton = dashButton(button.address, button.interface, button.timeout, button.protocol)
  var buttonList = {};

  this.dashButton.on("detected", function() {
      
    if(!buttonList.hasOwnProperty(button.address)){
        buttonList[button.address] = 1;
    } else {
        buttonList[button.address]++;
    }
    doLog(button.name + " pressed. Count: " +  buttonList[button.address]);    
    if (debug){
      doLog("Debug mode, skipping request.");
      console.log(button);
    } else if (button.cmd != "") {
      doCommand(button.cmd, button.name)
    } else {
      doRequest(button.url, button.method, options)
    }
  })

  doLog(button.name + " added.")
}

function doCommand(command, name, callback) {

  const exec = require('child_process').exec;
  // Assuming that the button name is trusted as it comes from the config file
  // If it isn't true then need to do encoding here
  exec(command + " '" + name + "'", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }

    if (stderr != "") {
      // Stripping a training new line
      error = stderr.replace (/\s+$/g, "");
      doLog(`Command error: ${error}`);
    }
    // Stripping a training new line
    output = stdout.replace (/\s+$/g, "");
    doLog(`Command output: ${output}`);
  });

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
    headers: options.headers,
    formData: options.formData
  }

  request(reqOpts, function onResponse(error, response, body) {
    if (error) {
      doLog("there was an error");
      console.log(error);
    } else {
      if (response.statusCode === 401) {
        doLog("Not authenticated");
      }
      if (response.statusCode < 200 || response.statusCode > 299) {
        doLog("Unsuccessful status code");
      }
    }
    
    if (callback) {
      callback(error, response, body)
    }
  })
}

module.exports = DasherButton
