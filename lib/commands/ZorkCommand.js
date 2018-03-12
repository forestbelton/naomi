import Command from './Command'
import child_process from 'child_process'
import chunk from 'chunk-text'

const getUser = message =>
    `${message.author.username}#${message.author.discriminator}`

module.exports = new Command({
    name: 'zork',
    command: ({ message, state }, input) => {
        const user = getUser(message)

        if (typeof state.zorkGames[user] === 'undefined') {
            const game = child_process.spawn('zork', [])

            state.zorkGames[user] = {
                game,
                message
            }

            game.stdout.on('data', data => {
                const { message } = state.zorkGames[user]
                const chunks = chunk(data.toString().replace(/\n>/, ''), 1900)

                chunks.forEach(chunk =>
                    message.reply('```' + chunk + '```')
                )
            })
        } else {
            const { game } = state.zorkGames[user]

            state.zorkGames[user].message = message
            game.stdin.write(`${input}\n`)
        }
    }
})
