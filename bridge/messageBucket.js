function Bucket(interval = 2000, monospace = false) {
    this._channel = undefined
    this._enabled = false

    this._interval  = interval
    this._monospace = monospace

    this.clear()
};

Bucket.prototype.addMessage = function(message) {
    if(!this._enabled) return

    this._messages.push(message)
    this._length += message.length + 1

    if(this._length > 1000) this.update()
}

Bucket.prototype.clear = function() {
    this._messages = []
    this._length = 0
}

Bucket.prototype.enable = function(channel) {
    this._channel = channel
    this._enabled = true
    setInterval(function(){ this.update() }.bind(this), this._interval)
}


Bucket.prototype.update = function () {
    if(this._enabled && this._messages.length > 0) {
        var str = this._messages.join('\n')

        if(this._monospace) str = '`' + str + '`'
        this._channel.send(str, {split: true}) // split just in case

        this.clear()
    }
}

module.exports = Bucket
