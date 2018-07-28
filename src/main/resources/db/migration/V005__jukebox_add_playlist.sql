CREATE TABLE jukebox_playlists(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER NOT NULL REFERENCES jukebox_songs(id),
    playlist_name TEXT NOT NULL
);

CREATE INDEX jukebox_playlists_playlist_name_index ON jukebox_playlists (playlist_name);
CREATE UNIQUE INDEX jukebox_playlists_song_id_playlist_name_unique_index ON jukebox_playlists (song_id, playlist_name);