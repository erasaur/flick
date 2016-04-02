var leapjs = require('leapjs');
var fs = require('fs');
var websocket = require('ws');
var request = require('request');

// load leap motion
var controller = new leapjs.Controller({
  host: '127.0.0.1',
  port: 6437,
  enableGestures: true,
  background: true
});

// load initial config
var config = JSON.parse(fs.readFileSync('private.json', 'utf8'));
var DEVICE_ID = config.particle_device_id;
var ACCESS_TOKEN = config.particle_access_token;
var MODES = ['light','music'];
var currentMode = 'light';

// helper methods
var signalEvent = function (value, params) {
  if (MODES.indexOf(currentMode) == -1) {
    console.log('unrecognized mode, using default');
    currentMode = MODES[0];
  }
  console.log('event triggered:', value, 'for mode:', currentMode);

  var call = 'toggle_' + currentMode;
  var postUrl = 'https://api.particle.io/v1/devices/' + DEVICE_ID + '/' + call + 
                '?access_token=' + ACCESS_TOKEN
  var options = { form: { 'args': value } };
  request.post(postUrl, options, function (error) {
    if (error) console.log(error);
  });
};

// listen to motion events
controller.on('connect', function () {
  console.log('connected.');
});

// emit gesture events for convenience
controller.on('gesture', function (gesture, frame) {
  controller.emit(gesture.type, gesture, frame);
});

controller.on('keyTap', function (tap, frame) {
  console.log('changing mode to light');
  currentMode = 'light';
});

controller.on('circle', function (tap, frame) {
  console.log('changing mode to music');
  currentMode = 'music';
});

controller.on('swipe', function (swipe, frame) {
  var dir = swipe.direction; // [ x, y, z ]

  // swiping left, signal ON
  if (dir[0] < -0.8) {
    signalEvent('on');
  } 
  // swiping right, signal OFF
  else if (dir[0] > 0.8) {
    signalEvent('off');
  }
});

controller.on('streamingStarted', function() {
  console.log('streaming data now.');
});

controller.on('streamingStopped', function() {
  console.log('stopped streaming data.');
});

controller.connect();

