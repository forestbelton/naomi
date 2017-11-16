const Discord = require('discord.js')
const winston = require('winston')
const util = require('util')

const config = require('./config.json')
const MessageHandlers = require('./lib/MessageHandlers')

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'output.log' })
    ]
})

const client = new Discord.Client()
const appToken = process.env.APP_TOKEN

if (typeof appToken === 'undefined') {
    throw new Error('Please specify an application token via the `APP_TOKEN\''
        + ' environment variable')
}

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}`)
})

client.on('message', message => {
    const { content } = message
    const { username, discriminator } = message.author

    logger.info(`${username}#${discriminator}> ${content}`)
    const match = content.match(/^!([^ ]+) *(.*)$/)
    if (null === match) {
        return
    }

    const name = match[1]
    const data = match[2]

    if (typeof MessageHandlers[name] !== 'function') {
        message.reply(`Unknown command: ${name}`)
        return
    }

    const isAuthorized = config.authorizedUsers.some(user =>
        user.username === username && user.discriminator === discriminator
    )

    if (!isAuthorized) {
        message.reply('You are not authorized to do that')
        return
    }

    MessageHandlers[name]({
        client,
        logger,
        message,
        data,
        MessageHandlers
    })
})

process.on('SIGINT', () => {
    logger.info('Received CTRL-C, shutting down...')
    client.destroy().then(process.exit)
})

client.login(appToken)
