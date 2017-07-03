// This module is responsible for renaming captured video with a timestamp value

'use strict';

const fs = require('fs');
const path = require('path');
const videosDir = process.argv[2];

const DEFAULT_FILENAME = 'video.h264';
const pathToFile = path.resolve(videosDir, DEFAULT_FILENAME);

fs.watch(videosDir, (event, filename) => {
  if (filename.indexOf(DEFAULT_FILENAME) > -1 && filename.indexOf('~') === -1) {
    fs.access(pathToFile, fs.constants.R_OK, (error) => {
      const exists = error ? false : true;

      if (exists) {
        const timestamp = new Date().valueOf();
        const pathNewFile = path.resolve(videosDir, `${ timestamp }.h264`);

        fs.rename(pathToFile, pathNewFile, (error) => {
          if (error) {
            return process.send({
              error,
            });
          }

          return process.send({
            response: 'rename',
            error: null,
          });
        });
      }
    });
  }
});
