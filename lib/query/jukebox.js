export const checkForSong = knex => url => knex('jukebox_songs')
    .where('url', '=', url)
    .count('url as songCount')
    .then(([{ songCount }]) => songCount == 1)
