package com.github.forestbelton.naomi.command.commands.coinflip

import com.github.forestbelton.naomi.command.Command
import com.github.forestbelton.naomi.command.matcher.MatchAction
import com.github.forestbelton.naomi.command.matcher.WordMatcher
import com.github.forestbelton.naomi.message.Message
import org.jooq.DSLContext

import java.util.Random

class CoinFlipCommand : Command {

    override fun matcher(): WordMatcher = WordMatcher.builder()
        .word()
        .exact("flip")
        .build()

    override fun actions(): List<MatchAction> = listOf(
        MatchAction(
            WordMatcher.builder()
                .build(),
            this::execute
        )
    )

    fun execute(db: DSLContext, message: Message, args: List<String>) {
        val coin = if (Random().nextInt(1) == 0) "heads" else "tails"
        message.reply("the coin was ${coin}.")
    }
}
