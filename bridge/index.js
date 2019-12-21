const MsgBucket  = require('./messageBucket.js')
const webhookMgr = require('./webhook.js')

module.exports = (discord, pterodactyl, config) => {
    require('./onMessage.js')(discord, pterodactyl, config)

    // require('./mcLang.js')(config)

    const bridge = config.bridge
    var logBucket  = new MsgBucket(bridge.updateInterval, true)
    var chatBucket = new MsgBucket(bridge.updateInterval)

    discord.on('ready', () => {
        if(discord._log)  logBucket.enable(discord._log)
        if(discord._chat) chatBucket.enable(discord._chat)
    })

    pterodactyl.on('console', function(con) {
        if(con.line.startsWith(bridge.minecraft.tellraw.prefix)) return

        logBucket.addMessage(con.line)

        if(!discord._chat) return
        const info = con.line.match(bridge.minecraft.regex.info)
        if(!info) return

        /*const actionMessage = info[1].match(bridge.minecraft.regex.action)
        if(actionMessage) chatBucket.addMessage(`**${actionMessage[0]}**`) // todo: death messages, advancements*/
        
        const chatMessage = info[1].match(bridge.minecraft.regex.chat)
        if(chatMessage) chatMethod(chatMessage[1], chatMessage[2], discord, bridge, chatBucket)

        const meMessage = info[1].match(bridge.minecraft.regex.me)
        if(meMessage) chatMethod(meMessage[1], meMessage[2], discord, bridge, chatBucket, true)
    });
}

function chatMethod(ply, msg, discord, bridge, chatBucket, me = false) {
    if(discord._webhook) webhookMgr(discord._webhook, ply, me ? `\* *${msg}*` : msg, bridge.webhook)
    else chatBucket.addMessage(me ? `\* ***${ply}** ${msg}*` : `**${ply}**: ${msg}`)
}