const child_process = require('child_process')
const fs = require('fs')
const util = require('util')
const uuidv4 = require('uuid/v4')

const JUKEBOX_DIR = '/Users/case/Projects/naomi/data/jukebox'

function Jukebox() {
    this.volume = 0.1
    this.playing = false
    this.voiceConnection = null
    this.dispatcher = null
    this.queue = []
}

Jukebox.prototype.start = function(context) {
    return new Promise((resolve, reject) => {
        if (this.playing) {
            resolve()
        } else {
            const { client, message, logger } = context
            const { voiceChannel } = message.member

            if (this.voiceConnection) {
                this.next(context)
            } else {
                voiceChannel.join()
                    .then(connection => {
                        logger.info(`Connected to voice channel ${voiceChannel}`)

                        this.voiceConnection = connection
                        this.next(context)
                    })
            }
        }
    })
}

Jukebox.prototype.stop = function(context) {
    if (this.playing) {
        this.playing = false
        this.dispatcher.end()
    }
}

Jukebox.prototype.next = function(context) {
    const { logger } = context

    if (this.voiceConnection === null) {
        this.start(context)
            .then(() => this.next(context))
        return
    }

    if (this.dispatcher !== null) {
        this.dispatcher.end()
        return
    }

    this.playing = true
    this.nextSong(context)
        .then(song => {
            logger.info(`Playing ${song.path}...`)
            this.dispatcher = this.voiceConnection.playFile(song.path, {
                volume: this.volume,
                bitrate: 12000
            })

            this.dispatcher.on('end', () => {
                this.dispatcher = null

                if (this.playing) {
                    this.next(context)
                }
            })
        })
}

Jukebox.prototype.nextSong = function(context) {
    return this.queue.length > 0
        ? Promise.resolve(this.queue.shift())
        : new Promise((resolve, reject) => {
            context.db.get('SELECT * FROM jukebox_songs WHERE deleted = 0 ORDER BY RANDOM() LIMIT 1', (err, row) => {
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

Jukebox.prototype.fetch = function(context, url) {
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
                    title.toString().trim(),
                    outputPath
                )

                message.reply(`the download for <${url}> is completed.`)
            })
        } else {
            message.reply('there was an error fetching the file.')
        }
    })
}

Jukebox.prototype.search = function(context, query) {
    const { db, logger, message } = context

    db.all("SELECT * FROM jukebox_songs WHERE deleted = 0 AND UPPER(title) LIKE UPPER(?) ORDER by ID ASC", [`%${query}%`], (err, rows) => {
        if (err) {
            logger.error(err)
            message.reply('There was an error performing the search.')
        } else if (rows.length === 0) {
            message.reply('I could not find any matches.')
        } else {
            const titles = rows.map(row => `(${row.id}) ${row.title}`).join('\n')
            message.reply('I found the following matches:\n```' + titles + '```')
        }
    })
}

Jukebox.prototype.play = function(context, id) {
    const { db, message } = context

    db.get('SELECT * FROM jukebox_songs WHERE id = ? AND deleted = 0', [id], (err, row) => {
        if (err) {
            message.reply('could not find a song with that ID.')
        } else {
            this.queue.unshift(row)
            this.next(context)
        }
    })
}

Jukebox.prototype.setVolume = function(context, volume) {
    const oldVolume = Math.floor(this.volume * 100)
    const adjustedVolume = parseInt(volume, 10) / 100

    this.volume = adjustedVolume
    context.message.reply(`I adjusted the volume to ${volume}. It was previously set to ${oldVolume}.`)
}

Jukebox.prototype.remove = function(context, id) {
    const { db, message } = context

    db.run('UPDATE jukebox_songs SET deleted = 1 WHERE id = ? AND deleted = 0', [id], err => {
        if (err) {
            message.reply('could not find a song with that ID.')
        } else {
            message.reply('the song with that ID has been removed.')
        }
    })
}

Jukebox.prototype.rename = function(context, data) {
    const { db, message, logger } = context
    const match = data.match(/^([0-9]+) (.*)$/)

    if (match === null) {
        message.reply('you have provided an invalid format.')
        return
    }

    const [ _, id, title ] = match
    logger.info(`Updating song ${id} title to "${title}"...`)

    db.run('UPDATE jukebox_songs SET title = ? WHERE id = ? AND deleted = 0', [ title, id ], err => {
        if (err) {
            message.reply('could not find a song with that ID.')
        } else {
            message.reply('the song has been renamed.')
        }
    })
}

module.exports = Jukebox