package com.github.forestbelton.naomi.command

import com.github.forestbelton.naomi.message.Message
import com.github.forestbelton.naomi.message.Response

interface Command {
    fun matcher(): (Message) -> Boolean

    fun execute(message: Message)
}
