import colors from 'colors/safe.js'

import {mDNSTTL, staticmDNSRecords} from '../config.js'

export const cache = {
  A: new Map(staticmDNSRecords.A),
  AAAA: new Map(staticmDNSRecords.AAAA)
}

export const cacheResponse = ({name, data, type}) => {
  const hostname = name.toLowerCase()

  // console.log(colors.magenta('found  '), hostname, type, data)

  const cacheEntry = cache[type].get(hostname)
  if(cacheEntry) clearTimeout(cacheEntry.timeout)
  cache[type].set(hostname, {
    answer: data,
    timeout: setTimeout(() => (cache[type].delete(hostname)/*, console.log(colors.grey('expired'), hostname, type)*/), mDNSTTL),
    [Symbol.for('nodejs.util.inspect.custom')]: () => colors.cyan(data)
  })
}
