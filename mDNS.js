import mDNS from 'multicast-dns'

import colors from 'colors/safe.js'

import {staticmDNSRecords, mDNSTTL, mDNSTimeout, addr} from './config.js'

const MDNS = mDNS({interface: addr})

const cache = {
  A: new Map(staticmDNSRecords.A),
  AAAA: new Map(staticmDNSRecords.AAAA)
}

export default async ({hostname, type='A'}) => new Promise((resolve, reject) => {
  const watchdog = setTimeout(() => {
    MDNS.removeListener('response', handler)
    reject()
  }, mDNSTimeout)

  const handler = async response => {
    const answer = response.answers.find(answer => answer.name.toLowerCase() === hostname.toLowerCase() && answer.type === type)
    if(!answer) return

    MDNS.removeListener('response', handler)

    respond(answer.data)
    clearTimeout(watchdog)

    const cacheEntry = cache[type].get(hostname) || {}
    if(cacheEntry) clearTimeout(cacheEntry.timeout)
    cache[type].set(hostname, {...cacheEntry, answer: answer.data, timeout: setTimeout(() => cache[type].delete(hostname), mDNSTTL)})
  }

  const query = () => {
    MDNS.on('response', handler)
    MDNS.query(hostname, type)
  }

  const respond = answer => {
    console.log(colors.magenta.bold('A'), {A: colors.green.bold('   A'), AAAA: colors.cyan.bold('AAAA')}[type], hostname, answer)
    resolve(answer)
  }

  const cacheEntry = cache[type].get(hostname)
  if(cacheEntry) return respond(cacheEntry.answer)

  query()
})
