#!/usr/bin/env node

const args = process.argv.slice(2, process.argv.length);

if(!args.length) return console.log('No args');

if(args[0] === 'init') return require('../lib/init')();

const config = require('../lib/load-config-file')();
if(!config || !require('../lib/validate-config')(config)) return;

const profile = require('../lib/detect-profile')(args, config);
if(!profile) return;

if((args[0] === 'get' && ['draft', 'drafts'].includes(args[1])) || args[0] === 'gd') {
  return (async () => { return await require('../lib/get-draft')(config, profile); })();
}


/*
if((args[0] === 'get' && ['post', 'posts'].includes(args[1])) || args[0] === 'gp') {
  console.log('Get Post');
  return;
}
else if((args[0] === 'get' && ['category', 'categories'].includes(args[1])) || args[0] === 'gc') {
  console.log('Get Category');
  return;
}
else if(args[0] === 'get') {
  console.log('What Get?');
  return;
}

if(args[0] === 'post' && args[1] !== '') {
  console.log('Post : ' + args[1]);
  return;
}
else if(args[0] === 'post') {
  console.log('What Post?');
  return;
}
*/

console.log('What Command?');
