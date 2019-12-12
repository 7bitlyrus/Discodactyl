const config = require('./config.json')

const consts = require('./consts.js')(config.consts || {})
const pterodactyl = require('./clients/pterodactyl.js')(config.pterodactyl || {})
const discord = require('./clients/discord.js')(config.discord || {})

require('./bridge')(discord, pterodactyl, consts)
<<<<<<< HEAD
require('./misc/memWatch.js')(pterodactyl, config.memlimit || NaN)
=======
>>>>>>> 01c4a93bef345023a8891d77125c55cb5d6da825
