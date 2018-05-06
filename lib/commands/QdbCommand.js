import Command from './Command'
import { getRandomQuote, addQuote, removeQuote } from '../query/qdb'

const randomQdb = ({ logger, kdb, message }) => {
    getRandomQuote(kdb)
        .then(row => message.reply(`[#${row.id} ${row.upvotes}/${row.downvotes}] - ${row.content}`))
        .catch(error => {
            logger.error(error.toString())
            message.reply('I could not find any quotes.')
        })
}

const addQdb = ({ kdb, logger, message }, quote) => {
    const author = `${message.author.username}#${message.author.discriminator}`

    addQuote(kdb)({ quote, author })
        .then(() => message.reply('the quote has been successfully added.'))
        .catch(error => {
            logger.error(error.toString())
            message.reply('I could not add the quote to the database.')
        })
}

const removeQdb = ({ logger, kdb, message }, id) => {
    removeQuote(kdb)(id)
        .then(() => message.reply('the quote has been removed.'))
        .catch(error => {
            logger.error(error.toString())
            message.reply('I could not remove a quote with that ID.')
        })
}

module.exports = new Command({
    name: 'qdb',
    command: randomQdb,
    subcommands: {
        random: randomQdb,
        add: addQdb,
        remove: removeQdb
    }
})
