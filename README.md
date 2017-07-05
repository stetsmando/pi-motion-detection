# pi-motion-detection
A software based detection module for the Raspberry Pi camera using the [Pi-Camera](https://www.npmjs.com/package/pi-camera) module.

## Wanna Contribute or Help Out?
Feel free to head over to the GitHub page for pi-motion-detection and submit comments, issues, pulls, and whatever else you'd like. I plan on adding features as I need them for my own projects so if something isn't happening fast enough for you why not fix it? (:

## Installation
```javascript
// NPM 5
npm install pi-motion-detection

// Older NPM versions
npm install pi-motion-detection --save
```

## Basic usage
```javascript
const path = require('path');
const MotionDetectionModule = require('./index');
const motionDetector = new MotionDetectionModule({
  captureDirectory: path.resolve(__dirname, 'captures'),
});

motionDetector.on('motion', () => {
  console.log('motion!');
});

motionDetector.on('error', (error) => {
  console.log(error);
});

motionDetector.watch();
```

## Constructor Options
```javascript
const motionDetector = new MotionDetectionModule({
  // Required
  captureDirectory: foo, // Directory to store tmp photos and video captures. Those will be written into
                         // captureDirectory/images and captureDirectory/videos respectively

  // Optional
  continueAfterMotion: false,  // Defaults to false
                               // Flag to control if motion detection will continue after detection
  
  captureVideoOnMotion: false, // Defaults to false
                               // Flag to control video capture on motion detection
});
```