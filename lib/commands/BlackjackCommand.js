import Command from './Command'
import Game from './blackjack/Game'
import { GameState, Move, Player, Suit } from './blackjack/Types'

const getUser = message => `${message.author.username}#${message.author.discriminator}`

const start = ({ state, message }) => {
    const user = getUser(message)

    if (typeof state.blackjackGames[user] !== 'undefined') {
        message.reply("you're already playing a game.")
        return
    }

    state.blackjackGames[user] = new Game()
    const [ firstCard, secondCard ] = state.blackjackGames[user].playerHands[Player.PLAYER].map(formatCard)
    message.reply(`a game has been started. You have ${firstCard} and ${secondCard}.`)
}

const status = ({ state, message }) => {
    const user = getUser(message)
    const game = state.blackjackGames[user]

    if (typeof game === 'undefined') {
        message.reply("you're not playing a game.")
        return
    }

    const yourHand = game.playerHands[Player.PLAYER].map(formatCard).join(', ')
    const yourScore = game.handScore(game.playerHands[Player.PLAYER])

    let dealerHand = game.playerHands[Player.DEALER].slice(2).map(formatCard).join(', ')
    dealerHand = dealerHand ? ` and ${dealerHand}` : dealerHand

    message.reply(`You have: ${yourHand} (${yourScore})\nThe dealer has: 2 face-down cards${dealerHand}`)
}

const scores = ({ db, logger, message }) => {
    db.all('SELECT user, SUM(win) AS wins, SUM(lose) AS losses, SUM(win) - SUM(lose) AS score FROM blackjack_scores GROUP BY user ORDER BY score DESC LIMIT 5', (err, rows) => {
        if (err) {
            logger.error(err.toString())
            message.reply('I had trouble with that.')
            return
        }

        const maxScoreLength = rows[0].score.toString().length + 1
        const leftPad = num => Array(maxScoreLength - num.toString().length + 1).join(' ') + num

        const reply = 'the high scores for blackjack are: ```'
            + rows.map(({ user, wins, losses, score }, i) => `${i + 1}. [${leftPad(score)}] ${user} (${wins} wins, ${losses} losses)`).join('\n')
            + '\n```'

        message.reply(reply)
    })
}

const playerMove = move => ({ db, logger, message, state }) => {
    const user = getUser(message)
    const game = state.blackjackGames[user]

    if (typeof game === 'undefined') {
        message.reply("you're not playing a game.")
        return
    }

    const dealerCardCount = game.playerHands[Player.DEALER].length

    game.playerMove(move)
    const messages = []

    const playerHand = game.playerHands[Player.PLAYER]
    const lastCard = playerHand[playerHand.length - 1]

    if (move === Move.HIT) {
        messages.push(`you drew ${formatCard(lastCard)}.`)
    } else {
        messages.push('you passed.')
    }

    game.playerHands[Player.DEALER]
        .slice(dealerCardCount)
        .forEach(card => messages.push(`The dealer drew ${formatCard(card)}.`))

    const gameState = game.state()
    switch (gameState) {
        case GameState.WON:
            if (game.losingHand(game.playerHands[Player.DEALER])) {
                messages.push('The dealer busted!')
            }

            if (game.playerHands[Player.DEALER].length === dealerCardCount) {
                messages.push('The dealer passed.')
            }

            messages.push('You won the game!')

            db.run('INSERT INTO blackjack_scores (user, win) VALUES (?, ?)', [user, 1], err => {
                if (err) {
                    logger.error(err.toString())
                }
            })

            delete state.blackjackGames[user]
            break

        case GameState.LOST:
            if (game.losingHand(playerHand)) {
                messages.push('You busted! You lost.')
            } else {
                if (game.playerHands[Player.DEALER].length === dealerCardCount) {
                    messages.push('The dealer passed.')
                }

                messages.push('You lost! The dealer had a higher score.')
            }

            db.run('INSERT INTO blackjack_scores (user, lose) VALUES (?, ?)', [user, 1], err => {
                if (err) {
                    logger.error(err.toString())
                }
            })

            delete state.blackjackGames[user]
            break

        case GameState.IN_PLAY:
            messages.push('It is still your turn.')
            break
    }

    message.reply(messages.join(' '))
}

const formatCard = ({ suit, rank }) => {
    const suitEmojis = {
        [Suit.HEARTS]: ':hearts:',
        [Suit.SPADES]: ':spades:',
        [Suit.CLUBS]: ':clubs:',
        [Suit.DIAMONDS]: ':diamonds:'
    }

    return `[${suitEmojis[suit]} ${rank}]`
}

module.exports = new Command({
    name: 'blackjack',
    command: start,
    subcommands: {
        start,
        status,
        scores,
        hit: playerMove(Move.HIT),
        pass: playerMove(Move.PASS),
    }
})
