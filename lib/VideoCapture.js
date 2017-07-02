// This module is responsible for capturing videos

'use strict';

const config = require('config');
const PiCamera = require('pi-camera');
const myCamera = new PiCamera({
  mode: 'video',
  output: process.argv[2],
  width: config.get('camera.videoWidth'),
  height: config.get('camera.videoHeight'),
  timeout: config.get('camera.videoTimeout'),
  nopreview: true,
});

process.on('message', (message) => {
  if (message.cmd === 'set') {
    myCamera.config = Object.assign(myCamera.config, message.set);
  }
  else if (message.cmd === 'capture') {
    myCamera.record()
      .then((result) => process.send({
        response: 'success',
        result,
        error: null,
      }))
      .catch((error) => process.send({
        response: 'failure',
        error,
      }));
  }
});
