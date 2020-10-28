function errorResponse(message) { console.log(message); return false; }
function isNotTypeString(property) { return typeof property !== 'string'; }
function isNotEmptyValue(property) { return !property.length; }

module.exports = (config) => {
  if(!config.profiles || typeof config.profiles !== 'object' || !config.profiles.length) return errorResponse('No `profiles` array property in Config File. Aborted');
  
  const hasProfileError = config.profiles.some(profile => {
    if(typeof profile !== 'object') return true;
    return Object.keys(profile).some(key => isNotTypeString(profile[key]) || isNotEmptyValue(profile[key]));
  });
  if(hasProfileError) return errorResponse('Invalid `profiles` property in Config File. Aborted');
  
  return true;
};
