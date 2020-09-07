#!/usr/bin/env node

const args = process.argv.slice(2, process.argv.length);

if(!args.length) {
  console.error('No args');
  return process.exit(1);
}

if(args[0] === 'init') {
  console.log('Init');
}
else if((args[0] === 'get' && ['draft', 'drafts'].includes(args[1])) || args[0] === 'gd') {
  console.log('Get Draft');
}
else if((args[0] === 'get' && ['post', 'posts'].includes(args[1])) || args[0] === 'gp') {
  console.log('Get Post');
}
else if((args[0] === 'get' && ['category', 'categories'].includes(args[1])) || args[0] === 'gc') {
  console.log('Get Category');
}
else if(args[0] === 'get') {
  console.log('What Get?');
}
else if(args[0] === 'post' && args[1] !== '') {
  console.log('Post : ' + args[1]);
}
else if(args[0] === 'post') {
  console.log('What Post?');
}
else {
  console.log('What Command?');
}
