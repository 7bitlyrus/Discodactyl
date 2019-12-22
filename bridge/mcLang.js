const rp = require('request-promise-native')
const fs = require('fs')
const AdmZip = require('adm-zip')

module.exports = (config) => new Promise((resolve) => init(config, resolve))

async function init(config, resolve) {
    const lang = fs.existsSync('lang.json') ? require('../lang.json') : {}

    const ver = config.bridge.minecraft.version
    if(ver.toLowerCase() == 'release' || ver.toLowerCase() == 'snapshot' || lang.version != ver) {
        await download(ver, lang)
    }
    /*let strs = []
    Object.keys(obj).forEach(function(key) {

        console.log(key, obj[key]);
      
    });*/

    return resolve({
        ready: true,
        chat: {
            txt: toRegex(lang['chat.type.text']),
            me:  toRegex(lang['chat.type.emote']),
            say: toRegex(lang['chat.type.announcement'])
        }
    })
}

async function download(ver, curlang, cb) {
    console.log('[MCLANG] Downloading manifest...')
    const data = await rp({
        uri: 'https://launchermeta.mojang.com/mc/game/version_manifest.json',
        json: true
    })

    const versionId   = ver.toLowerCase() == 'release' ? data.latest.release :
    ver.toLowerCase() == 'snapshot' ? data.latest.snapshot : ver.toLowerCase()
    if(versionId == curlang.version) {
        console.log('[MCLANG] No version change, ignoring.')
        return curlang
    }
    const versionInfo = data.versions.find(e => e.id == versionId) || data.versions[0];

    console.log('[MCLANG] Downloading JAR...')
    const version   = await rp({uri: versionInfo.url, json: true})
    const serverJar = await rp({uri: version.downloads.server.url, encoding: null})

    console.log('[MCLANG] Extracting language file...')
    const zip = new AdmZip(serverJar);
    const txt = zip.readAsText("assets/minecraft/lang/en_us.json");

    console.log('[MCLANG] Writing language file...')
    const lang = JSON.parse(txt)
    lang.version = versionId
    const json = JSON.stringify(lang);
    fs.writeFileSync('lang.json', json);

    console.log('[MCLANG] Done.')
    return lang
}

function toRegex(str) {
    return new RegExp(str
        .replace(/%(\d\$)?s/g, '\uE621') // private use char so it doesn't get escaped
        .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
        .replace(/\uE621/g, '(.+?)')
        .replace(/^/, '^')
        .replace(/$/, '$'))
}
