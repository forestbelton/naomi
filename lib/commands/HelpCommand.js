import Command from './Command'

module.exports = new Command({
    name: 'help',
    command: ({ message, commands }) => {
        const names = commands.map(command => {
            const list = ` (${Object.keys(command.subcommands).join(', ')})`
            return '* ' + command.name + (list === ' ()' ? '' : list)
        }).join('\n')

        message.reply('the available commands are:\n```' + names + '```')
    }
})
