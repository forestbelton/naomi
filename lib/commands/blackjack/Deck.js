import { allSuits, allRanks } from './Types'

export default class Deck {
    constructor() {
        this.cards = []

        for (const suit of allSuits) {
            for (const rank of allRanks) {
                this.cards.push({ suit, rank })
            }
        }

        // Shuffle deck
        for (let i = 0; i < this.cards.length - 1; ++i) {
            const j = Math.floor(Math.random() * (this.cards.length - i)) + i

            const card = this.cards[i]
            this.cards[i] = this.cards[j]
            this.cards[j] = card
        }
    }

    isEmpty() {
        return this.cards.length === 0
    }

    drawCard() {
        return this.cards.pop()
    }
}
