const fs = require('fs');

const constants = require('./constants');

module.exports = () => {
  console.log(`Config File : [${constants.configFilePath}]`);
  
  if(fs.existsSync(constants.configFilePath)) {
    console.log('\nConfig File is already exists. Aborted');
    return false;
  }
  
  const configFileTemplate = `{
  "profiles": [
    {
      "name"               : "EXAMPLE",
      "hatena_blog_url"    : "EXAMPLE.hatenablog.com",
      "hatena_blog_api_key": "EXAMPLE-API-KEY",
      "hatena_id"          : "EXAMPLE-ID",
      "hatena_password"    : "EXAMPLE-PASSWORD"
    }
  ],
  "chrome_options": {
    "headless"       : true,
    "executable_path": "",
    "user_data_dir"  : ""
  }
}
`;
  
  fs.writeFileSync(constants.configFilePath, configFileTemplate, 'utf-8');
  console.log(`\n${configFileTemplate}\n`);
  console.log('Config File created');
  return true;
};
