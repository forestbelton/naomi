package com.github.forestbelton.naomi.message

import net.dv8tion.jda.core.entities.Message.MentionType
import net.dv8tion.jda.core.events.message.MessageReceivedEvent

class DiscordMessage(val event: MessageReceivedEvent) : Message {
    companion object {
        fun from(event: MessageReceivedEvent): Message {
            return DiscordMessage(event)
        }
    }

    override fun content(): String {
        return event.message.contentDisplay
    }

    override fun asked(): Boolean {
        return event.message.isMentioned(event.jda.selfUser, MentionType.USER)
    }

    override fun reply(content: String) {
        this.reply(content, {})
    }

    override fun reply(content: String, onComplete: () -> Unit) {
        event.message.textChannel
            .sendMessageFormat("<@%s>, %s", event.author.id, content)
            .queue({ _ -> onComplete() })
    }
}
