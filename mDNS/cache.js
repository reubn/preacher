import colors from 'colors/safe.js'

import {mDNSTTL} from '../config.js'

export const cache = {
  A: new Map(),
  AAAA: new Map(),
  PTR: new Map()
}

export const cacheResponse = ({name, data, type}) => {
  const hostname = name.toLowerCase()

  const cacheEntry = cache[type].get(hostname)
  if(cacheEntry) clearTimeout(cacheEntry.timeout)
  cache[type].set(hostname, {
    answer: data,
    timeout: setTimeout(() => (cache[type].delete(hostname)), mDNSTTL)
  })
}

export const cacheResponseReverse = ({address, domain}) => {

  const cacheEntry = cache['PTR'].get(address)
  if(cacheEntry) clearTimeout(cacheEntry.timeout)
  cache['PTR'].set(address, {
    answer: domain,
    timeout: setTimeout(() => (cache['PTR'].delete(address)), mDNSTTL)
  })
}
