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

const proposeFlipBet = ({ message, state }, data) => {
    const match = data.match(/^(heads|tails) <@!?([0-9]+)>$/)
    if (match == null) {
        message.reply('please format your message correctly.')
        return
    }

    const [ _, bet, userId ] = match
    const { pendingCoinFlips } = state

    if (typeof pendingCoinFlips[userId] !== 'undefined'
            && typeof pendingCoinFlips[userId][message.author.id] !== 'undefined') {
        message.reply(`you already have a pending bet with <@${userId}>.`)
    }

    pendingCoinFlips[userId] = pendingCoinFlips[userId] || {}
    pendingCoinFlips[userId][message.author.id] = bet

    message.reply(`the bet has been placed. <@${userId}>, please reply with "!flip approve <@${message.author.id}>" in order to approve the bet.`)
}

const approveFlipBet = (context, user) => {
    const { message, state } = context
    const { pendingCoinFlips } = state

    const match = user.match(/^<@!?([0-9]+)>$/)
    const user_id = match && match[1]

    if (!user_id) {
        message.reply('give me a valid user.')
        return
    }

    const approvingUser = message.author.id
    const approvedUser = user_id

    if (typeof pendingCoinFlips[approvingUser] !== 'undefined'
        && typeof pendingCoinFlips[approvingUser][approvedUser] !== 'undefined') {
        const bet = pendingCoinFlips[approvingUser][approvedUser]
        delete pendingCoinFlips[approvingUser][approvedUser]

        performBet(context, approvingUser, approvedUser, bet)
    } else {
        message.reply('you don\'t have a pending bet with them.')
    }
}

const performBet = ({ kdb, logger, message }, selfUser, otherUser, bet) =>
    findById(kdb)(selfUser)
        .then(self => {
            if (self.balance == 0) {
                message.reply('you do not have enough for this bet.')
                return
            }

            return findById(kdb)(otherUser)
                .then(other => {
                    if (other.balance == 0) {
                        message.reply(`<@${otherUser}> does not have enough for this bet.`)
                        return
                    }

                    const coin = flipCoin()
                    const otherWon = bet === coin

                    const winner = otherWon ? otherUser : selfUser
                    const loser = otherWon ? selfUser : otherUser

                    return giveBucksById({ kdb, logger, user: winner, amount: 1, reason: 'WON_COIN_FLIP' })
                        .then(() => giveBucksById({ kdb, logger, user: loser, amount: -1, reason: 'LOST_COIN_FLIP' }))
                        .then(() => message.reply(`the coin was ${coin}! <@${winner}> won the bet.`))
                })
        })
        .catch(error => {
            logger.error(error.toString())
            message.reply('I had trouble performing the coin flip bet.')
        })

module.exports = new Command({
    name: 'flip',
    command: normalFlip,
    subcommands: {
        normal: normalFlip,
        bet: proposeFlipBet,
        approve: approveFlipBet
    }
})
