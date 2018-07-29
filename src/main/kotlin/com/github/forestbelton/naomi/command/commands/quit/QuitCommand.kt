package com.github.forestbelton.naomi.command.commands.quit

import com.github.forestbelton.naomi.command.Command
import com.github.forestbelton.naomi.command.matcher.MatchAction
import com.github.forestbelton.naomi.command.matcher.WordMatcher
import com.github.forestbelton.naomi.message.Message
import org.jooq.DSLContext

class QuitCommand : Command {
    override fun matcher(): WordMatcher = WordMatcher.builder()
        .word()
        .exact("qdb")
        .build()

    override fun actions(): List<MatchAction> = listOf(
        MatchAction(
            WordMatcher.builder()
                .build(),
            this::quit
        )
    )

    fun quit(db: DSLContext, message: Message, args: List<String>) {
        message.reply("goodbye, my sweet prince.", { System.exit(0) })
    }
}
