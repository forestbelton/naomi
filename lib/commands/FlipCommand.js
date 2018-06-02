import Command from './Command'

module.exports = new Command({
    name: 'flip',
    command: ({ message }) => {
        const coin = Math.floor(Math.random() * 2) == 0
            ? 'heads'
            : 'tails'

        message.reply(`the coin was ${coin}.`)
    }
})
