const minecraftAPI = require('minecraft-api');

var cache = {}

module.exports = async function(webhook, name, msg, consts) {
    const now = Math.floor(new Date() / 1000)

    if(cache[name] && cache[name].expires < now) {
        delete cache[name]
    }

    if(!cache[name]) {
        const uuid = await minecraftAPI.uuidForName(name) || '0'.repeat(32)
        cache[name] = {uuid, expires: now + consts.userCacheTime}
    }

    webhook.send(msg, {
        username: name,
        avatarURL: consts.avatarapi.replace('$UUID', cache[name].uuid)
    })
}