const Discord = require('discord.js')
const sqlite3 = require('sqlite3').verbose()
const util = require('util')
const winston = require('winston')

const Commands = require('./lib/Commands')
const MessageHandlers = require('./lib/MessageHandlers')

const config = require('./config.json')
const db = new sqlite3.Database(config.database)

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

    const isAuthorized = config.authorizedUsers.some(user =>
        user.username === username && user.discriminator === discriminator
    )

    if (!isAuthorized) {
        message.reply('You are not authorized to do that')
        return
    }

    const context = {
        client,
        logger,
        message,
        data,
        MessageHandlers,
        db
    }

    if (typeof MessageHandlers[name] !== 'undefined') {
        MessageHandlers[name](context)
    }

    Commands.forEach(command => command.resolve(context, content))
})

process.on('SIGINT', () => {
    logger.info('Received CTRL-C, shutting down...')
    client.destroy().then(process.exit)
})

client.login(appToken)
