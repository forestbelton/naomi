package com.github.forestbelton.naomi.message

import net.dv8tion.jda.core.audio.AudioSendHandler

interface Message {
    fun author(): String

    fun content(): String

    fun asked(): Boolean

    fun reply(content: String) {
        this.reply(content, {})
    }

    fun reply(content: String, onComplete: () -> Unit)

    fun joinChannel(handler: AudioSendHandler)
}
