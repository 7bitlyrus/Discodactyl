// If you are looking to modify your config, edit/create config.json instead of editing this file.
const user = require('./config.json')
const deepmerge = require('deepmerge');

const defaults = {
    "pterodactyl": {
        "daemon": undefined,
        "server": undefined,
        "token": undefined,
        "status_texts": ['offline', 'online', 'starting', 'stopping']
     },
     "discord": {
        "token": undefined,
        "channels": {
            "chat": undefined,
            "log": undefined
        },
        "webhook": {
            "id": undefined,
            "token": undefined
        }
     },
     "memlimit": {
        "enabled": false,
        "limit": 0.95,
        "msg": "Server restarting to prevent instability in 15 seconds!",
        "delay": 15
     },
     "bridge": {
         "updateInterval": 2000,
         "webhook": {
            "userCacheTime": 3600,
            "avatarApi": "https://crafatar.com/avatars/$UUID"
         },
         "minecraft": {
            "version": "release",
            "colors": {
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
            "info_regex": /^\[.+] \[Server thread\/INFO]: (.+)$/,
            "lang_action_regex": /^(death|multiplayer\.player|chat\.type\.advancement)\..+$/,
            "action_blacklist_str": 'died, message:',
            "tellraw": {
                "prefix": "/tellraw @a ",
                "json": [
                    {"text": "[D] ", "color": "blue"},
                    {
                        "text": "",
                        "color": "",
                        "clickEvent": {"action": "suggest_command","value": ""},
                        "hoverEvent": {"action":"show_text","value":[{"text":""},{"text":"\n"},{"text":""}]}
                    },
                    {"text": ": ", "color": "white"},
                    {"text": "", "color": "white"}
                ],
                "set": {
                    "userColor": '1.color',
                    "userDisplay": '1.text',
                    "userId": '1.hoverEvent.value.2.text',
                    "userMention": '1.clickEvent.value',
                    "userTag": '1.hoverEvent.value.0.text',
                    "message": '3.text'
                }
            }
         }
     }
}

const config = deepmerge(defaults, user);

// https://stackoverflow.com/a/46818701
config._leaf = (obj, path, value) => {
    const pList = path.split('.');
    const key = pList.pop();
    const pointer = pList.reduce((accumulator, currentValue) => {
      if (accumulator[currentValue] === undefined) accumulator[currentValue] = {};
      return accumulator[currentValue];
    }, obj);
    pointer[key] = value;
    return obj;
}

module.exports = config
