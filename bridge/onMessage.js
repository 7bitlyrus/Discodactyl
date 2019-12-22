module.exports = (discord, pterodactyl, config) => {
    const nearestColor = require('nearest-color').from(config.bridge.minecraft.colors);

    discord.on('message', (msg) => {
        if(msg.channel.id == msg.client._chat.id && validMember(msg)) {
            const tellraw = config.bridge.minecraft.tellraw
            const leaf = config._leaf
            const jsonObj = tellraw.json

            const str = msg.cleanContent
            if(msg.cleanContent.length > 256) str = str.substring(0, 256) + '...'

            leaf(jsonObj, tellraw.set.userColor, nearestColor(msg.member.displayHexColor).name)
            leaf(jsonObj, tellraw.set.userDisplay, msg.member.displayName)
            leaf(jsonObj, tellraw.set.userId, msg.author.id)
            leaf(jsonObj, tellraw.set.userMention, msg.author + " ")
            leaf(jsonObj, tellraw.set.userTag, msg.author.tag)
            leaf(jsonObj, tellraw.set.message, str)

            const json = JSON.stringify(jsonObj)
            const command = tellraw.prefix + json

            pterodactyl.emit('send command', command);
        }

        if(msg.channel.id == msg.client._log.id && validMember(msg)) {
            pterodactyl.emit('send command', msg.content);
        }
    })
}

const validMember = msg => (msg.member && msg.author.id != msg.client.user.id)
