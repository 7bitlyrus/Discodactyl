# Discodactyl
Discord to Minecraft chat bridge via Pterodactyl Panel

## Config
<!-- All example tokens/uuids/snowflakes are random and hopefully invalid. -->
The `config.js` file contains the default configuration items in the `defaults` variable. You can override/specify a config value by creating a `config.json` file. 

Here is an example `config.json`.
```json
{
     "pterodactyl": {
        "daemon": "https://daemon.example.com:8080",
        "server": "deadbeef-0000-4472-bd68-cc294bc567df",
        "token": "i_example0005iHmKhvxt4ql61f5UNtemRjTPRCePg"
     },
     "discord": {
        "token": "example000H5s06c098kGQsz.JLuAxj.Jmh1elE5msALOBHXcp391LFYa97",
        "channels": {
            "chat": "123400002247250384",
            "log": "123400007107437166"
        },
        "webhook": {
            "id": "123400007866161919",
            "token": "example-yV5XDxrKE3GDhQOjKH_5RMFqSzQCEt6G7x5gIO3PQK4JANb2MWUPlQzmhAjD"
        }
     },
     "memlimit": {
        "limit": 0.95,
        "enabled": true
     }
}
```

### Pterodactyl Daemon Parameters
This project used an undocumented panel API, and not the offical Pterodactyl API. As such, api access has a few issues with authentication. Namely, you must be Developer Tools to get the Daemon Parameters and **the secret token will change after each panel restart.**

To get the required parameters, open the console webpage and run the following javascipt in your browser console to return these parameters. If you rather do it yourself, these values are found in the first `<script>` tag in the `<head>` of the page.

```js
console.log({
  daemon: `${Pterodactyl.node.scheme}://${Pterodactyl.node.fqdn}:${Pterodactyl.node.daemonListen}`,
  server: Pterodactyl.server.uuid,
  token: Pterodactyl.server_token
})
```
