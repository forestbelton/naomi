import Command from './Command'

const fs = require('fs')
const wisdom = fs.readFileSync('data/wow.txt').toString().split('\n')

const randWow = ({ message }) => {
    const quote = wisdom[Math.floor(Math.random()*wisdom.length)]

    message.channel.send(quote)
}

module.exports = new Command({
    name: 'wow',
    command: randWow
})

