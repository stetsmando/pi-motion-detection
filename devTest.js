'use strict';

const path = require('path');
const MotionDetectionModule = require('./index');
const motionDetector = new MotionDetectionModule({
  captureDirectory: path.resolve(__dirname, 'captures'),
  captureVideoOnMotion: true,
});

motionDetector.on('motion', () => {
  console.log('motion!');
});

motionDetector.on('error', (error) => {
  console.log(error);
});

motionDetector.watch();
