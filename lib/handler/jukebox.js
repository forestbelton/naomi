const fs = require('fs')
const util = require('util')

const JUKEBOX_DIR = '/Users/case/Projects/naomi/data/jukebox'

function jukebox(logger, conn) {
    const files = fs.readdirSync(JUKEBOX_DIR, 'utf8')
    const nextSongIndex = Math.floor(Math.random() * (files.length + 1))
    const nextSong = `${JUKEBOX_DIR}/${files[nextSongIndex]}`

    const dispatcher = conn.playFile(nextSong)
    dispatcher.on('end', () => {
        jukebox(logger, conn)
    })
}

module.exports = function(context) {
    const { logger, client, message, data } = context

    if (!client._voiceConn) {
        const { voiceChannel } = message.member

        voiceChannel.join()
            .then(conn => {
                logger.info(`Connected to voice channel ${voiceChannel}`)

                client._voiceConn = conn
                jukebox(logger, conn)
            })
            .catch(logger.info)
    } else {
        jukebox(logger, client._voiceConn)
    }
}