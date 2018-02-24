import Command from './Command'

module.exports = new Command({
    name: 'quit',
    command: function({ logger, client, message }) {
        logger.info('Shutting down...')
        message.reply('Goodbye my sweet prince')
            .then(() => client.destroy())
            .then(process.exit)
    }
})
