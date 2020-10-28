const fs = require('fs');

const constants = require('./constants');

module.exports = () => {
  if(!fs.existsSync(constants.configFilePath)) {
    console.log('Config File does not exist. Please execute `$ hb init` first');
    return null;
  }
  
  try {
    const rawConfig = fs.readFileSync(constants.configFilePath, 'utf-8');
    const config = JSON.parse(rawConfig);
    return config;
  }
  catch(error) {
    console.log('Failed to load Config File. Aborted');
    return null;
  }
};
