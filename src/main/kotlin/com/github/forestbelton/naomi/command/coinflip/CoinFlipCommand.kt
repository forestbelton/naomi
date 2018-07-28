package com.github.forestbelton.naomi.command.coinflip

import com.github.forestbelton.naomi.command.Command
import com.github.forestbelton.naomi.command.matcher.alwaysMatcher
import com.github.forestbelton.naomi.message.Message
import com.github.forestbelton.naomi.message.Response

class CoinFlipCommand : Command {
    override fun matcher(): (Message) -> Boolean = alwaysMatcher

    override fun execute(message: Message): Response = Response()
}
