const Discord = require('discord.js')
const client = new Discord.Client({
    "messageCacheLifetime": 60,
    "messageSweepInterval": 60,
    "disableEveryone": true
});


client.on('ready', () => {
    console.log(`[discord] Logged in as ${client.user.tag}.`);
    client._chat = client.channels.get(client._config.channels.cache.chat) 
    client._log  = client.channels.get(client._config.channels.cache.log)
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

    client._webhook = (config.webhook && config.webhook.id && config.webhook.token) ?
        new Discord.WebhookClient(config.webhook.id, config.webhook.token, {
            "disableEveryone": true
        }) : undefined

    client.login(config.token);
    client._config = config
    
    return client
}
