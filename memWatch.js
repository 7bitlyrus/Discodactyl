module.exports = (pterodactyl, config) => {
    if(!config.enabled) return
    let lastRestart = 0

    pterodactyl.on('proc', function(proc) {
        if(isNaN(config.limit)) return

        const mem = parseMem(proc.data.memory)
        const now = Math.floor(new Date() / 1000)

        if(mem.percent > config.limit && (lastRestart + 60) < now) {
            lastRestart = now

            pterodactyl.emit('send command', config.msg)
            pterodactyl.emit('send command', `save-all`)
            setTimeout(() => pterodactyl.emit('set status', 'restart'), config.delay)
        }
    })
}

function parseMem(mem) {
    const now = mem.total
    const max = mem.amax
    return {percent: now/max, now, max}
}
