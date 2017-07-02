// This module is responsible for comparing photos when they've been captured

'use strict';

const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const capturesDir = process.argv[2];
let controlFileName = null;
let compareFileName = null;

const COMPARE_THRESHOLD = 0.1;

fs.watch(capturesDir, (event, filename) => {
  if (filename.indexOf('.jpg') > -1 && filename.indexOf('~') === -1) {
    fs.access(`${ capturesDir }/${ filename }`, fs.constants.R_OK, (error) => {
      const exists = error ? false : true;

      if (exists) {
        controlFileName = controlFileName ? controlFileName : filename;
        compareFileName = controlFileName && !compareFileName && filename !== controlFileName ? filename : null;

        if (controlFileName && compareFileName) {
          // console.log(`Comparing ${ controlFileName } and ${ compareFileName }`);
          Jimp.read(path.resolve(capturesDir, `./${ controlFileName }`), (error, controlFile) => {
            if (error) {
              throw error;
            }

            Jimp.read(path.resolve(capturesDir, `./${ compareFileName }`), (error, compareFile) => {
              if (error) {
                throw error;
              }

              const diff = Jimp.diff(controlFile, compareFile, COMPARE_THRESHOLD);

              // console.log(diff.percent);
              if (diff.percent > 0.001) {
                process.send({
                  response: 'motion',
                  error: null,
                });
              }
              try {
                fs.unlinkSync(path.resolve(capturesDir, `./${ controlFileName }`));
              }
              catch (error) {
                process.send({
                  error,
                });
              }
              controlFileName = compareFileName;
              compareFileName = null;
            });
          });
        }
      }
    });
  }
});

// NOTE:
// Possible optimization would be to not reread files each time a check is performed.
// Meaning that the reference to controlImage would update to the compare image file already in memory
