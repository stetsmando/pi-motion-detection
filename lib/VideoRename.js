// This module is responsible for renaming captured video with a timestamp value

'use strict';

const fs = require('fs');
const path = require('path');
const videosDir = process.argv[2];

fs.watch(videosDir, (event, filename) => {
  if (filename.indexOf('video.h264') > -1 && filename.indexOf('~') === -1) {
    fs.rename(path.resolve(videosDir, filename), path.resolve(videosDir, `${ new Date().valueOf() }.h264`), (error) => {
      if (error) {
        process.send({
          response: 'failure',
          error,
        });
      }
    });
  }
});
