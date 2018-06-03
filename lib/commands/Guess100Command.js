import Command from './Command'
import { giveBucksById } from '../util/caseBucks';

const INITIAL_GUESSES_LEFT = 3

module.exports = new Command({
    name: 'guess100',
    command: ({ message, state}, number) => {
        const { guess100Games } = state
        const game = guess100Games[message.author.id]

        // No guess, presumed game start
        if (number.trim() !== '') {
            if (typeof game !== 'undefined') {
                message.reply('you are already in a game. You have ${INITIAL_GUESSES_LEFT} guesses left. What is your guess?')
            } else {
                guess100Games[message.author.id] = {
                    number: Math.floor(Math.random() * 100) + 1,
                    left: INITIAL_GUESSES_LEFT
                }
                message.reply(`I'm thinking of a number between 1 and 100. You have ${INITIAL_GUESSES_LEFT} guesses left. What is your guess?`)
            }
        // Guess provided
        } else {
            if (typeof game === 'undefined') {
                message.reply('you\'re not in a game right now.')
            } else {
                const guess = parseInt(number.trim(), 10)
                const guessMatched = guess == game.number

                if (guessMatched) {
                    giveBucksById({ kdb, logger, user: message.author.id, amount: 1, reason: 'GUESS100' })
                        .then(() => message.reply('that\'s correct. You earned 1 casebucks!'))
                } else {
                    --game.left

                    const direction = guess > game.number ? 'high' : 'low'
                    const gameOver = game.left == 0
                    const trailingText = gameOver ? 'Game over!' : `You have ${game.left} guesses next.`

                    if (gameOver) {
                        delete guess100Games[message.author.id]
                    }

                    message.reply(`your guess was too ${direction}. ${trailingText}`)
                }
            }
        }
    }
})
