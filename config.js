export const mDNSNetwork = {
  IPv4: {interface: process.env.IPv4_INTERFACE || '0.0.0.0'},
  IPv6: {ip: process.env.IPv6_IP || 'ff02::fb', interface: process.env.IPv6_INTERFACE || '::%eth0', type: 'udp6'}
}

export const DNSPort = process.env.DNS_PORT || 9999
export const DNSAddress = process.env.DNS_ADDRESS || '0.0.0.0'

// Root on DNS Side
export const DNSRootDomain = process.env.DNS_ROOT_DOMAIN || 'cedar'

// Root on mDNS Side
export const mDNSRootDomain = process.env.mDNS_ROOT_DOMAIN || 'local'

// TTL sent to clients
export const DNSTTL = +process.env.DNS_TTL || 300 // sec

// How long are mDNS results kept for
export const mDNSTTL = +process.env.mDNS_TTL || 60 * 60 * 1000 // ms

// How long may a mDNS lookup take before conceeding the address doesn't exist
export const mDNSTimeout = +process.env.mDNS_TIMEOUT || 3 * 1000 // ms
