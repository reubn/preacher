import colors from 'colors/safe.js'

import {cache} from './cache.js'

export const queue = []

export const processQueue = () => {
  queue.forEach(({hostname, type, promise, timeout}, index) => {
    const cacheEntry = cache[type].get(hostname)

    if(!cacheEntry) return

    promise.resolve(cacheEntry.answer)
    clearTimeout(timeout)
    queue.splice(index, 1)
  })
}
