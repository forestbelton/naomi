const Command = require('./Command')

module.exports = new Command({
    name: 'help',
    command: context => {
        const { message } = context
        const names = context.commands.map(command => '* ' + command.name).join('\n')
        message.reply('the available commands are:\n' + names)
    }
})
