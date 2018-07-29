package com.github.forestbelton.naomi.command

import com.github.forestbelton.naomi.command.matcher.MatchAction
import com.github.forestbelton.naomi.command.matcher.WordMatcher
import com.github.forestbelton.naomi.message.Message
import org.jooq.DSLContext

abstract class SingleCommand(val matcher: WordMatcher) : Command {
    override fun matcher(): WordMatcher = matcher

    override fun actions(): List<MatchAction> = listOf(
        MatchAction(
            matcher,
            this::execute
        )
    )

    abstract fun execute(db: DSLContext, message: Message, args: List<String>)
}
