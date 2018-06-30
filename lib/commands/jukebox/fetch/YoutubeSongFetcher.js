import child_process from 'child_process'

import AbstractSongFetcher from './AbstractSongFetcher'

/** Fetches a song from YouTube */
export default class YouTubeSongFetcher extends AbstractSongFetcher {
    fetch(url, outputFile) {
        return new Promise((resolve, reject) => {
            const proc = child_process.spawn(
                'youtube-dl',
                [
                    '--output',
                    outputFile,
                    '--audio-format',
                    'opus',
                    '--audio-quality',
                    '9',
                    '-x',
                    url
                ]
            )

            proc.stderr.on('data', data => reject(data.toString()))
            proc.on('close', code => {
                if (code === 0) {
                    resolve(this.getTitle(url))
                } else {
                    reject(`${url} fetch failed with code ${code}`)
                }
            })
        })
    }

    getTitle(url) {
        return new Promise((resolve, reject) => {
            const titleProc = child_process.spawn(
                'youtube-dl',
                ['--get-title', url]
            )

            let songTitle = null
            titleProc.on('data', title => songTitle = title.toString().trim())
            titleProc.on('close', code => code === 0
                ? resolve(songTitle)
                : reject(`title fetch exited with code ${code}`))
        })
    }
}
