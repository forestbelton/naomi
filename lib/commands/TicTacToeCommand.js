import Command from './Command'

const X_TURN = 0
const O_TURN = 1
const GAME_END = 2

const board = [
    [':white_large_square:', ':white_large_square:', ':white_large_square:'],
    [':white_large_square:', ':white_large_square:', ':white_large_square:'],
    [':white_large_square:', ':white_large_square:', ':white_large_square:']
]

const emojis = [
    "\u2196", // Top left
    "\u2B06", // Top
    "\u2197", // Top right
    "\u2B05", // Left
    "\u23FA", // Middle
    "\u27A1", // Right
    "\u2199", // Bottom left
    "\u2B07", // Bottom
    "\u2198"  // Bottom right
]

function checkMove(emoji) {
    for (let i=0; i < emojis.length; i++)
        if (emojis[i] = emoji)
            return i
    return -1
}

function hasPlayerWon(player) {
    if (board[0][0] === player && board[1][0] === player && board[2][0] === player) { // row left up/down
        return true;
    } else if (board[0][0] === player && board[0][1] === player && board[0][2] === player) { // row top left/right
        return true;
    } else if (board[0][1] === player && board[1][1] === player && board[2][1] === player) { // row middle up/down
        return true;
    } else if (board[0][2] === player && board[1][2] === player && board[2][2] === player) { // row right up/down
        return true;
    } else if (board[1][0] === player && board[1][1] === player && board[1][2] === player) { // row middle left/right
        return true;
    } else if (board[2][0] === player && board[2][1] === player && board[2][2] === player) { // row bottom left/right
        return true;
    } else if (board[0][0] === player && board[1][1] === player && board[2][2] === player) { // row diagnonal top left/bottom right
        return true;
    } else if (board[0][2] === player && board[1][1] === player && board[2][0] === player) { // diagonal bottome left/top right
        return true;
    } else {
        return false;
    }
}

function isBoardFull() {
    let string = ':white_large_square:';
    for (let i=0; i < board.length; i++) {
        for (let k=0; k < board[i].length; k++) {
            if (board[i][k] === string) {
                return false;
            }
        }
    }
    return true;
}

function resetBoard() {
    for (let i=0; i < board.length; i++) {
        for (let k=0; k < board[i].length; k++) {
            board[i][k] = ':white_large_square:'
        }
    }
}

const startGame = ({ message }, move) => {
        move = move.split('')
        let player = move[0]
        let a = move[1]
        let b = move[2]

        let gameStatus = X_TURN

        if (gameStatus != GAME_END) {
            if (player === 'x') {
                board[a][b] = ':regional_indicator_x:'
                message.channel.send(board)
                if (hasPlayerWon(':regional_indicator_x:')) {
                    message.channel.send('Player X has won!')
                    resetBoard()
                } else {
                    if (isBoardFull()) {
                        board[a][b] = ':regional_indicator_x:'
                        message.channel.send('Draw!')
                        resetBoard()
                    } else {
                        board[a][b] = ':regional_indicator_x:'
                        gameStatus == O_TURN
                    }
                }
            } else if (player === 'o') {
                board[a][b] = ':o2:'
                message.channel.send(board)
                if (hasPlayerWon(':o2:')) {
                    message.channel.send('Player O has won!')
                    resetBoard()
               } else {
                    gameStatus == X_TURN
                }
            }
        }

//            for (let i in emojis) {
//                message.react(emojis[i])
//                let reaction = await message.react(emojis[i])
//            }
//        })
}


module.exports = new Command({
    name: 'tictactoe',
    command: startGame
})
