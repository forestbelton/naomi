function Command(options) {
    this.name = options.name || ''
    this.command = options.command || function() {}
    this.subcommands = options.subcommands || {}
}

Command.prototype.resolve = function(context, message) {
    const tokens = message.split(' ')

    if (tokens[0] !== '!' + this.name) {
        return
    }

    if (tokens.length > 1) {
        const name = tokens[1]

        if (typeof this.subcommands[name] === 'function') {
            const rest = tokens.slice(2).join(' ')
            this.subcommands[name](context, rest)
            return
        }
    }

    const rest = tokens.slice(1).join(' ')
    this.command(context, rest)
}

module.exports = Command