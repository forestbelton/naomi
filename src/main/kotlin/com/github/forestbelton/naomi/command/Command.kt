package com.github.forestbelton.naomi.command

import com.github.forestbelton.naomi.message.Message
import org.jooq.DSLContext

interface Command {
    fun matcher(): (Message) -> Boolean

    fun execute(db: DSLContext, message: Message)
}
