package com.github.forestbelton.naomi.command.commands.quit

import com.github.forestbelton.naomi.command.Command
import com.github.forestbelton.naomi.command.matcher.commandMatcher
import com.github.forestbelton.naomi.message.Message

class QuitCommand : Command {
    override fun matcher(): (Message) -> Boolean = commandMatcher("quit")

    override fun execute(message: Message) {
        message.reply("goodbye, my sweet prince.")
        System.exit(0)
    }
}
