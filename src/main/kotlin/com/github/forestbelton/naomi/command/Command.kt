package com.github.forestbelton.naomi.command

import com.github.forestbelton.naomi.command.matcher.MatchAction
import com.github.forestbelton.naomi.command.matcher.WordMatcher

interface Command {
    fun matcher(): WordMatcher

    fun matches(content: String): Boolean = matcher().matchComponents(content) != null

    fun actions(): List<MatchAction>
}
