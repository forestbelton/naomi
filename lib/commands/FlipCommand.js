import Command from './Command'
import { findById } from '../query/user'
import { giveBucksById } from '../util/caseBucks'

const flipCoin = () => Math.floor(Math.random() * 2) == 0
    ? 'heads'
    : 'tails'

const normalFlip = ({ message }) => {
    const coin = flipCoin()
    message.reply(`the coin was ${coin}.`)
}

const bettingFlip = ({ kdb, logger, message }, data) => {
    message.reply('this command is temporarily disabled.')
    return

    const match = data.match(/^(heads|tails) <@!?([0-9]+)>$/)
    if (match == null) {
        message.reply('please format your message correctly.')
        return
    }

    const [ _, bet, userId ] = match

    findById(kdb)(message.author.id)
        .then(self => {
            if (self.balance == 0) {
                message.reply('you do not have enough for this bet.')
                return
            }

            return findById(kdb)(userId)
                .then(other => {
                    if (other.balance == 0) {
                        message.reply(`<@${userId}> does not have enough for this bet.`)
                        return
                    }

                    const coin = flipCoin()
                    const selfWon = bet === coin

                    const winner = selfWon ? message.author.id : userId
                    const loser = selfWon ? userId : message.author.id

                    return giveBucksById({ kdb, logger, user: winner, amount: 1, reason: 'WON_COIN_FLIP' })
                        .then(() => giveBucksById({ kdb, logger, user: loser, amount: -1, reason: 'LOST_COIN_FLIP' }))
                        .then(() => message.reply(`the coin was ${coin}! <@${winner}> won the bet.`))
                })
        })
        .catch(error => {
            logger.error(error.toString())
            message.reply('I had trouble performing the coin flip bet.')
        })
}

module.exports = new Command({
    name: 'flip',
    command: normalFlip,
    subcommands: {
        normal: normalFlip,
        bet: bettingFlip
    }
})
