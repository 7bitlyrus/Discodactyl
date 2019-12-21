const config = require('./config.js')

const pterodactyl = require('./clients/pterodactyl.js')(config.pterodactyl)
const discord = require('./clients/discord.js')(config.discord)

require('./bridge')(discord, pterodactyl, config)
require('./memWatch.js')(pterodactyl, config.memlimit)