import Command from './Command'
import { createUser, getUsers, removeUser, findById } from '../query/user'

const add = ({ client, kdb, logger, message }, user) => {
    const match = user.match(/^<@!?([0-9]+)>$/)
    const user_id = match && match[1]

    if (!user_id) {
        message.reply('give me a valid user.')
        return
    }

    client.fetchUser(user_id)
        .then(user => {
            const discord_name = `${user.username}#${user.discriminator}`
            return createUser(kdb)({ discord_id: user.id, discord_name })
        })
        .then(() => message.reply(`I've added ${user} as an admin.`))
        .catch(err => {
            logger.error(err.toString())
            message.reply(`I could not add ${user}.`)
        })
}

const info = ({ kdb, logger, message }, user) => {
    let id = message.author.id

    if (user !== '') {
        const match = user.match(/^<@!?([0-9]+)>$/)
        id = match && match[1]
    }

    findById(kdb)(id)
    .then(user => {
        if (typeof user === 'undefined') {
            message.reply('I don\'t know anything about that user.')
            return
        }

        const fieldDetails = [
            `Balance: ${user.balance}`
        ]

        message.reply(`here's what I know about <@${id}>: ` + '```' + fieldDetails.join('\n') + '```')
    })
    .catch(err => {
        logger.error(err.toString())
        message.reply('I don\'t know anything about that user.')
    })
}

const list = ({ kdb, logger, message}) => {
    getUsers(kdb)
        .then(users => {
            const userNames = users.map(({ discord_id }) => `<@${discord_id}>`).join(', ')
            message.reply(`I know about the following users: ${userNames}`)
        })
        .catch(err => {
            logger.error(err.toString())
            message.reply('I had trouble with that.')
        })
}

const remove = ({ kdb, message, config }, user) => {
    const author = message.author.username
    if (author !== config.owner) {
        message.reply('you are not allowed to do that.')
        return
    }

    const match = user.match(/^<@!?([0-9]+)>$/)
    const user_id = match && match[1]

    if (!user_id) {
        message.reply('give me a valid user.')
        return
    }

    removeUser(kdb)({ discord_id: user_id })
        .then(() => message.reply(`I've removed ${user} as an admin.`))
        .catch(() => message.reply(`I could not remove ${user}.`))
}

module.exports = new Command({
    name: 'user',
    command: info,
    subcommands: {
        add,
        list,
        info,
        remove
    }
})
