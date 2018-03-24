'use strict'

const TurtleCoind = require('./') // Should this actually be ---> require('./TurtleCoind')
const util = require('util')
var path = require("path")
let turtlepath = __dirname + '/path/to/TurtleCoind'
let shellpath = __dirname + '/path/to/.TurtleCoin' // or should this be ---> '/path/to/.TurtleCoin/DB'

var daemon = new TurtleCoind({
  path: turtlepath,
  dataDir: shellpath,
  pollingInterval: 10000
})

function log (message) {
  console.log(util.format('%s: %s', (new Date()).toUTCString(), message))
}

daemon.on('start', (args) => {
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
