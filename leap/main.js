var leapjs = require('leapjs');
var fs = require('fs');
var websocket = require('ws');
var request = require('request');
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
var IFTTT_SECRET = config.ifttt_secret_key;
var DEVICE_ID = config.particle_device_id;
var ACCESS_TOKEN = config.particle_access_token;
var MODES = ['light','music','navigation'];
var currentMode = 'light';
var ifttt = new IFTTT(IFTTT_SECRET);
var in_trigger = false;

var args = process.argv;
var currentEnv = 'all';
if (MODES.indexOf(args[2]) !== -1) {
  currentEnv = args[2];
  currentMode = currentEnv;
}

console.log('Running with environment:', currentEnv);

// helper methods
var changeMode = function (mode) {
  if (currentEnv === 'all' || currentEnv === mode) {
    console.log('changing mode to', mode);
    currentMode = mode;
  }
};
var signalEvent = function (value, params) {
  if (in_trigger) return;
  in_trigger = true;

  if (MODES.indexOf(currentMode) == -1) {
    console.log('unrecognized mode, using default');
    currentMode = MODES[0];
  }
  console.log('event triggered:', value, 'for mode:', currentMode);

  var call = 'toggle_' + currentMode;
  var options = {};
  var postUrl;

  if (currentMode === 'light') {
    postUrl = 'https://api.particle.io/v1/devices/' + DEVICE_ID + '/' + call + 
              '?access_token=' + ACCESS_TOKEN
    options.form = { 'args': value };
  } else { // music or navigation
    if (currentMode === 'music') {
      call += '_' + value;
    }
    postUrl = 'https://maker.ifttt.com/trigger/' + call + '/with/key/' + 
               IFTTT_SECRET 
  }

  request.post(postUrl, options, function (error) {
    if (error) console.log(error);
    in_trigger = false;
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
  changeMode('light');
});

controller.on('screenTap', function (tap, frame) {
  changeMode('navigation');
});

controller.on('circle', function (tap, frame) {
  changeMode('music');
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

