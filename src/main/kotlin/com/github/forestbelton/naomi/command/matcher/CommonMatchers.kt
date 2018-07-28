package com.github.forestbelton.naomi.command.matcher

import com.github.forestbelton.naomi.message.Message

val alwaysMatcher: (Message) -> Boolean = { message: Message -> true }
