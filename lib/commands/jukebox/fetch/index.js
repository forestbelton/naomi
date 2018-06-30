import YoutubeSongFetcher from './YoutubeSongFetcher'

/**
 * Create a fetcher for a URL.
 * @function
 * @private
 * @param {string} url - The URL to create a fetcher for.
 * @returns {@link AbstractSongFetcher} - A fetcher to use or null if this URL
 * cannot be fetched.
 */
const getFetcherForURL = url => {
    let fetcher = null

    if (/^https?:\/\/(m\.)?youtu(\.be|be\.com)/.test(url)) {
        fetcher = new YoutubeSongFetcher()
    }

    return fetcher
}

/**
 * Fetch a song by URL.
 * @param {string} url - The URL to fetch.
 * @param {string} outputFile - The filename to fetch to.
 * @returns {Promise} - A promise that resolves to the song's title.
 */
export const fetchSong = (url, outputFile) => {
    const fetcher = getFetcherForURL(url)

    return fetcher === null
        ? Promise.reject('no fetcher available for url')
        : fetcher.fetch(url, outputFile)
}
