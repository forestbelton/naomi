package com.github.forestbelton.naomi.command.coinflip

import com.github.forestbelton.naomi.command.Command
import com.github.forestbelton.naomi.command.matcher.alwaysMatcher
import com.github.forestbelton.naomi.message.Message
import com.github.forestbelton.naomi.message.Response

import java.util.Random

class CoinFlipCommand : Command {
    override fun matcher(): (Message) -> Boolean = alwaysMatcher

    override fun execute(message: Message) {
        val coin = if (Random().nextInt(1) == 0) "heads" else "tails"
        message.reply("the coin was ${coin}.")
    }
}
