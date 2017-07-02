// This module is responsible for capturing images

const config = require('config');
const PiCamera = require('pi-camera');
const myCamera = new PiCamera({
  mode: 'photo',
  output: process.argv[2],
  width: config.get('camera.photoWidth'),
  height: config.get('camera.photoHeight'),
  timeout: config.get('camera.photoTimeout'),
  timestamp: true,
  nopreview: true,
});

process.on('message', (message) => {
  if (message.cmd === 'set') {
    myCamera.config = Object.assign(myCamera.config, message.set);
  }
  else if (message.cmd === 'capture') {
    myCamera.snap()
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
