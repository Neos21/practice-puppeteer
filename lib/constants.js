const os = require('os');
const path = require('path');

const constants = {
  configFileName: '.hb-config.json'
};

constants.configFilePath = path.resolve(os.homedir(), constants.configFileName);

module.exports = constants;
