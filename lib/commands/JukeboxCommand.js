import Command from './Command'
import Jukebox from './jukebox/Jukebox'

const jukebox = new Jukebox()

module.exports = new Command({
    name: 'jukebox',
    command: jukebox.start,
    subcommands: {
        add: jukebox.queueSong,
        start: jukebox.start,
        stop: jukebox.stop,
        next: jukebox.next,
        fetch: jukebox.fetch,
        search: jukebox.search,
        play: jukebox.play,
        playing: jukebox.whatsPlaying,
        volume: jukebox.setVolume,
        remove: jukebox.remove,
        rename: jukebox.rename,
        queue: jukebox.queueSong,
        lucky: jukebox.imFeelingLucky,
        playlist: jukebox.setPlaylist,
        insert: jukebox.insertIntoPlaylist
    }
})
