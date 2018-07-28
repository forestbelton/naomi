package com.github.forestbelton.naomi.command.matcher

import com.github.forestbelton.naomi.message.Message

val alwaysMatcher: (Message) -> Boolean = { _: Message -> true }

val askedMatcher = Message::asked

val and: ((Message) -> Boolean, (Message) -> Boolean) -> (Message) -> Boolean = {
    m, n -> { message: Message -> m(message) && n(message) }
}

val commandMatcher = { command: String ->
    and(
        askedMatcher,
        { message: Message ->
            val words = message.content().split(" ")
            words.size > 1 && words[1].equals(command)
        }
    )
}