const Service = require('node-windows').Service
const cfg = require('./cfg')

// Create a new service object
const svc = new Service({
  name:'ProxyMaster',
  description: 'Proxy server for front/back-end development separately..',
  script: require('path').join(__dirname, 'index.js'),
  env:{
    name: "NODE_ENV",
    value: "production"
  }
})

// svc.user.domain = 'mydomain.local'
// svc.user.account = 'username'
// svc.user.password = 'password'

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start()
})

// Just in case this file is run twice.
svc.on('alreadyinstalled',function(){
  console.log('This service is already installed.')
})

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on('start',function(){
  console.log(svc.name+' started!\nVisit http://127.0.0.1:' + cfg.port + '/monitor.html to see the real time proxy.')
})

// Install the script as a service.
svc.install()