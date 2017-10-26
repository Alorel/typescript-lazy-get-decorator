if (!('CI' in process.env)) {
  const rimraf = require('rimraf');
  const {resolve} = require('path');

  rimraf.sync(resolve(__dirname, '..', '.nyc_output'))
}
