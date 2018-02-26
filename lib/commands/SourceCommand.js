import Command from './Command'

const sourceCodePath = 'https://github.com/forestbelton/naomi'

module.exports = new Command({
    name: 'source',
    command: ({ message }) => {
        message.reply(`my source code is located at ${sourceCodePath}.`)
    }
})
