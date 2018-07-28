package com.github.forestbelton.naomi.command.coinflip

import com.github.forestbelton.naomi.command.Command
import com.github.forestbelton.naomi.command.matcher.alwaysMatcher
import com.github.forestbelton.naomi.message.Message
import com.github.forestbelton.naomi.message.Response
import com.github.forestbelton.naomi.server.Server

import java.util.Random

class CoinFlipCommand : Command {
    override fun matcher(): (Message) -> Boolean = alwaysMatcher

    override fun execute(server: Server, message: Message) {
        val coin = if (Random().nextInt(1) == 0) "heads" else "tails"
        server.reply("the coin was ${coin}.")
    }
}
