package com.github.forestbelton.naomi.command

import com.github.forestbelton.naomi.message.Message
import com.github.forestbelton.naomi.message.Response
import com.github.forestbelton.naomi.server.Server

interface Command {
    fun matcher(): (Message) -> Boolean

    fun execute(server: Server, message: Message)
}
