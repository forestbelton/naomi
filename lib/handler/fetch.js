const child_process = require('child_process')
const uuidv4 = require('uuid/v4')

const JUKEBOX_DIR = '/Users/case/Projects/naomi/data/jukebox'

module.exports = function(context) {
    const { logger, message, data } = context
    const outputPath = `${JUKEBOX_DIR}/${uuidv4()}.mp3`

    logger.info(`Fetching ${data} to ${outputPath}...`)
    const proc = child_process.spawn(
        'youtube-dl',
        [
            '--output',
            outputPath,
            '--audio-format',
            'mp3',
            '-x',
            data
        ]
    )

    proc.on('close', code => {
        if (code === 0) {
            message.reply(`The download for ${data} is completed`)
        } else {
            message.reply('There was an error fetching the file')
        }
    })
}