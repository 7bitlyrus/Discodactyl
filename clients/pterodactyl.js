const Io = require('socket.io-client')

module.exports = (config) => {
    if(!config.daemon || !config.server || !config.token) {
        throw new Error('Panel configuration is invalid or not set.')
    }
    
    const socket = Io(`${config.daemon}/v1/ws/${config.server}?token=${config.token}`)

    // Connected
    socket.on('connect', () => {
        console.log(`[pterodactyl] Connected to ${config.daemon}`)
    });

    socket.on('reconnect', () => {
        console.log(`[pterodactyl] Reconnected.`)
    });

    socket.on('reconnecting', (num) => {
        console.log(`[pterodactyl] Attempting to reconnect. Attempt ${num}.`)
    });
    

    // Errors
    socket.on('error', (err) => {
        if(err.includes('permission')) throw new Error(`Pterodactyl returned error: ${err}`)
        console.log(`[pterodactyl] Error: ${err}`)
    });
    
    socket.on('connect_error', (err) => {
        console.log(`[pterodactyl] Connection error: ${err}`)
    });


    // Heartbeat
    socket.on('ping', () => {
        console.log(`[pterodactyl] Sending a heartbeat.`)
    });

    socket.on('pong', (ms) => {
        console.log(`[pterodactyl] Heartbeat acknowledged, latency of ${ms}ms.`)
    });

    socket.emit('send server log');
    return socket
}