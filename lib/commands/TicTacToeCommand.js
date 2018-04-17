import Command from './Command'

class Game {
    constructor(playerOne, playerTwo) {
        this.playerOne = playerOne
        this.playerTwo = playerTwo
        this.currentPlayer = playerOne

        this.grid = [[], [], []]
        for (let y = 0; y < 3; ++y) {
            for (let x = 0; x < 3; ++x) {
                this.grid[y][x] = null
            }
        }
    }

    move(player, x, y) {
        if (player !== this.currentPlayer) {
            throw 'it is not currently your turn.'
        } else if (y < 0 || y > 2 || x < 0 || x > 2) {
            throw 'that move is out of bounds.'
        } else if (this.grid[y][x] !== null) {
            throw 'that tile has already been played.'
        }

        const tile = player === this.playerOne ? 'X' : 'O'
        this.grid[y][x] = tile
        this.currentPlayer = player === this.playerOne ? this.playerTwo : this.playerOne
    }

    showGrid() {
        let str = ''

        for (let y = 0; y < 3; ++y) {
            for (let x = 0; x < 3; ++x) {
                const cell = this.grid[y][x]
                const cellStr = cell === null ? ' ' : cell

                str += ' ' + cellStr + ' '
                if (x !== 2) {
                    str += '|'
                }
            }

            str += '\n'
            if (y !== 2) {
                str += '-----------\n'
            }
        }

        return str
    }

    state() {
        if (this.hasWon('X') || this.hasWon('O')) {
            return 'WON'
        }

        let hasStale = true
        for (let y = 0; y < 3; ++y) {
            for (let x = 0; x < 3; ++x) {
                hasStale &= this.grid[y][x] !== null
            }
        }

        return hasStale ? 'STALE' : 'INPLAY'
    }

    hasWon(tile) {
        let won = false

        // Check rows
        for (let y = 0; y < 3; ++y) {
            won = won || (this.grid[y][0] === tile && this.grid[y][1] === tile && this.grid[y][2] === tile)
        }

        // Check columns
        for (let x = 0; x < 3; ++x) {
            won = won || (this.grid[0][x] === tile && this.grid[1][x] === tile && this.grid[2][x] === tile)
        }

        // Check diagonals
        won = won || (this.grid[0][0] === tile && this.grid[1][1] === tile && this.grid[2][2] === tile)
        won = won || (this.grid[0][2] === tile && this.grid[1][1] === tile && this.grid[2][0] === tile)

        return won
    }
}

const start = ({ state, message }, otherPlayer) => {
    const { ticTacToeGames } = state

    if (!/^<@.*?>$/.test(otherPlayer)) {
        message.reply('you must start the game with another player.')
        return
    }

    const playerOne = message.author.id
    const playerTwo = otherPlayer.replace(/<@(.*?)>/, '$1')

    const existingGame = ticTacToeGames[playerOne]
        || ticTacToeGames[playerTwo]

    if (existingGame) {
        message.reply('it seems you are already in a game.')
        return
    }

    const game = new Game(playerOne, playerTwo)
    ticTacToeGames[playerOne] = game
    ticTacToeGames[playerTwo] = game

    message.reply(`the game has been started. It is <@${playerOne}>'s turn.`)
}

const forfeit = ({ state, message }) => {
    const { ticTacToeGames } = state
    const player = message.author.id

    const game = ticTacToeGames[player]
    if (!game) {
        message.reply('you aren\'t currently in a game.')
        return
    }

    delete ticTacToeGames[game.playerOne]
    delete ticTacToeGames[game.playerTwo]
    message.reply('you have forfeited the game.')
}

const movePattern = /^(\d+) (\d+)$/

const makeMove = ({ state, message }, move) => {
    const { ticTacToeGames } = state
    const player = message.author.id
    const game = ticTacToeGames[player]

    if (typeof game === 'undefined') {
        message.reply('you aren\'t currently in a game.')
        return
    }

    if (!movePattern.test(move)) {
        message.reply('I didn\'t understand the move you\'re trying to make.')
        return
    }

    const moves = move.match(movePattern).slice(1).map(x => parseInt(x, 10))

    try {
        game.move(player, moves[0], moves[1])
    } catch (e) {
        message.reply(e)
        return
    }

    const otherPlayer = game.playerOne === player
        ? game.playerTwo
        : game.playerOne

    switch (game.state()) {
    case 'INPLAY':
        message.reply(`you placed a tile. It is <@${otherPlayer}>'s turn.`)
        message.channel.send('```' + game.showGrid() + '```')
        break

    case 'WON':
        message.reply('you won!')
        delete ticTacToeGames[game.playerOne]
        delete ticTacToeGames[game.playerTwo]
        break

    case 'STALE':
        message.reply('there was a stalemate!')
        delete ticTacToeGames[game.playerOne]
        delete ticTacToeGames[game.playerTwo]
        break
    }
}

module.exports = new Command({
    name: 'tictactoe',
    command: start,
    subcommands: {
        start,
        forfeit,
        move: makeMove
    }
})
