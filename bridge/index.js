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
        var info = con.line.match(consts.regex.info)
        if(!info) return

        var message = info[1].match(consts.regex.message)
        var player  = info[1].match(consts.regex.player)
        
        if(message) {
            if(discord._webhook) webhookMgr(discord._webhook, message[1], message[2], consts)
            else chatBucket.addMessage(`**${message[1]}**: ${message[2]}`)
        } 

        if(player) {
            chatBucket.addMessage(`**${player[0]}**`) // todo: death messages
        }
    });
}