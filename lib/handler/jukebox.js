const child_process = require('child_process')
const fs = require('fs')
const util = require('util')
const uuidv4 = require('uuid/v4')

const JUKEBOX_DIR = '/Users/case/Projects/naomi/data/jukebox'

let dispatcher = null
let shouldStop = false
let songQueue = []

function randomSong() {
    const files = fs.readdirSync(JUKEBOX_DIR, 'utf8')
        .filter(name => /\.opus$/.test(name))
    const nextSongIndex = Math.floor(Math.random() * files.length)
    const nextSong = `${JUKEBOX_DIR}/${files[nextSongIndex]}`

    return nextSong
}

function nextSong(logger, conn) {
    if (dispatcher !== null) {
        dispatcher.end()
        return
    }

    if (songQueue.length === 0) {
        songQueue.push(randomSong())
    }

    const songFile = songQueue.shift()
    logger.info(`Playing ${songFile}...`)

    shouldStop = false
    dispatcher = conn.playFile(songFile, {
        volume: 0.1,
        bitrate: 12000
    })

    dispatcher.on('end', function() {
        if (!shouldStop) {
            logger.info('Song over. Starting next song...')
            dispatcher = null
            nextSong(logger, conn)
        } else {
            logger.info('Stopping playback...')
            dispatcher = null
            shouldStop = false
        }
    })
}

function fetch(context, url) {
    const { logger, message } = context
    const outputPath = `${JUKEBOX_DIR}/${uuidv4()}.opus`

    logger.info(`Fetching ${url} to ${outputPath}...`)

    const proc = child_process.spawn(
        'youtube-dl',
        [
            '--output',
            outputPath,
            '--audio-format',
            'opus',
            '-x',
            url
        ]
    )

    proc.stderr.on('data', data => {
        logger.error(data.toString())
    })

    proc.on('close', code => {
        if (code === 0) {
            message.reply(`The download for <${url}> is completed`)
            songQueue.push(outputPath)

            if (dispatcher === null) {
                nextSong(context.logger, context.client._voiceConn)
            }
        } else {
            message.reply('There was an error fetching the file')
        }
    })
}

function parseCommand(context) {
    const data = context.data
    const message = context.message

    if (data === 'stop' && dispatcher !== null) {
        shouldStop = true
        dispatcher.end()
    }

    if (data === 'next' || ((data === 'start' || data === '') && dispatcher === null)) {
        nextSong(context.logger, context.client._voiceConn)
        return
    }

    const match = data.match(/^fetch (.*)$/)
    if (match !== null) {
        const url = match[1]
        fetch(context, url)
        return
    }
}

module.exports = function(context) {
    const logger = context.logger
    const client = context.client

    if (!client._voiceConn) {
        const { voiceChannel } = context.message.member

        voiceChannel.join()
            .then(conn => {
                logger.info(`Connected to voice channel ${voiceChannel}`)

                client._voiceConn = conn
                parseCommand(context)
            })
            .catch(logger.info)
    } else {
        parseCommand(context)
    }
}