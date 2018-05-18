export const checkForSong = knex => url => knex('jukebox_songs')
    .where('url', '=', url)
    .count('url as songCount')
    .then(([{ songCount }]) => songCount == 1)

export const deleteSong = knex => id => knex('jukebox_songs')
    .update({ deleted: 1 })
    .where('deleted', '=', 0)
    .where('id', '=', id)

export const songAuthor = knex => id => knex('jukebox_songs')
    .where('id', '=', id)
    .first('author')
