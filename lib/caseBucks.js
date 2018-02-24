export const giveBucks = ({ db, logger, user, amount }) => {
    db.get('SELECT * FROM user_casebucks WHERE user = ?', [user], (err, row) => {
        if (err) {
            logger.error(err.toString())
            return
        } else if (!row) {
            db.run('INSERT INTO user_casebucks (user) VALUES (?)', [user], err => {
                if (err) {
                    logger.error('Error creating new user balance')
                    logger.error(err.toString())
                    return
                }

                updateBucks({ db, logger, user, amount })
            })
        } else {
            updateBucks({ db, logger, user, amount })
        }
    })
}

const updateBucks = ({ db, logger, user, amount }) => {
    db.run('UPDATE user_casebucks SET balance = balance + ? WHERE user = ?', [amount, user], err => {
        if (err) {
            logger.error('Error updating user balance')
            logger.error(err.toString())
        }

        logger.info(`Gave user ${user} ${amount} casebucks.`)
    })
}
