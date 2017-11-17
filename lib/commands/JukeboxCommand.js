const Command = require('./Command')
const Jukebox = require('./jukebox/Jukebox')

const jukebox = new Jukebox()

module.exports = new Command({
    name: 'jukebox',
    command: jukebox.start.bind(jukebox),
    subcommands: {
        start: jukebox.start.bind(jukebox),
        stop: jukebox.stop.bind(jukebox),
        next: jukebox.next.bind(jukebox),
        fetch: jukebox.fetch.bind(jukebox),
        search: jukebox.search.bind(jukebox),
        play: jukebox.play.bind(jukebox),
        playing: jukebox.whatsPlaying.bind(jukebox),
        volume: jukebox.setVolume.bind(jukebox),
        remove: jukebox.remove.bind(jukebox),
        rename: jukebox.rename.bind(jukebox),
        queue: jukebox.queueSong.bind(jukebox)
    }
})
