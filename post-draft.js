require('dotenv').config();
const axios = require('axios');

(async () => {
  
})


'/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe' --remote-debugging-port=60000

- https://github.com/puppeteer/puppeteer/issues/5957#issuecomment-637321228
  - `--remote-debugging-address` オプションを付けて Chrome を起動する
- https://stackoverflow.com/a/55100293
  - `--remote-debugging-port` オプションでポートを指定して Chrome を起動しておく
  - `launch()` ではなく `connect()` で接続できるらしい
- https://hiroqn.hatenablog.com/entry/2018/12/12/235919
  - `--remote-debugging-port=0` とするとポートがランダムに決まり、エンドポイント URL がコンソールで確認できるらしい
  - `connect()` メソッドの `browserWSEndpoint` オプションでそのエンドポイント URL を指定すれば良いらしい


# 投稿する
$ curl -X POST -u 'neos21:xxxxxxxxxx' -d '<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">
  <title>エントリタイトル</title>
  <author><name>neos21</name></author>
  <content type="text/x-markdown">__エントリ本文__

# ほげふが

<div 
</content>
  <updated>2021-01-01T08:00:00+09:00</updated>
  <category term="Scala" />
  <app:control><app:draft>yes</app:draft></app:control>
</entry>' \
  'https://blog.hatena.ne.jp/neos21/neos21.hatenablog.com/atom/entry'