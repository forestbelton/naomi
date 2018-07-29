package com.github.forestbelton.naomi.command.matcher

import com.github.forestbelton.naomi.message.Message
import org.jooq.DSLContext

typealias ActionHandler = (DSLContext, Message, List<String>) -> Unit

data class MatchAction(val matcher: WordMatcher, val handler: ActionHandler)

fun match(db: DSLContext, message: Message, cases: List<MatchAction>) {
    val content = message.content()

    for (case in cases) {
        val components = case.matcher.matchComponents(content)
        if (components != null) {
            case.handler(db, message, components)
            return
        }
    }

    message.reply("I didn't understand that.")
}
