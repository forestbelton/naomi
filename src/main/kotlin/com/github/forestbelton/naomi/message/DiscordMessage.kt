package com.github.forestbelton.naomi.message

import com.github.forestbelton.naomi.message.Message

import net.dv8tion.jda.core.events.message.MessageReceivedEvent

class DiscordMessage : Message {
    companion object {
        fun from(event: MessageReceivedEvent): Message {
            return DiscordMessage()
        }
    }

    override fun reply(content: String) {
    }
}
