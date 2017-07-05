'use strict';

const EventEmitter = require('events');
const { fork } = require('child_process');
const path = require('path');
const fs = require('fs');

class MotionDetectionModule extends EventEmitter {
  constructor(options) {
    super();
    this.config = Object.assign({
      captureDirectory: null, // Directory to store tmp photos and video captures
      continueAfterMotion: false, // Flag to control if motion detection will continue after detection
      captureVideoOnMotion: false, // Flag to control video capture on motion detection
      continueToCapture: true, // Flag to control internal state of photo capture
    }, options);

    // Verify and create (if needed) capture directories
    captureDirsCheck(this.config.captureDirectory);
  }

  watch() {
    const self = this;
    const imageCaptureChild = fork(path.resolve(__dirname, 'lib', 'ImageCapture.js'), [ path.resolve(self.config.captureDirectory, 'images', '%d.jpg') ]);
    const imageCompareChild = fork(path.resolve(__dirname, 'lib', 'ImageCompare.js'), [ path.resolve(self.config.captureDirectory, 'images') ]);
    const videoCaptureChild = fork(path.resolve(__dirname, 'lib', 'VideoCapture.js'), [ path.resolve(self.config.captureDirectory, 'videos', 'video.h264') ]);
    const videoRenameChild = fork(path.resolve(__dirname, 'lib', 'VideoRename.js'), [ path.resolve(self.config.captureDirectory, 'videos') ]);

    imageCaptureChild.on('message', (message) => {
      if (message.error) {
        self.emit('error', message.error);
      }
      else if (message.response === 'success' && self.config.continueToCapture) {
        imageCaptureChild.send({ cmd: 'capture' });
      }
    });

    imageCompareChild.on('message', (message) => {
      if (message.error) {
        self.emit('error', message.error);
      }
      else if (message.response === 'motion') {
        self.config.continueToCapture = false;
        self.emit('motion');

        if (self.config.captureVideoOnMotion) {
          videoCaptureChild.send({
            cmd: 'capture',
          });
        }
        else {
          self.config.continueToCapture = true;
          imageCaptureChild.send({ cmd: 'capture' });
        }
      }
    });

    videoCaptureChild.on('message', (message) => {
      if (message.error) {
        self.emit('error', message.error);
      }
      else if (message.response === 'success') {
        self.config.continueToCapture = true;
        imageCaptureChild.send({ cmd: 'capture' });
      }
    });

    videoRenameChild.on('message', (message) => {
      if (message.error) {
        self.emit('error', message.error);
      }
    });

    // Start the magic
    imageCaptureChild.send({ cmd: 'capture' });
  }
}

function captureDirsCheck(base) {
  if (!base) {
    throw new Error(`'captureDirectory' can't be null`);
  }

  const dirsToCheck = [ base, path.resolve(base, 'images'), path.resolve(base, 'videos') ];

  dirsToCheck.forEach((dir) => {
    try {
      fs.accessSync(dir);
    }
    catch (e) {
      // Doesn't exist, create it
      fs.mkdirSync(dir);
    }
  });
}

module.exports = MotionDetectionModule;
