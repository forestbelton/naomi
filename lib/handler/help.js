module.exports = function(context) {
    const { MessageHandlers, message } = context
    const commands = Object.keys(MessageHandlers)
        .map(name => '* ' + name)
        .join('\n')

    message.reply('\nCommands:\n' + commands)
}