import mDNS from 'multicast-dns'

import {mDNSNetwork} from '../config.js'

const MDNS4 = mDNS(mDNSNetwork.IPv4)
const MDNS6 = mDNS(mDNSNetwork.IPv6)

export const mDNSQuery = (...args) => {
  MDNS4.query(...args)
  MDNS6.query(...args)
}

export const mDNSListen = cb => {
  MDNS4.on('response', cb)
  MDNS6.on('response', cb)
}

export const mDNSScan = () => {
  const services = [
    '_adisk._tcp.local',
    '_afpovertcp._tcp.local',
    '_airdrop._tcp.local',
    '_airplay._tcp.local',
    '_airport._tcp.local',
    '_apple-mobdev2._tcp.local',
    '_appletv-v2._tcp.local',
    '_bttremote._tcp.local',
    '_companion-link._tcp.local',
    '_daap._tcp.local',
    '_ftp._tcp.local',
    '_googlecast._tcp.local',
    '_googlerpc._tcp.local',
    '_googlezone._tcp.local',
    '_hap._tcp.local',
    '_homekit._tcp.local',
    '_http-alt._tcp.local',
    '_http._tcp.local',
    '_https._tcp.local',
    '_ipp._tcp.local',
    '_ipps._tcp.local',
    '_mediaremotetv._tcp.local',
    '_pdl-datastream._tcp.local',
    '_print-caps._tcp.local',
    '_printer._tcp.local',
    '_privet._tcp.local',
    '_qdiscover._tcp.local',
    '_raop._tcp.local',
    '_rdlink._tcp.local',
    '_scanner._tcp.local',
    '_services._dns-sd._udp.local',
    '_sleep-proxy._udp.local',
    '_smb._tcp.local',
    '_sonos._tcp.local',
    '_spotify-connect._tcp.local',
    '_ssh._tcp.local',
    '_sub._apple-mobdev2._tcp.local',
    '_touch-able._tcp.local',
    '_tw-multipeer._tcp.local',
    '_uscan._tcp.local',
    '_uscans._tcp.local',
    '_workstation._tcp.local'
  ]

  mDNSQuery({
    questions: services.map(service => ({name: service, type: 'PTR'}))
  })
}
