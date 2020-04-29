import {mDNSTimeout} from '../config.js'

import {cache, cacheResponse} from './cache.js'
import {queue, processQueue} from './queue.js'
import {mDNSQuery, mDNSListen, mDNSScan} from './network.js'

const handleResponse = response => {
  const {answers, additionals, authorities} = response

  const unfiltered = [...answers, ...additionals, ...authorities]

  const filtered = unfiltered.filter(({type}) => ['A', 'AAAA'].includes(type))

  if(!filtered.length) return

  filtered.forEach(cacheResponse)

  processQueue()
}

mDNSListen(handleResponse)
mDNSScan()

export default ({name, type='A'}) => new Promise(async (resolve, reject) => {
  const hostname = name.toLowerCase()
  const cacheEntry = cache[type].get(hostname)

  if(cacheEntry) return resolve(cacheEntry.answer)

  const promise = {resolve, reject}

  const removalIndex = queue.length

  const job = {
    hostname,
    type,
    promise,
    timeout: setTimeout(() => {
      reject()
      queue.splice(removalIndex, 1)
    }, mDNSTimeout)
  }

  queue.push(job)

  mDNSQuery(hostname, type)
})
