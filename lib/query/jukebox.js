export const checkForSong = knex => url => knex('jukebox_songs')
    .where('url', '=', url)
    .count('url as songCount')
    .then(([{ songCount }]) => songCount == 1)

export const deleteSong = knex => id => knex('qdb')
    .update({ deleted: 1 })
    .where('deleted', '=', 0)
    .where('id', '=', id)
