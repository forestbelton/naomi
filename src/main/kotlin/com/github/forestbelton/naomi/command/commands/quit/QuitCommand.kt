package com.github.forestbelton.naomi.command.commands.quit

import com.github.forestbelton.naomi.command.SingleCommand
import com.github.forestbelton.naomi.command.matcher.WordMatcher
import com.github.forestbelton.naomi.message.Message
import org.jooq.DSLContext

class QuitCommand : SingleCommand(
    WordMatcher.builder()
        .word()
        .exact("qdb")
        .end()
) {
    override fun execute(db: DSLContext, message: Message, args: List<String>) {
        message.reply("goodbye, my sweet prince.", { System.exit(0) })
    }
}
