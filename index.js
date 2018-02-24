import Discord from 'discord.js'
import sqlite3 from 'sqlite3'
import util from 'util'
import winston from 'winston'

const sqlite = sqlite3.verbose()

import Commands from './lib/Commands'

import config from './conf/app.json'
const db = new sqlite.Database(config.database)

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ colorize: true, timestamp: 'true' }),
        new (winston.transports.File)({ filename: 'output.log' })
    ]
})

const client = new Discord.Client()
const appToken = process.env.APP_TOKEN
const state = {
    blackjackGames: {}
}

if (typeof appToken === 'undefined') {
    throw new Error('Please specify an application token via the `APP_TOKEN\''
        + ' environment variable')
}

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}`)

    client.user.setGame(null)
})

client.on('message', message => {
    const { content } = message
    const { username, discriminator } = message.author
    const channel = message.channel === null ? 'private' : message.channel.id
    const server = message.guild === null ? 'private' : message.guild.name

    db.run('INSERT INTO messages (content, user, discriminator, channel, server) VALUES (?, ?, ?, ?, ?)', [content, username, discriminator, channel, server], err => {
        if (err) {
            logger.error(err.toString())
        }
    })

    logger.info(`${username}#${discriminator}> ${content}`)
    const match = content.match(/^!([^ ]+) *((.|[\r\n])*)$/)
    if (null === match) {
        return
    }

    const [_, name, data] = match

    const context = {
        client,
        logger,
        message,
        data,
        db,
        commands: Commands,
        config,
        state
    }

    const authorizedFromConfig = config.authorizedUsers.some(user =>
        user.username === username && user.discriminator === discriminator
    )

    if (!authorizedFromConfig) {
        db.get('SELECT id FROM admins WHERE user_id = ?', [message.author.id], (err, row) => {
            if (err || !row) {
                if (err) {
                    logger.error(err.toString())
                }

                message.reply('you are not authorized to do that.')
            } else {
                try {
                    Commands.forEach(command => command.resolve(context, content))
                } catch (e) {
                    logger.error(e.toString())
                    message.reply('I had trouble with that one.')
                }
            }
        })
    } else {
        try {
            Commands.forEach(command => command.resolve(context, content))
        } catch (e) {
            logger.error(e.stack)
            message.reply('I had trouble with that one.')
        }
    }
})

process.on('SIGINT', () => {
    logger.info('Received CTRL-C, shutting down...')
    client.destroy().then(process.exit)
})

client.login(appToken)
