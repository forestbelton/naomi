import PromisedDatabase from './PromisedDatabase'

export const Reason = {
    BLACKJACK: 'BLACKJACK',
    LOYALTY: 'LOYALTY'
}

export const giveBucks = context => {
    const { db, logger, user } = context
    const pdb = new PromisedDatabase(db)

    return pdb.get('SELECT * FROM user_casebucks WHERE user = ?', [user])
        .then(() => updateBucks(context))
        .catch(err => {
            if (err === 'No row returned for query') {
                pdb.run('INSERT INTO user_casebucks (user) VALUES (?)', [user])
                    .then(() => updateBucks(context))
                    .catch(err => logger.error(err.toString()))
            } else {
                logger.error(err.toString())
            }
        })
}

const updateBucks = ({ db, logger, user, amount, reason }) => {
    const pdb = new PromisedDatabase(db)

    return pdb.run('UPDATE user_casebucks SET balance = balance + ? WHERE user = ?', [amount, user])
        .then(() => logger.info(`Gave user ${user} ${amount} casebucks.`))
        .then(() => pdb.run('INSERT INTO casebucks_events (user, amount, reason) VALUES (?, ?, ?)', [user, amount, reason]))
        .catch(err => {
            logger.error('Error updating user casebucks balance')
            logger.error(err.toString())
        })
}
