function errorResponse(message) { console.log(message); return null; }

function detectProfile(profileName, config) {
  if(!profileName) return errorResponse('No Profile Name. Aborted');
  const profile = config.profiles.find(profile => profile.name === profileName);
  if(!profile) return errorResponse('No Profiles Detected. Aborted');
  return profile;
}

module.exports = (args, config) => {
  const nIndex = args.findIndex(arg => arg === '-n');
  if(nIndex > 0) {
    const profileName = args[nIndex + 1];
    return detectProfile(profileName, config);
  }
  
  const nWithValue = args.find(arg => arg.startsWith('-n='));
  if(nWithValue) {
    const profileName = nWithValue.replace((/^-n=/u), '');
    return detectProfile(profileName, config);
  }
  
  return errorResponse('Please Set `-n` Argument. Aborted');
};
