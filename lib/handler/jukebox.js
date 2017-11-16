const child_process = require('child_process')
const fs = require('fs')
const util = require('util')
const uuidv4 = require('uuid/v4')

const JUKEBOX_DIR = '/Users/case/Projects/naomi/data/jukebox'

let dispatcher = null
let shouldStop = false
let songQueue = []

function randomSong(db) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM jukebox_songs ORDER BY RANDOM() LIMIT 1', (err, row) => {
            if (err) {
                reject(err)
            } else if (!row) {
                reject('There are no songs')
            } else {
                resolve(row)
            }
        })
    })
}

function nextSong(db, logger, conn) {
    if (dispatcher !== null) {
        dispatcher.end()
        return
    }

    if (songQueue.length === 0) {
        randomSong(db).then(song => playSong(db, logger, conn, song))
    } else {
        const song = songQueue.shift()
        playSong(db, logger, conn, song)
    }
}

function playSongIndex(context, id) {
    const { db, message } = context

    db.get('SELECT * FROM jukebox_songs WHERE id = ?', [id], (err, row) => {
        if (err) {
            message.reply('Could not find a song with that ID.')
        } else {
            playSong(context.db, context.logger, context.client._voiceConn, row)
        }
    })
}

function playSong(db, logger, conn, song) {
    logger.info(`Playing ${song.path}...`)

    shouldStop = false
    dispatcher = conn.playFile(song.path, {
        volume: 0.1,
        bitrate: 12000
    })

    dispatcher.on('end', function() {
        if (!shouldStop) {
            logger.info('Song over. Starting next song...')
            dispatcher = null
            nextSong(db, logger, conn)
        } else {
            logger.info('Stopping playback...')
            dispatcher = null
            shouldStop = false
        }
    })
}

function searchSong(context, query) {
    const { db, logger, message } = context

    db.all("SELECT * FROM jukebox_songs WHERE UPPER(title) LIKE UPPER(?) ORDER by ID ASC", [`%${query}%`], (err, rows) => {
        if (err) {
            logger.error(err)
            message.reply('There was an error performing the search.')
        } else if (rows.length === 0) {
            message.reply('I could not find any matches.')
        } else {
            const titles = rows.map(row => `(${row.id}) ${row.title}`).join('\n')
            message.reply('I found the following matches:\n' + titles)
        }
    })
}

function fetch(context, url) {
    const { db, logger, message } = context
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
            const titleProc = child_process.spawn(
                'youtube-dl',
                ['--get-title', url]
            )

            titleProc.stdout.on('data', title => {
                const stmt = db.prepare('INSERT INTO jukebox_songs (url, title, path) VALUES (?, ?, ?)')

                stmt.run(
                    url,
                    title,
                    outputPath
                )

                message.reply(`The download for <${url}> is completed. It has been added to the song queue.`)
                songQueue.push({ url, title, path: outputPath })

                if (dispatcher === null) {
                    nextSong(context.db, context.logger, context.client._voiceConn)
                }
            })
        } else {
            message.reply('There was an error fetching the file.')
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
        nextSong(context.db, context.logger, context.client._voiceConn)
        return
    }

    const fetchMatch = data.match(/^fetch (.*)$/)
    if (fetchMatch !== null) {
        const url = fetchMatch[1]
        fetch(context, url)
        return
    }

    const searchMatch = data.match(/^search (.*)$/)
    if (searchMatch !== null) {
        const term = searchMatch[1]
        searchSong(context, term)
    }

    const playMatch = data.match(/^play (.*)$/)
    if (playMatch !== null) {
        const id = playMatch[1]
        playSongIndex(context, id)
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