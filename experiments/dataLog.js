const fs = require('fs');
const R_behind = /\[.+] \[Server thread\/WARN]: Can't keep up! Is the server overloaded\? Running (\d+)ms or \d+ ticks behind/

const data = {
    behind: {ms: 0, at: 0},
    proc: {cpu: null, mem: null, at: 0},
    players: {count: null, at: 0},
}

module.exports = (pterodactyl, config) => {
    if(!config.host) return
    const Gamedig = require('gamedig');
    
    pterodactyl.on('console', function(con) {
        const behind = con.line.match(R_behind)
        if(behind) data.behind = {ms: behind[1], at: now()}
    });

    pterodactyl.on('proc', function(proc) {
        data.proc.cpu = proc.data.cpu.total
        data.proc.mem = proc.data.memory.total / 1024000
        data.proc.at  = now()
    });

    setInterval(getPlayers, 3000, Gamedig, config)
    setInterval(write, 10000, config)
}

function getPlayers(Gamedig, config) {
    Gamedig.query({
        type: 'minecraft',
        host: config.host,
        port: config.port || 25565
    }).then((s) => {
        data.players = {count: s.players.length, at: now()}
    }).catch(() => {
        data.players = {count: null, at: now()}
    });
}

function write(config) {
    const file = config.log || 'log.csv'
    if (!fs.existsSync(file)) {
        fs.appendFileSync(file, 'time,mem,cpu,players,behind\n');
    }

    const arr = [
        new Date().toISOString(),
        validateAt(data.proc.at,    data.proc.mem),
        validateAt(data.proc.at,    data.proc.cpu),
        validateAt(data.players.at, data.players.count),
        validateAt(data.behind.at,  data.behind.ms)
    ]
    const line = arr.join(',')
    fs.appendFileSync(file, line + '\n');

    console.log(line)
}

function now() {
    return Math.floor(new Date() / 1000)
}

function validateAt(at = 0, val = '') {
    if(at + 10 < now()) val = null
    return val || ''
}