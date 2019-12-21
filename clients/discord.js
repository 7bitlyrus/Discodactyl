const Discord = require('discord.js')
const client = new Discord.Client({
    "messageCacheLifetime": 60,
    "messageSweepInterval": 60,
    "disableEveryone": true
});


client.on('ready', () => {
    console.log(`[discord] Logged in as ${client.user.tag}.`);
    // if(!client._config.prefix) client._config.prefix = `<${client.user.id}> `
    client._chat = client.channels.get(client._config.channels.chat) 
    client._log  = client.channels.get(client._config.channels.log)
});

client.on('error', (err) => {
    console.log(`[discord] ${err}`);
});

client.on('warn', (warn) => {
    console.log(`[discord] ${warn}`);
});

client.on('debug', (debug) => {
    console.log(`[discord] ${debug}`);
});


module.exports = (config) => {
    var webhook, chat, log;

    if(!config.token) {
        throw new Error('Discord token is not set.')
    }

    if(!config.channels || !config.channels.chat && !config.channels.log) {
        throw new Error('Discord channel configuration is not set.')
    }

    if(!config.webhook || !config.webhook.id || !config.webhook.token) {
        config.webhook  = {}
        client._webhook = undefined
    } else {
        client._webhook = new Discord.WebhookClient(config.webhook.id, config.webhook.token, {
            "disableEveryone": true
        })
    }

    client._config = config
    client.login(config.token);
    
    return client
}