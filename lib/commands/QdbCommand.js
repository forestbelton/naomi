import Command from './Command'

module.exports = new Command({
    name: 'qdb',
    command: randomQdb,
    subcommands: {
        random: randomQdb,
        add: addQdb,
        remove: removeQdb
    }
})

function randomQdb(context) {
    const { logger, db, message } = context

    db.get('SELECT * FROM qdb WHERE deleted = 0 ORDER BY RANDOM() LIMIT 1', (err, row) => {
        if (err || !row) {
            if (err) {
                logger.error(err.toString())
            }

            message.reply('I could not find any quotes.')
        } else {
            message.reply(`[#${row.id} ${row.upvotes}/${row.downvotes}] - ${row.content}`)
        }
    })
}

function addQdb(context, quote) {
    const { db, message } = context

    const author = `${message.author.username}#${message.author.discriminator}`
    db.run('INSERT INTO qdb (author, content) VALUES (?, ?)', [author, quote], err => {
        if (err) {
            message.reply('I could not add the quote to the database.')
        } else {
            message.reply('the quote has been successfully added.')
        }
    })
}

function removeQdb(context, id) {
    const { logger, db, message } = context

    logger.info(`Removing quote ${id}`)
    db.run('UPDATE qdb SET deleted = 1 where deleted = 0 and id = ?', [id], err => {
        if (err) {
            logger.error(err.toString())
        }

        message.reply(err ? 'I could not remove a quote with that ID.' : 'the quote has been removed.')
    })
}
