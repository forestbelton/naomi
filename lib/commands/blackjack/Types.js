export const Player = {
    PLAYER: 'PLAYER',
    DEALER: 'DEALER'
}

export const Suit = {
    HEARTS: 'HEARTS',
    SPADES: 'SPADES',
    CLUBS: 'CLUBS',
    DIAMONDS: 'DIAMONDS'
}

export const Move = {
    HIT: 'HIT',
    PASS: 'PASS'
}

export const GameState = {
    WON: 'WON',
    LOST: 'LOST',
    IN_PLAY: 'IN_PLAY'
}

export const allSuits = [Suit.HEARTS, Suit.SPADES, Suit.CLUBS, Suit.DIAMONDS]
export const allRanks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']

export const cardValue = ({ rank }) => {
    const faceValues = {
        J: 10,
        Q: 10,
        K: 10
    }

    return faceValues[rank] || rank
}
