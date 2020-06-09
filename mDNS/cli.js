import readline from 'readline'
import colors from 'colors/safe.js'

import {mDNS} from './index.js'
import {cache} from './cache.js'
import {mDNSScan} from './network.js'

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function(line){
  const trimmed = line.trim()

  if(trimmed === 'cache') return console.log(cache)
  if(trimmed === 'scan') return mDNSScan()

  const [name, type] = trimmed.split(' ')

  const q = {
    name: name + '.local',
    type: type.toUpperCase()
  }


  console.log(colors.yellow('question'), q)
  console.time(`${name} ${type}`)
  mDNS(q).then(addr => (console.timeEnd(`${name} ${type}`), console.log(colors.green('answer  '), {...q, addr}))).catch(() => console.log(colors.red('failed  '), q))
})
