package com.github.forestbelton.naomi.command.commands.coinflip

import com.github.forestbelton.naomi.command.Command
import com.github.forestbelton.naomi.command.matcher.commandMatcher
import com.github.forestbelton.naomi.message.Message
import org.jooq.DSLContext

import java.util.Random

class CoinFlipCommand : Command {
    override fun matcher(): (Message) -> Boolean = commandMatcher("flip")

    override fun execute(db: DSLContext, message: Message) {
        val coin = if (Random().nextInt(1) == 0) "heads" else "tails"
        message.reply("the coin was ${coin}.")
    }
}
