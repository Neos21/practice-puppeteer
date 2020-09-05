require('dotenv').config();
const axios = require('axios');

(async () => {
  try {
    const rawTitle = 'エントリタイトル';
    const rawBody  = `__エントリ本文__

# ほげふが
<div>hoge</div>`;
    const rawDateTime   = '2021-01-01 08:00';
    const rawCategories = ['Java', 'Windows'];
    const rawIsDraft    = true;
    
    const title      = rawTitle.replace((/\n/gu), ' ');
    const body       = rawBody.replace((/\</gu), '&lt;').replace((/\>/gu), '&gt;');
    const dateTime   = rawDateTime.replace((/\//gu), '-').replace((/ /u), 'T');
    const categories = rawCategories.map(category => `  <category term="${category}" />\n`);
    const isDraft    = rawIsDraft === false ? 'no' : 'yes';  // 変な値は下書きに倒す
    
    let data = `<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">
  <title>${title}</title>
  <author><name>${process.env.HATENA_ID}</name></author>
  <content type="text/x-markdown">${body}</content>\n`;
    
    if(dateTime) data += `  <updated>${dateTime}:00+09:00</updated>\n`;
    
    if(categories && categories.length) data += categories;
    
    data += `  <app:control>
    <app:draft>${isDraft}</app:draft>
  </app:control>
</entry>`;
    
    const result = await axios.post(`https://blog.hatena.ne.jp/${process.env.HATENA_ID}/${process.env.HATENA_BLOG_URL}/atom/entry`, data, {
      auth: {
        username: process.env.HATENA_ID,
        password: process.env.HATENA_BLOG_API_KEY
      }
    });
    console.log('RESULT\n', result, '\nRESULT');
  }
  catch(error) {
    console.error('ERROR\n', error, '\nERROR');
  }
})();
