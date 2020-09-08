const puppeteer = require('puppeteer-core');

const setupPuppeteerLaunchOption = require('./setup-puppeteer-launch-option');

// クリックなどの処理を引数で指定すると画面遷移を待つ
function execMove(page, promiseFunction) {
  return Promise.all([
    promiseFunction,
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);
}

module.exports = async (config, profile) => {
  try {
    const option = setupPuppeteerLaunchOption(config);
    console.log(option);
    const browser = await puppeteer.launch(option);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    await execMove(page, page.goto(`https://blog.hatena.ne.jp/${profile.hatena_id}/${profile.hatena_blog_url}/drafts`));
    console.log(await page.title());
  }
  catch(error) {
    console.log('Error', error);
  }
};
