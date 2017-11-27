const child_process = require('child_process')
const fs = require('fs')
const util = require('util')
const uuidv4 = require('uuid/v4')

const JUKEBOX_DIR = '/Users/case/Projects/naomi/data/jukebox'

class Jukebox {
    constructor() {
        this.volume = 0.5
        this.playing = false
        this.dispatcher = null
        this.queue = []
        this.nowPlaying = null
    }

    start(context) {
        return new Promise((resolve, reject) => {
            if (this.playing) {
                resolve()
            } else {
                const { client, message, logger } = context
                const { voiceChannel } = message.member

                if (client.voiceConnection) {
                    this.next(context)
                } else {
                    voiceChannel.join()
                        .then(connection => {
                            logger.info(`Connected to voice channel ${voiceChannel}`)

                            client.voiceConnection = connection
                            this.next(context)
                        })
                }
            }
        })
    }

    stop(context) {
        if (this.playing) {
            this.playing = false
            this.nowPlaying = null
            this.dispatcher.end()
        }
    }

    next(context) {
        const { client, logger } = context

        if (!client.voiceConnection) {
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

                this.nowPlaying = song
                this.dispatcher = client.voiceConnection.playFile(song.path, {
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

    nextSong(context) {
        return this.queue.length > 0
            ? Promise.resolve(this.queue.shift())
            : new Promise((resolve, reject) => {
                context.db.get('SELECT * FROM jukebox_songs WHERE deleted = 0 ORDER BY RANDOM() LIMIT 1', (err, row) => {
                    if (err) {
                        logger.error(`Failed to fetch next song: ${err.toString()}`)
                        reject(err)
                    } else if (!row) {
                        reject('There are no songs')
                    } else {
                        resolve(row)
                    }
                })
            })
    }

    fetch(context, url) {
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
                '--audio-quality',
                '9',
                '-x',
                url
            ]
        )

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
                    , function(err) {
                        if (err) {
                            logger.error(`Failed to insert jukebox song: ${err}`)

                            if (/UNIQUE constraint failed: jukebox_songs\.url/.test(err.toString())) {
                                message.reply('I already have that song.')
                            } else {
                                message.reply('there was an error fetching the file.')
                            }
                        } else {
                            message.reply(`the download for <${url}> (#${this.lastID}) completed.`)
                        }
                    })
                })

                titleProc.on('close', code => {
                    if (code !== 0) {
                        logger.error(`Title fetch for ${url} failed with exit code ${code}`)
                        message.reply('there was an error fetching the file.')
                    }
                })
            } else {
                logger.error(`Fetch of ${url} failed with exit code ${code}`)
                message.reply('there was an error fetching the file.')
            }
        })
    }

    search(context, query) {
        const { db, logger, message } = context

        db.all("SELECT * FROM jukebox_songs WHERE deleted = 0 AND UPPER(title) LIKE UPPER(?) ORDER by ID ASC", [`%${query}%`], (err, rows) => {
            if (err) {
                logger.error(err.toString())
                message.reply('There was an error performing the search.')
            } else if (rows.length === 0) {
                message.reply('I could not find any matches.')
            } else {
                const titles = rows.map(row => `(${row.id}) ${row.title}`).join('\n')
                message.reply('I found the following matches:\n```' + titles + '```')
            }
        })
    }

    play(context, id) {
        const { db, message } = context

        db.get('SELECT * FROM jukebox_songs WHERE id = ? AND deleted = 0', [id], (err, row) => {
            if (err) {
                logger.error(err.toString())
                message.reply('could not find a song with that ID.')
            } else {
                this.queue.unshift(row)
                this.next(context)
            }
        })
    }

    whatsPlaying(context) {
        const { message } = context

        if (this.nowPlaying) {
            message.reply(`${this.nowPlaying.title} is currently playing.`)
        } else {
            message.reply('no song is currently playing.')
        }
    }

    setVolume(context, volume) {
        const oldVolume = Math.floor(this.volume * 100)
        const adjustedVolume = parseInt(volume, 10) / 100

        this.volume = adjustedVolume
        context.message.reply(`I adjusted the volume to ${volume}. It was previously set to ${oldVolume}.`)
    }

    remove(context, id) {
        const { db, message } = context

        db.run('UPDATE jukebox_songs SET deleted = 1 WHERE id = ? AND deleted = 0', [id], err => {
            if (err) {
                logger.error(err.toString())
                message.reply('could not find a song with that ID.')
            } else {
                message.reply('the song with that ID has been removed.')
            }
        })
    }

    rename(context, data) {
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

    queueSong(context, id) {
        const { db, message } = context

        db.get('SELECT * FROM jukebox_songs WHERE id = ? AND deleted = 0', [id], (err, row) => {
            if (err) {
                logger.error(err.toString())
                message.reply('could not find a song with that ID.')
            } else {
                message.reply(`song ${id} has been added to the play queue.`)
                this.queue.push(row)
            }
        })
    }
}

module.exports = Jukebox