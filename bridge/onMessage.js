module.exports = (discord, pterodactyl, consts) => {
    const nearestColor = require('nearest-color').from(consts.colors);

    discord.on('message', (msg) => {
        if(msg.channel.id == msg.client._chat.id && validMember(msg)) {
            var str = msg.cleanContent
            if(msg.cleanContent.length > 256) str = str.substring(0, 256) + '...'

            var jsonObj = consts.tellraw.json

            leaf(jsonObj, consts.tellraw.set.userDisplay, msg.member.displayName)
            leaf(jsonObj, consts.tellraw.set.userTag, msg.author.tag)
            leaf(jsonObj, consts.tellraw.set.userColor, nearestColor(msg.member.displayHexColor).name)
            leaf(jsonObj, consts.tellraw.set.message, str)

            const json = JSON.stringify(jsonObj)
            const command = consts.tellraw.prefix + json

            pterodactyl.emit('send command', command);
        }

        if(msg.channel.id == msg.client._log.id && validMember(msg)) {
            console.log('Is this log?')
            pterodactyl.emit('send command', msg.content);
        }
    })
}

// https://stackoverflow.com/a/46818701
function leaf(obj, path, value) {
    const pList = path.split('.');
    const key = pList.pop();
    const pointer = pList.reduce((accumulator, currentValue) => {
      if (accumulator[currentValue] === undefined) accumulator[currentValue] = {};
      return accumulator[currentValue];
    }, obj);
    pointer[key] = value;
    return obj;
}

const validMember = msg => (msg.member && msg.author.id != msg.client.user.id)