export const addr = '0.0.0.0'
export const port = 9999

// Root on DNS Side
export const DNSRootDomain = 'cedar'

// Root on mDNS Side
export const mDNSRootDomain = 'local'

// Static Mappings (if you want `cf.cedar` to resolve to 1.1.1.1, use `cf.local`)
export const staticmDNSRecords = {
  A: [/*['cf.local', '1.1.1.1']*/],
  AAAA: []
}

// TTL sent to clients
export const DNSTTL = 300 // sec

// How long are mDNS results kept for
export const mDNSTTL = 300 * 1000 // ms

// How long may a mDNS lookup take before conceeding the address doesn't exist
export const mDNSTimeout = 3 * 1000 // ms
