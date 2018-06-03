import Command from './Command'
import { findById } from '../query/user'
import { giveBucksById } from '../util/caseBucks'

const tipUser = ({ kdb, logger, message }, user) => {
    const match = user.match(/^<@!?([0-9]+)>$/)
    const user_id = match && match[1]

    if (!user_id) {
        message.reply('give me a valid user.')
        return
    }

    findById(message.author.id)
        .then(tipper => {
            if (tipper.balance == 0) {
                message.reply('you don\'t have enough to tip with.')
                return
            }

            return giveBucksById({ kdb, logger, user: user_id, amount: 1, reason: 'TIP' })
                .then(() => giveBucksById({ kdb, logger, user: message.author.id, amount: -1, reason: 'TIPPER' }))
        })
        .catch(error => {
            logger.error(error.toString())
            message.reply('I had trouble with that.')
        })
}

module.exports = new Command({
    name: 'tip',
    command: tipUser
})

