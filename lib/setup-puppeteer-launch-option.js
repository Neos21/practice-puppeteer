module.exports = (config) => {
  const option = {
    slowMo: 10,
    ignoreHTTPSErrors: true,
    defaultViewport: {
      width: 1280,
      height: 720
    },
    args: [
      '--no-sandbox',
      '--disable-infobars',
      '--disable-session-crashed-bubble',  // セッションを復元するダイアログを非表示にする…効かない
      //'--kiosk',  // 最大化表示・メニューバーがなくなる。--disable-session-crashed-bubble と併用するとダイアログを消せる
      '--restore-last-session',  // --disable-session-crashed-bubble が効かないのでリストアさせちゃう
      '--window-position=0,0',
      '--window-size=1280,720',
      //'--remote-debugging-address=0.0.0.0',
      //'--remote-debugging-port=9222',
    ]
  };
  
  option.headless = (config.chrome_options && config.chrome_options.headless);
  if(config.chrome_options && config.chrome_options.executable_path) option.executablePath = config.chrome_options.executable_path;
  if(config.chrome_options && config.chrome_options.user_data_dir  ) option.userDataDir    = config.chrome_options.user_data_dir;
  
  return option;
};
