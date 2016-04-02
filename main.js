var fs = require('fs');
var websocket = require ('ws');

// connect to leap motion
var ws = new websocket('ws://127.0.0.1:6437');

// load initial config
var config = JSON.parse(fs.readFileSync('private.json', 'utf8'));
var SECRET_KEY = config.ifttt_secret_key;
console.log(SECRET_KEY);

// load ifttt
var ifttt = require('node-ifttt-maker')(SECRET_KEY);

// listen to motion events
ws.on('message', function(data, flags) {
  console.log(data);

  // if data represents hand flick,
  // ifttt.request({ 
  //   event: 'hand_flick', 
  //   method: 'GET', 
  //   ... 
  // }, function (error) {
  //   if (error) console.log(error);
  // })
});
