const child_process = require('child_process')
const sqlite3 = require('sqlite3').verbose()
const winston = require('winston')

const config = require('../conf/app.json')
const db = new sqlite3.Database(config.database)

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ colorize: true, timestamp: 'true' })
    ]
})

logger.info('backfilling song durations.')

db.all('SELECT * FROM jukebox_songs WHERE duration = 0 ORDER BY id ASC', [], (err, rows) => {
    if (err) {
        logger.error(err.toString())
    } else if (rows.length === 0) {
        logger.error('no songs to backfill')
    } else {
        logger.info(`found ${rows.length} songs to backfill.`)

        rows.forEach(song => {
            logger.info(`backfilling duration for song ID ${song.id}.`)

            let metadataOut = ''
            const metadataProc = child_process.spawn(
                'youtube-dl',
                ['--get-duration', song.url]
            )

            metadataProc.stdout.on('data', metadata => {
                metadataOut += metadata.toString()
            })

            metadataProc.on('close', code => {
                if (code !== 0) {
                    logger.error(`Metadata fetch for ${song.url} failed with exit code ${code}`)
                    message.reply('there was an error fetching the file.')
                } else {
                    const match = metadataOut.match(/^(?:(?:(\d+):)?(\d+):)?(\d+)\n$/)
                    
                    if (match !== null) {
                        const hours = parseInt(match[1] || '0')
                        const minutes = parseInt(match[2] || '0')
                        const seconds = parseInt(match[3] || '0')
                        const duration = (hours * 60 * 60) + (minutes * 60) + seconds
                        
                        db.run('UPDATE jukebox_songs SET duration = ? WHERE id = ?', [duration, song.id], err => {
                            if (err) {
                                logger.error(err.toString())
                            } else {
                                logger.info(`backfilled duration for song ID ${song.id}.`)
                            }
                        })
                    } else {
                        logger.error(`failed to fetch metadata for song ID ${song.id}.`)
                    }
                }
            })
        })
    }
})
