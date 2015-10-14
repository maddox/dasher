var DasherButton = require('./lib/dasher')
var config = require('./config/config.json')

var buttons = []

for (var i = 0; i < config.buttons.length; i++) {
  button = config.buttons[i]
  buttons.push(new DasherButton(button))
}
