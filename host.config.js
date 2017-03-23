var myIP = require('quick-local-ip');

module.exports = {
    hostLanIP: myIP.getLocalIP4(),
    hostName: 'localhost',
    hostPublicIP: '0.0.0.0',
    hostPort: 20987
};