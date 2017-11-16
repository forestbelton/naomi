module.exports = function(context) {
    const { logger, client, message } = context

    logger.info('Shutting down...')
    message.reply('Goodbye my sweet prince')
        .then(() => client.destroy())
        .then(process.exit)
}