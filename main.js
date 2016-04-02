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
  var dir = swipe.direction; // [ x, y, z ]

  // swiping left, signal ON
  if (dir[0] < -0.8) {
    signalEvent('swipe_up');
  } 
  // swiping right, signal OFF
  else if (dir[0] > 0.8) {
    signalEvent('swipe_down');
  }
});

controller.on('streamingStarted', function() {
  console.log('streaming data now.');
});

controller.on('streamingStopped', function() {
  console.log('stopped streaming data.');
});

controller.connect();

