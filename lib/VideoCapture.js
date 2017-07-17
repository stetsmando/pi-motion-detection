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

process.on('message', (messageFromParent) => {
  setTimeout(() => {
    myCamera.record()
      .then((message) => {
        process.send('Video capture was successful');

        process.send({
          result: 'success',
          message,
          error: null,
        });
      })
      .catch((error) => {
        process.send('Video capture failed');

        process.send({
          result: 'failure',
          message: null,
          error,
        });
      });
  }, 500);
});
