export const addSong = knex => ({ url, title, path, author }) => knex('jukebox_songs')
    .insert({
        url,
        title,
        path,
        author
    })

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

export const findRandomSong = knex => () => knex('jukebox_songs')
    .where('deleted', '=', '0')
    .orderByRaw('random()')
    .first()

export const findPlaylistSongIds = knex => playlist => knex('jukebox_playlists')
    .where('playlist_name', '=', playlist)
    .select('song_id')

export const fetchRandomSong = knex => () => knex('jukebox_songs')
    .where('deleted', '=', '0')
    .orderByRaw('random()')
    .first()

export const fetchRandomPlaylistSong = knex => playlist => knex('jukebox_songs')
    .where('deleted', '=', '0')
    .where('id', '=',
        knex('jukebox_playlists')
            .where('playlist_name', '=', playlist)
            .orderByRaw('random()')
            .select('song_id')
    )
    .first()

export const fetchRandomUserSong = knex => users => knex('jukebox_songs')
    .where('deleted', '=', '0')
    .whereIn('author', users)
    .orderByRaw('random()')
    .first()

export const allSongs = knex => knex('jukebox_songs')
