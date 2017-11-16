const fs = require('fs')
const util = require('util')

const JUKEBOX_DIR = '/Users/case/Projects/naomi/data/jukebox'

let dispatcher = null
let songQueue = []

function randomSong() {
    const files = fs.readdirSync(JUKEBOX_DIR, 'utf8')
    const nextSongIndex = Math.floor(Math.random() * (files.length + 1))
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

    dispatcher = conn.playFile(songFile)
    dispatcher.on('end', function() {
        logger.info('Song over. Starting next song...')

        dispatcher = null
        nextSong(logger, conn)
    })
}

function parseCommand(context) {
    const data = context.data
    const message = context.message

    if (data === 'next' || ((data === 'start' || data === '') && dispatcher === null)) {
        nextSong(context.logger, context.client._voiceConn)
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