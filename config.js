// If you are looking to modify your config, edit/create config.json instead of editing this file.
const user = require('./config.json')

const defaults = {
    "pterodactyl": {
        "daemon": undefined,
        "server": undefined,
        "token": undefined
     },
     "discord": {
        "token": undefined,
        "channels": {
            "chat": undefined,
            "log": undefined
        },
        "webhook": {
            "id": undefined,
            "token": undefined
        }
     },
     "memlimit": {
        "enabled": false,
        "limit": 0.95
     }
}

const config = Object.assign({}, defaults, user);

module.exports = config
