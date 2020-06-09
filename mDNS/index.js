import {exec} from 'child_process'

import IP from 'ip-address'

import {mDNSTimeout} from '../config.js'

import {cache, cacheResponse, cacheResponseReverse} from './cache.js'
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

export const mDNS = ({name, type='A'}) => new Promise(async (resolve, reject) => {
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

export const mDNSReverse = ({domain, address}) => new Promise(async (resolve, reject) => {
  address = address.correctForm()

  const cacheEntry = cache['PTR'].get(address)

  if(cacheEntry) return resolve(cacheEntry.answer)

  const timeout = setTimeout(() => {
    reject()
  }, mDNSTimeout)

  const callback = domain => {
    clearTimeout(timeout)
    cacheResponseReverse({domain, address})
    resolve(domain)
  }

  exec(`dig -x ${address} @224.0.0.251 +short -p 5353`, (err, x) => err ? reject(err) : callback(x.trim().replace(/\.$/, '').toLowerCase()))
})
