/** A class capable of fetching a song URL */
export default class AbstractSongFetcher {
    /**
     * Fetch a song from a URL.
     * @param {string} _url - The url to fetch.
     * @param {string} _outputPath - The path to fetch the file to.
     * @returns A promise that resolves to the song's title.
     */
    fetch(_url, _outputPath) {
        throw new Error('not implemented')
    }
}
