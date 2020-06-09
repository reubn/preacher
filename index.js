import named from './named/lib/index.js'
import IP from 'ip-address'

import colors from 'colors/safe.js'

import {mDNS, mDNSReverse} from './mDNS/index.js'

import {DNSTTL, DNSRootDomain, mDNSRootDomain, DNSPort, DNSAddress} from './config.js'

const dnsServer = named.createServer()

dnsServer.listen(DNSPort, DNSAddress, function() {
  console.log('DNS Server Started')
})

dnsServer.on('query', async query => {
  const domain = query.name()
  const type = query.type()

  let mode

  if(domain.endsWith(`.${DNSRootDomain}`) && (type === 'A' || type === 'AAAA')) mode = 'normal'
  else if(domain.endsWith(`.arpa`) && type === 'PTR') mode = 'reverse'
  else return dnsServer.send(query)

  console.log(
    {normal: '➡️', reverse: '⬅️'}[mode],
    {A: colors.green.bold('   A'), AAAA: colors.cyan.bold('AAAA'), PTR: colors.magenta.bold(' PTR')}[type],
    domain
   )

  if(mode === 'normal') {
    // Convert DNS domain into its mDNS equivalent
    const name = domain.replace(new RegExp(`\.${DNSRootDomain}$`), `.${mDNSRootDomain}`).toLowerCase()

    if(type === 'A'){
      const address = await mDNS({name, type: 'A'}).catch(() => undefined)

      if(address) {
        const record = new named.ARecord(address)
        query.addAnswer(domain, record, DNSTTL)
      }
    }

    if(type === 'AAAA'){
      const address = await mDNS({name, type: 'AAAA'}).catch(() => undefined)

      if(address) {
        const record = new named.AAAARecord(address)
        query.addAnswer(domain, record, DNSTTL)
      }
    }
  }

  if(mode === 'reverse') {
    const address = domain.endsWith('ip6.arpa')
      ? new IP.Address6.fromArpa(domain + '.')
      : new IP.Address4(domain.split('.').slice(0, -2).reverse().join('.'))


    const response = await mDNSReverse({domain, address}).catch(() => undefined)

    if(response) {
      const record = new named.PTRRecord(response.replace(new RegExp(`\.local$`), `.${DNSRootDomain}`).toLowerCase())

      query.addAnswer(domain, record, DNSTTL)
    }
  }

  dnsServer.send(query)
})
