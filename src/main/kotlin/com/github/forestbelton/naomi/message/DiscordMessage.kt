package com.github.forestbelton.naomi.message

import net.dv8tion.jda.core.audio.AudioSendHandler
import net.dv8tion.jda.core.entities.Message.MentionType
import net.dv8tion.jda.core.events.message.MessageReceivedEvent

class DiscordMessage(val event: MessageReceivedEvent) : Message {
    companion object {
        fun from(event: MessageReceivedEvent): Message {
            return DiscordMessage(event)
        }
    }

    override fun author(): String {
        return event.message.author.id
    }

    override fun content(): String {
        return event.message.contentRaw
    }

    override fun asked(): Boolean {
        return event.message.isMentioned(event.jda.selfUser, MentionType.USER)
    }

    override fun reply(content: String, onComplete: () -> Unit) {
        event.message.channel
            .sendMessageFormat("<@%s>, %s", event.author.id, content)
            .queue({ _ -> onComplete() })
    }

    override fun joinChannel(handler: AudioSendHandler) {
        val channel = event.message.member.voiceState.channel
        val audioManager = event.guild.audioManager

        audioManager.sendingHandler = handler
        audioManager.openAudioConnection(channel)
    }
}
