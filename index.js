import Discord from 'discord.js'
import sqlite3 from 'sqlite3'
import util from 'util'
import winston from 'winston'
import knex from 'knex'

const sqlite = sqlite3.verbose()

import Commands from './lib/Commands'
import config from './conf/app.json'
import { giveBucks, Reason } from './lib/util/caseBucks'

const db = new sqlite.Database(config.database)
const kdb = knex({
    client: 'sqlite',
    connection: {
        filename: config.database
    },
    useNullAsDefault: true
})

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ colorize: true, timestamp: 'true' }),
        new (winston.transports.File)({ filename: 'output.log' })
    ]
})

const client = new Discord.Client()
const appToken = process.env.APP_TOKEN
const state = {
    blackjackGames: {},
    zorkGames: {},
    ticTacToeGames: {}
}

if (typeof appToken === 'undefined') {
    throw new Error('Please specify an application token via the `APP_TOKEN\''
        + ' environment variable')
}

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}`)
    client.user.setActivity(null)
})

client.on('message', message => {
    const { content } = message
    const { username, discriminator } = message.author
    const channel = message.channel === null ? 'private' : message.channel.id
    const server = message.guild === null ? 'private' : message.guild.name

    const discord_id = message.author.id
    const discord_name = `${message.author.username}#${message.author.discriminator}`

    db.run('INSERT INTO messages (content, user, discriminator, channel, server) VALUES (?, ?, ?, ?, ?)', [content, discord_id, discriminator, channel, server], err => {
        if (err) {
            logger.error(err.toString())
        }
    })

    logger.info(`${discord_name}> ${content}`)
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
        kdb,
        commands: Commands,
        config,
        state
    }

    const authorizedFromConfig = config.authorizedUsers.some(user =>
        user.username === username && user.discriminator === discriminator
    )

    if (!authorizedFromConfig) {
        db.get('SELECT id FROM users WHERE discord_id = ?', [message.author.id], (err, row) => {
            if (err || !row) {
                if (err) {
                    logger.error(err.toString())
                }

                message.reply('you are not authorized to do that.')
            } else {
                try {
                    const ranCommand = Commands.some(command => command.resolve(context, content))
                    if (!ranCommand) {
                        return
                    }

                    // the rate is 1/bucksAwardedRate
                    const bucksAwardedRate = 25
                    const randomNumber = Math.floor(Math.random() * bucksAwardedRate)

                    if (randomNumber % bucksAwardedRate === 0) {
                        giveBucks({ kdb, logger, user: discord_name, amount: 1, reason: Reason.LOYALTY })
                        message.reply('for your support of Naomi, you just got 1 casebuck.')
                    }
                } catch (e) {
                    logger.error(e.toString())
                    message.reply('I had trouble with that one.')
                }
            }
        })
    } else {
        try {
            const ranCommand = Commands.some(command => command.resolve(context, content))
            if (!ranCommand) {
                return
            }

            // the rate is 1/bucksAwardedRate
            const bucksAwardedRate = 25
            const randomNumber = Math.floor(Math.random() * bucksAwardedRate)

            if (randomNumber % bucksAwardedRate === 0) {
                giveBucks({ kdb, logger, user: discord_name, amount: 1, reason: Reason.LOYALTY })
                message.reply('for your support of Naomi, you just got 1 casebuck.')
            }
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
