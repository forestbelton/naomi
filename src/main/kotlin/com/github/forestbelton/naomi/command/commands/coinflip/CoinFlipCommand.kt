package com.github.forestbelton.naomi.command.commands.coinflip

import com.github.forestbelton.naomi.command.SingleCommand
import com.github.forestbelton.naomi.command.matcher.WordMatcher
import com.github.forestbelton.naomi.message.Message
import org.jooq.DSLContext

import java.util.Random

class CoinFlipCommand : SingleCommand(
    WordMatcher.builder()
        .word()
        .exact("flip")
        .end()
) {
    override fun execute(db: DSLContext, message: Message, args: List<String>) {
        val coin = if (Random().nextInt(1) == 0) "heads" else "tails"
        message.reply("the coin was $coin.")
    }
}
