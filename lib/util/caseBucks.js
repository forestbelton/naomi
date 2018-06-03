import { addPayoutEvent, findById, findByName, updateBalance } from '../query/user'

export const Reason = {
    BLACKJACK: 'BLACKJACK',
    LOYALTY: 'LOYALTY'
}

export const giveBucksById = context => {
    const { kdb, logger, user, amount, reason } = context

    findById(kdb)(user)
        .then(user => Promise.all([
            updateBalance(kdb)({ user, balance: user.balance + amount }),
            addPayoutEvent(kdb)({ user, amount, reason })
        ]))
        .catch(err => logger.error(err.toString()))
}

export const giveBucks = context => {
    const { kdb, logger, user, amount, reason } = context

    findByName(kdb)(user)
        .then(user => Promise.all([
            updateBalance(kdb)({ user, balance: user.balance + amount }),
            addPayoutEvent(kdb)({ user, amount, reason })
        ]))
        .catch(err => logger.error(err.toString()))
}
