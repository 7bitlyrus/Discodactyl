const rp = require('request-promise-native')
const fs = require('fs')
const AdmZip = require('adm-zip')

module.exports = (config) => new Promise((resolve) => init(config, resolve))

async function init(config, resolve) {
    const lang = fs.existsSync('lang.json') ? require('../lang.json') : {}
    let clang

    console.log('[mclang] Checking version...')
    const ver = config.bridge.minecraft.version
    if(ver.toLowerCase() == 'release' || ver.toLowerCase() == 'snapshot' || lang.version != ver) {
        clang = await download(ver, lang)
    } else {
        console.log('[mclang] No version change.')
        clang = lang
    }

    console.log('[mclang] Building regex...')
    let regs = []
    Object.keys(clang).forEach((key) => {
        if(key.match(config.bridge.minecraft.lang_action_regex)) regs.push(toRegex(clang[key]))
    })
    const regexs = regs.filter((elem, pos) => regs.indexOf(elem) == pos)
    console.log('[mclang] Done.')

    return resolve({
        ready: true,
        regexs,
        chat: {
            txt: toRegex(clang['chat.type.text']),
            me:  toRegex(clang['chat.type.emote']),
            say: toRegex(clang['chat.type.announcement'])
        }
    })
}

async function download(ver, curlang, cb) {
    console.log('[mclang] Downloading version manifest...')
    const data = await rp({
        uri: 'https://launchermeta.mojang.com/mc/game/version_manifest.json',
        json: true
    })

    const versionId   = ver.toLowerCase() == 'release' ? data.latest.release :
    ver.toLowerCase() == 'snapshot' ? data.latest.snapshot : ver.toLowerCase()
    if(versionId == curlang.version) {
        console.log('[mclang] No version change via manifest.')
        return curlang
    }
    const versionInfo = data.versions.find(e => e.id == versionId) || data.versions[0];

    console.log('[mclang] Downloading JAR...')
    const version   = await rp({uri: versionInfo.url, json: true})
    const serverJar = await rp({uri: version.downloads.server.url, encoding: null})

    console.log('[mclang] Extracting language file...')
    const zip = new AdmZip(serverJar);
    const txt = zip.readAsText("assets/minecraft/lang/en_us.json");

    console.log('[MCLANG] Writing language file...')
    const lang = JSON.parse(txt)
    lang.version = versionId
    const json = JSON.stringify(lang);
    fs.writeFileSync('lang.json', json);

    console.log('[MCLANG] Write completed.')
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
