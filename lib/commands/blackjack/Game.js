import Deck from './Deck'
import { cardValue, Move, Player, GameState } from './Types'

export default class Game {

    constructor() {
        this.deck = new Deck()
        this.done = false
        this.playerHands = {
            [Player.PLAYER]: [],
            [Player.DEALER]: []
        }

        for (let i = 0; i < 2; ++i) {
            this.dealCardTo(Player.PLAYER)
            this.dealCardTo(Player.DEALER)
        }
    }

    playerMove(moveType) {
        if (this.state() !== GameState.IN_PLAY) {
            return
        }

        const moveHandlers = {
            [Move.HIT]: this.hitMove.bind(this),
            [Move.PASS]: this.dealerMove.bind(this)
        }

        moveHandlers[moveType]()
    }

    hitMove() {
        if (this.deck.isEmpty()) {
            return
        }

        this.dealCardTo(Player.PLAYER)

        // Dealer gets extra turn
        if (this.state() === GameState.WON) {
            this.dealerMove()
        }
    }

    dealerMove() {
        while (this.handScore(this.playerHands[Player.DEALER]) < 17) {
            this.dealCardTo(Player.DEALER)
        }

        this.done = true
    }

    winningHand(hand) {
        return this.handScore(hand) === 21 ||
            (this.handScore(hand) <= 21 && hand.length >= 5)
    }

    losingHand(hand) {
        return this.handScore(hand) > 21
    }

    handScore(hand) {
        let scores = [0]

        for (let card of hand) {
            if (card.rank === 'A') {
                const with1 = scores.map(score => score + 1)
                const with11 = scores.map(score => score + 11)
                scores = with1.concat(with11)
            } else {
                const value = cardValue(card)
                scores = scores.map(score => score + value)
            }
        }

        scores.sort((a, b) => b - a)

        const inPlayScores = scores
            .filter(score => score <= 21)

        return inPlayScores.length === 0
            ? scores[0]
            : inPlayScores[0]
    }

    dealCardTo(player) {
        if (this.deck.isEmpty()) {
            return
        }

        const card = this.deck.drawCard()
        this.playerHands[player].push(card)
    }

    state() {
        const checkStates = [
            {
                check: () => this.winningHand(this.playerHands[Player.DEALER]) || this.losingHand(this.playerHands[Player.PLAYER]),
                state: GameState.LOST
            },
            {
                check: () => this.winningHand(this.playerHands[Player.PLAYER]) || this.losingHand(this.playerHands[Player.DEALER]),
                state: GameState.WON
            },
            {
                check: () => this.done && this.handScore(this.playerHands[Player.PLAYER]) > this.handScore(this.playerHands[Player.DEALER]),
                state: GameState.WON
            },
            {
                check: () => this.done,
                state: GameState.LOST
            },
            {
                check: () => true,
                state: GameState.IN_PLAY
            }
        ]

        return checkStates
            .find(({ check }) => check())
            .state
    }
}