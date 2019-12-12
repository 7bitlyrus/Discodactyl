// Don't modify this file directly: add a consts object to your config.json to add overrides.

const consts = {
    regex: {
        action: /^\S+ (joined|left) the game$/,
        chat: /^<(\w+)> (.+)$/,
        info: /^\[.+] \[Server thread\/INFO]: (.+)$/,
        me: /^\* (\w+) (.+)$/
    },
    updateInterval: 2000,
    userCacheTime: 3600,
    avatarapi: 'https://crafatar.com/avatars/$UUID',
    colors: {
        'black': '#000000',
        'dark_blue': '#0000AA',
        'dark_green': '#00AA00',
        'dark_aqua': '#00AAAA',
        'dark_red': '#AA0000',
        'dark_purple': '#AA00AA',
        'gold': '#FFAA00',
        'gray': '#AAAAAA',
        'dark_gray': '#555555',
        'blue': '#5555FF',
        'green': '#55FF55',
        'aqua': '#55FFFF',
        'red': '#FF5555',
        'light_purple': '#FF55FF',
        'yellow': '#FFFF55',
        'white': '#FFFFFF',
    },
    tellraw: {
        prefix: "/tellraw @a ",
        json: [
            {"text": "[D] ", "color": "blue"},
            {
                "text": "$user",
                "color": "$color",
                "hoverEvent": {"action":"show_text","value":[{"text":"$tag"}]}
            },
            {"text": ": ", "color": "white"},
            {"text": "", "color": "white"}
        ],
        set: {
            userDisplay: '1.text',
            userTag: '1.hoverEvent.value.0.text',
            userColor: '1.color',
            message: '3.text'
        }
    }
}

module.exports = (config) => Object.assign(consts, config);
