import named from 'named'

import colors from 'colors/safe.js'

import mDNS from './mDNS/index.js'

import {DNSTTL, DNSRootDomain, mDNSRootDomain, DNSPort, DNSAddress} from './config.js'

const dnsServer = named.createServer()

dnsServer.listen(DNSPort, DNSAddress, function() {
  console.log('DNS Server Started')
})

dnsServer.on('query', async query => {
  const domain = query.name()
  const type = query.type()

  // Don't answer queries that don't end in the DNS root; or queries other then A and AAAA
  if(!domain.endsWith(`.${DNSRootDomain}`) || !(type === 'A' || type === 'AAAA')) return dnsServer.send(query)

  console.log(colors.yellow.bold('Q'), {A: colors.green.bold('   A'), AAAA: colors.cyan.bold('AAAA')}[type], domain)

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

  dnsServer.send(query)
})
