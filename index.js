require('dotenv').config();
const puppeteer = require('puppeteer-core');

// Chrome の仕様で、userDataDir もしくは --user-data-dir (どちらでも良い) で指定したディレクトリの直下の「Default」ディレクトリを探しに行ってしまう
// --profile-directory もうまく効かないので、利用したいユーザデータを「…/User Data/Default」ディレクトリで配置するようにしておく
const USER_DATA_DIR = 'C:\\Users\\Neo\\AppData\\Local\\Google\\Chrome\\User Data';

let browser          = null;
let page             = null;
let currentPageTitle = '';
(async () => {
  try {
    browser = await puppeteer.launch({
      headless: false,
      executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      userDataDir: USER_DATA_DIR,
      slowMo: 10,  // page.type() の文字ごとにこの間隔 (ms) が開く
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
        '--window-size=1280,720'
      ]
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    console.log('開始');
    
    await execMove(page.goto('https://blog.hatena.ne.jp/neos21/neos21.hatenablog.com/drafts'));
    await loginIfNeed();
    await getDraftPostTimes();
    // await postReservedDraft();
    
    await page.waitFor(1000);
  }
  catch(error) {
    console.error('ERROR\n', error, '\nERROR');
  }
  finally {
    if(browser) {
      await browser.close();
    }
  }
})();


// 共通
// ====================================================================================================

// クリックなどの処理を引数で指定すると画面遷移を待つ
async function execMove(promiseFunction) {
  await Promise.all([
    promiseFunction,
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);
  await pageMoved();
}

// 移動後に呼ぶことでページタイトルをロギングする
async function pageMoved() {
  currentPageTitle = await page.title();
  console.log(`遷移完了 [ ${currentPageTitle} ]`);
}


// 個別
// ====================================================================================================

// 必要ならログインする
async function loginIfNeed() {
  if( currentPageTitle.includes('記事の管理 - はてなブログ')) return console.log('  ログイン済');
  if(!currentPageTitle.includes('ログイン - はてな'        )) throw new Error(`未知の画面 : [${currentPageTitle}]`);
  
  console.log('  ログイン未済・ログインする');
  await page.type('#login-name', 'neos21'                   , { delay: 100 });
  await page.type('.password'  , process.env.HATENA_PASSWORD, { delay: 100 });
  await execMove(page.click('.submit-button'));
  if(!currentPageTitle.includes('記事の管理 - はてなブログ')) throw new Error('うまくログインできていない');
}

// 下書き・予約投稿の記事の日時を取得する
async function getDraftPostTimes() {
  const postTimes = await page.$$eval('.td-blog-description > time', elements => elements.map(element => element.textContent));
  console.log('予約投稿日時 :', postTimes);
}

// 予約投稿を行う
async function postReservedDraft() {
  await execMove(page.click('.admin-menu-edit-btn'));  // 「記事を書く」ボタンを押下する
  await page.click('[data-support-type="editor-option"]');  // 「編集オプション」アイコンを押下する
  await page.type('.datetime-input-date', '2020-10-01');
  await page.type('.datetime-input-time', '08:00');
  await page.click('[name="is_scheduled_entry"][value="1"]');  // 「指定日時で予約投稿する」ラジオボタンを念のため押下する
  await page.type('#title', '予約投稿テスト');
  await page.type('#body', '予約投稿テスト\nテストです');
  await execMove(page.click('.js-scheduled-button'));  // 「予約投稿する」ボタンを押下する
}
