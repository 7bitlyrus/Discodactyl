const MsgBucket  = require('./messageBucket.js')
const webhookMgr = require('./webhook.js')

module.exports = (discord, pterodactyl, consts) => {
    require('./onMessage.js')(discord, pterodactyl, consts)

    var logBucket  = new MsgBucket(consts.updateInterval, true)
    var chatBucket = new MsgBucket(consts.updateInterval)

    discord.on('ready', () => {
        if(discord._log)  logBucket.enable(discord._log)
        if(discord._chat) chatBucket.enable(discord._chat)
    })

    pterodactyl.on('console', function(con) {
        if(con.line.startsWith(consts.tellraw.prefix)) return

        logBucket.addMessage(con.line)

        if(!discord._chat) return
        const info = con.line.match(consts.regex.info)
        if(!info) return

        const actionMessage = info[1].match(consts.regex.action)
        if(actionMessage) chatBucket.addMessage(`**${actionMessage[0]}**`) // todo: death messages, advancements
        
        const chatMessage = info[1].match(consts.regex.chat)
        if(chatMessage) chatMethod(chatMessage[1], chatMessage[2], discord, consts, chatBucket)

        const meMessage = info[1].match(consts.regex.me)
        if(meMessage) chatMethod(meMessage[1], meMessage[2], discord, consts, chatBucket, true)
    });
}

function chatMethod(ply, msg, discord, consts, chatBucket, me = false) {
    if(discord._webhook) webhookMgr(discord._webhook, ply, me ? `\* *${msg}*` : msg, consts)
    else chatBucket.addMessage(me ? `\* ***${ply}** ${msg}*` : `**${ply}**: ${msg}`)
}