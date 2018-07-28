package com.github.forestbelton.naomi.command

import com.github.forestbelton.naomi.message.Message

interface CommandMatcher {
    fun matches(message: Message): Boolean
}
