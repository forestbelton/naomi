export default class Command {
    constructor({ name, command, subcommands }) {
        this.name = name || ''
        this.command = command || (() => {})
        this.subcommands = subcommands || {}
    }

    resolve(context, message) {
        const [command, ...args] = message.split(' ')

        if (command !== '!' + this.name) {
            return
        }

        if (args.length > 1) {
            const [name, ...rest] = args

            if (typeof this.subcommands[name] === 'function') {
                this.subcommands[name](context, rest.join(' '))
                return
            }
        }

        this.command(context, args.join(' '))
    }
}
