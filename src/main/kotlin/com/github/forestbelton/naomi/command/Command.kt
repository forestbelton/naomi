package com.github.forestbelton.naomi.command

import com.github.forestbelton.naomi.message.Message

interface Command {
    fun matcher(): (Message) -> Boolean

    fun execute(message: Message)
}
