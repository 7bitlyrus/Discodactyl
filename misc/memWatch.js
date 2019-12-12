module.exports = (pterodactyl, maxmem) => {
    let lastRestart = 0

    pterodactyl.on('proc', function(proc) {
        if(isNaN(maxmem)) return

        const mem = parseMem(proc.data.memory)
        const formatted = formatMemory(mem, maxmem)
        const now = Math.floor(new Date() / 1000)
        console.log('Memory: ' + formatted)

        if(mem.percent > maxmem && (lastRestart + 60) < now) {
            lastRestart = now

            pterodactyl.emit('send command', 'tell Lyrus_ [!!!] Server restarting to prevent instability in 15 seconds!')
            pterodactyl.emit('send command', `tell Lyrus_ Memory limit exceeded: ${formatted}`)
            pterodactyl.emit('send command', `save-all`)
            setInterval(() => pterodactyl.emit('set status', 'restart'), 15*1000)
        }
    })
}

function parseMem(mem) {
    const now = mem.total
    const max = mem.amax
    return {percent: now/max, now, max}
}

function formatMemory(mem, maxmem) {
    const now = (mem.now / 1024000).toFixed(2)
    const max = (mem.max / 1024000).toFixed(2)
    const per = (mem.percent*100).toFixed(2)
    const lim = (maxmem*100).toFixed(2)

    const sign = mem.percent > maxmem ? '>' : mem.percent < maxmem ? '<' : '='
    return `${now}MB / ${max}MB (${per}% ${sign} ${lim}% Limit)`
}