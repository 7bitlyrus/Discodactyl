const config = require('./config.json')

const consts = require('./consts.js')(config.consts || {})
const pterodactyl = require('./clients/pterodactyl.js')(config.pterodactyl || {})
const discord = require('./clients/discord.js')(config.discord || {})

require('./bridge')(discord, pterodactyl, consts)
require('./experiments/memWatch.js')(pterodactyl, config.experiments.memlimit || NaN)
