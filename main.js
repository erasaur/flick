var leapjs = require('leapjs');
var fs = require('fs');
var websocket = require('ws');
var IFTTT = require('node-ifttt-maker');

// load leap motion
var controller = new leapjs.Controller({
  host: '127.0.0.1',
  port: 6437,
  enableGestures: true,
  background: true
});

// load initial config
var config = JSON.parse(fs.readFileSync('private.json', 'utf8'));
var SECRET_KEY = config.ifttt_secret_key;
console.log(SECRET_KEY);

// load ifttt
var ifttt = new IFTTT(SECRET_KEY);

// helper methods
var signalEvent = function (type, params) {
  console.log('event triggered: ', type);
  // var options = { event: type, method: 'GET' };
  // if (typeof params !== 'undefined') {
  //   options.params = params;
  // }
  // ifttt.request(options, function (error) {
  //   if (error) console.log(error);
  // });
};

// listen to motion events
controller.on('connect', function () {
  console.log('connected.');
});

// emit gesture events for convenience
controller.on('gesture', function (gesture, frame) {
  controller.emit(gesture.type, gesture, frame);
});

controller.on('swipe', function (swipe, frame) {
  if (swipe.state === 'stop') {
    var dir = swipe.direction;

    // swiping up, signal ON
    if (dir[1] > 0.8) {
      signalEvent('swipe_up');
    } 
    // swiping down, signal OFF
    else if (dir[1] < -0.8) {
      signalEvent('swipe_down');
    }
  }
});

controller.on('deviceConnected', function() {
  console.log('leap device connected.');
});

controller.on('deviceDisconnected', function() {
  console.log('leap device disconnected.');
});

controller.connect();

