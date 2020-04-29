import readline from 'readline'
import colors from 'colors/safe.js'

import mDNS from './index.js'
import {cache} from './cache.js'

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function(line){
  const trimmed = line.trim()

  if(trimmed === 'cache') return console.log(cache)
  const [name, type] = trimmed.split(' ')

  const q = {
    name: name + '.local',
    type: type.toUpperCase()
  }


  console.log(colors.yellow('question'), q)
  mDNS(q).then(addr => console.log(colors.green('answer  '), {...q, addr})).catch(() => console.log(colors.red('failed  '), q))
})
