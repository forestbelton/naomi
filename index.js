const Discord = require('discord.js')
const sqlite3 = require('sqlite3').verbose()
const util = require('util')
const winston = require('winston')

const Commands = require('./lib/Commands')

const config = require('./conf/app.json')
const db = new sqlite3.Database(config.database)

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ colorize: true, timestamp: 'true' }),
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

    client.user.setGame(null)
})

client.on('message', message => {
    const { content } = message
    const { username, discriminator } = message.author

    if (message.guild) {
        db.run('INSERT INTO  messages (content, user, discriminator, channel, server) VALUES (?, ?, ?, ?, ?)', [content, username, discriminator, message.channel.id, message.guild.name], err => {
            if (err) {
                logger.error(err.toString())
            }
        })
    }


    logger.info(`${username}#${discriminator}> ${content}`)
    const match = content.match(/^!([^ ]+) *((.|[\r\n])*)$/)
    if (null === match) {
        return
    }

    const name = match[1]
    const data = match[2]

    const context = {
        client,
        logger,
        message,
        data,
        db,
        commands: Commands,
        config
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
            logger.error(e.toString())
            message.reply('I had trouble with that one.')
        }
    }
})

process.on('SIGINT', () => {
    logger.info('Received CTRL-C, shutting down...')
    client.destroy().then(process.exit)
})

client.login(appToken)
