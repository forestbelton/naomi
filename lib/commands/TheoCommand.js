import Command from './Command'

const fs = require('fs')
const quotes = fs.readFileSync('data/theo.txt').toString().split('\n')

const randTheo = ({ message }) => {
    const quote = quotes[Math.floor(Math.random()*quotes.length)]

    message.channel.send(quote)
}

module.exports = new Command({
    name: 'theo',
    command: randTheo
})

