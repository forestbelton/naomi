package com.github.forestbelton.naomi.command.commands.jukebox

import com.github.forestbelton.naomi.command.Command
import com.github.forestbelton.naomi.command.matcher.MatchAction
import com.github.forestbelton.naomi.command.matcher.WordMatcher
import com.github.forestbelton.naomi.message.Message
import com.sedmelluq.discord.lavaplayer.player.AudioLoadResultHandler
import com.sedmelluq.discord.lavaplayer.player.AudioPlayer
import org.jooq.DSLContext
import com.sedmelluq.discord.lavaplayer.source.AudioSourceManagers
import com.sedmelluq.discord.lavaplayer.player.DefaultAudioPlayerManager
import com.sedmelluq.discord.lavaplayer.player.AudioPlayerManager
import com.sedmelluq.discord.lavaplayer.player.event.AudioEventAdapter
import com.sedmelluq.discord.lavaplayer.tools.FriendlyException
import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist
import com.sedmelluq.discord.lavaplayer.track.AudioTrack
import org.apache.logging.log4j.LogManager

class JukeboxCommand : Command, AudioEventAdapter() {
    companion object {
        val logger = LogManager.getLogger(JukeboxCommand::class.java)
    }

    var playerManager: AudioPlayerManager? = null
    var player: AudioPlayer? = null
    var scheduler: AudioPlayerSendHandler? = null

    override fun matcher(): WordMatcher = WordMatcher.builder()
        .word()
        .exact("jukebox")
        .tail()

    override fun actions(): List<MatchAction> = listOf(
        MatchAction(
            WordMatcher.builder()
                .word()
                .exact("jukebox")
                .end(),
            this::start
        ),
        MatchAction(
            WordMatcher.builder()
                .word()
                .exact("jukebox")
                .exact("play")
                .tail(),
            this::play
        )
    )

    fun start(db: DSLContext, message: Message, args: List<String>) {
        if (this.playerManager == null) {
            this.playerManager = DefaultAudioPlayerManager()
            AudioSourceManagers.registerRemoteSources(playerManager)

            this.player = this.playerManager?.createPlayer()
            this.player?.addListener(this)


            this.scheduler = AudioPlayerSendHandler(this.player!!)
        }

        if (this.scheduler == null) {
            logger.error("Failed to create track scheduler")
            return
        }

        message.joinChannel(this.scheduler!!)
    }

    fun play(db: DSLContext, message: Message, args: List<String>) {
        if (this.playerManager == null) {
            this.start(db, message, args)
        }

        val url = args[3]
        val player = this.player

        this.playerManager?.loadItem(url, object : AudioLoadResultHandler {
            override fun loadFailed(exception: FriendlyException?) {
                message.reply("I had trouble loading that.")
            }

            override fun trackLoaded(track: AudioTrack?) {
                logger.info("Starting new track.")
                player?.playTrack(track)
            }

            override fun noMatches() {
                message.reply("I could not find anything like that.")
            }

            override fun playlistLoaded(playlist: AudioPlaylist?) {
                TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
            }
        })
    }
}