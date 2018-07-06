import uuidv4 from 'uuid/v4'

import { fetchSong } from './fetch'
import { addSong, findRandomSong, findPlaylistSongIds } from '../../query/jukebox'

/** CRUD interface for retrieving jukebox songs  */
export default class JukeboxLibrary {
    constructor(db, config) {
        this.db = db
        this.outputDirectory = config.jukeboxDirectory
    }

    /**
     * Pick a random song from the library.
     * @param {object} options - The input criteria.
     * @return An random song matching the criteria.
     */
    getRandomSong(options = {}) {
        let query = findRandomSong(this.db)

        const authors = options.authors || []
        if (authors.length > 0) {
            query = query.whereIn('author', options.authors || [])
        }

        const playlist = options.playlist || null
        if (playlist !== null) {
            query = query.where('id', '=', findPlaylistSongIds(this.db)(playlist))
        }

        return query
    }

    /**
     * Add a song to the library by URL.
     * @param {string} author - The user adding the song.
     * @param {string} url - The URL to add.
     */
    addSongByURL(author, url) {
        const outputFile = `${this.outputDirectory}/${uuidv4()}.opus`

        return fetchSong(url)
            .then(title => addSong(this.db)({
                url,
                title,
                author,
                path: outputFile
            }))
    }
}
