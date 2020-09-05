require('dotenv').config();
const puppeteer = require('puppeteer-core');

let browser          = null;
let page             = null;
let currentPageTitle = '';
(async () => {
  try {
    browser = await puppeteer.launch({
      headless: false,
      executablePath: process.env.CHROME_EXECUTABLE_PATH,
      // Chrome の仕様で、userDataDir もしくは --user-data-dir (どちらでも良い) で指定したディレクトリの直下の「Default」ディレクトリを探しに行ってしまう
      // --profile-directory もうまく効かないので、利用したいユーザデータを「…/User Data/Default」ディレクトリで配置するようにしておく
      userDataDir: process.env.CHROME_USER_DATA_DIR,
      // page.type() の文字ごとにこの間隔 (ms) が開く
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
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // カテゴリ一覧を取得する
    await execMove(page.goto(`https://blog.hatena.ne.jp/${process.env.HATENA_ID}/${process.env.HATENA_BLOG_URL}/categories`));
    await loginIfNeed();
    if(!currentPageTitle.includes('カテゴリー - はてなブログ')) throw new Error('うまくログインできていない');
    const categoryTexts = await page.$$eval('.categories-table-category-name', elements => elements.map(element => element.textContent).map(text => text.replace((/\n/gu), '').replace((/\s+/gu), ' ').trim()));
    const categories = categoryTexts.map((categoryText) => categoryText.match((/(.*)( \([0-9]*\))$/u))[1]).sort();
    console.log(categories);
    
    return await page.waitFor(1000);
    
    // 下書きの予約投稿時間を確認する
    await execMove(page.goto(`https://blog.hatena.ne.jp/${process.env.HATENA_ID}/${process.env.HATENA_BLOG_URL}/drafts`));
    await loginIfNeed();
    if(!currentPageTitle.includes('記事の管理 - はてなブログ')) throw new Error('うまくログインできていない');
    await getDraftPostTimes();
    // 「記事を書く」ボタンを押下して予約投稿する
    // await postReservedDraft();
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
  if(!currentPageTitle.includes('ログイン - はてな')) return;
  console.log('ログイン未済・ログインする');
  await page.type('#login-name', process.env.HATENA_ID      , { delay: 50 });
  await page.type('.password'  , process.env.HATENA_PASSWORD, { delay: 50 });
  await execMove(page.click('.submit-button'));
}

// 下書き・予約投稿の記事の日時を取得する
async function getDraftPostTimes() {
  // 「-」                                      = 下書き・日付未指定
  // 日付のみ                                   = 下書き・日付指定アリ
  // 「予約投稿」(span.badge.badge-info) + 日付 = 予約投稿・日付指定アリ
  const postTimeTexts = await page.$$eval('.td-blog-description', elements => elements.map(element => element.textContent).map(text => text.replace((/\n/gu), '').replace((/\s+/gu), ' ').trim()));
  const postTimes = postTimeTexts.filter(postTimeText => postTimeText !== '-').map(postTimeText => ({
    isReserved: postTimeText.includes('予約投稿'),
    postTime  : postTimeText.replace('予約投稿 ', '')
  }));
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
