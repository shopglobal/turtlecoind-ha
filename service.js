'use strict'

const TurtleCoind = require('./')
const util = require('util')
var path = require("path")
var shellpath = '/path/to/.TurtleCoin'
var turtlepath = __dirname + '/path/to/TurtleCoind'
  
var daemon = new TurtleCoind({
  path: turtlepath,
  dataDir: shellpath,
  print: true,
  pollingInterval: 2000, // How often to check the daemon in milliseconds
  timeout: 2000, // How long to wait for RPC responses in milliseconds
  testnet: false, // Use the testnet?
  enableCors: false, // Enable CORS support for the domain in this value
  enableBlockExplorer: false, // Enable the block explorer
  rpcBindIp: '127.0.0.1', // What IP to bind the RPC server to
  rpcBindPort: 11898, // What Port to bind the RPC server to
  p2pBindIp: '0.0.0.0', // What IP to bind the P2P network to
  p2pBindPort: 11897, // What Port to bind the P2P network to
  p2pExternalPort: 0, // What External Port to bind the P2P network to for those behind NAT
  allowLocalIp: false, // Add our own IP to the peer list?
  peers: false, // Manually add the peer(s) to the list. Allows for a string or an Array of strings.
  priorityNodes: false, // Manually add the priority node(s) to the peer list. Allows for a string or an Array of strings.
  exclusiveNodes: false, // Only add these node(s) to the peer list. Allows for a string or an Array of strings.
  seedNode: false, // Connect to this node to get the peer list then quit. Allows for a string.
  hideMyPort: true, // Hide from the rest of the network
  dbThreads: 1, // Number of database background threads
  dbMaxOpenFiles: 100, // Number of allowed open files for the DB
  dbWriteBufferSize: 256, // Size of the DB write buffer in MB
  dbReadCacheSize: 10 // Size of the DB read cache in MB
})

function log (message) {
  console.log(util.format('%s: %s', (new Date()).toUTCString(), message))
}

daemon.on('start', (args, info) => {
  console.log(info)
  log(util.format('TurtleCoind has started... %s', args))
  log('TurtleCoind is attempting to synchronize with the network...')
})

daemon.on('synced', () => {
  log('TurtleCoind is synchronized with the network...')
})

daemon.on('ready', (info) => {
  log(util.format('TurtleCoind is waiting for connections at %s @ %s - %s H/s', info.height, info.difficulty, info.globalHashRate))
})

daemon.on('down', () => {
  log('TurtleCoind is not responding... stopping process...')
  daemon.stop()
})

daemon.on('stopped', () => {
  log('TurtleCoind has closed... restarting process...')
  daemon.start()
})

daemon.on('error', (err) => {
  log(err)
})

daemon.start()
