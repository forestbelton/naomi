const Command = require('./Command')

const sourceCodePath = 'https://github.com/forestbelton/naomi'

module.exports = new Command({
    name: 'source',
    command: context => {
        const { message } = context
        message.reply(`my source code is located at ${sourceCodePath}.`)
    }
})