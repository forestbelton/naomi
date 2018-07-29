package com.github.forestbelton.naomi.command.commands.eightball

import com.github.forestbelton.naomi.command.Command
import com.github.forestbelton.naomi.command.matcher.commandMatcher
import com.github.forestbelton.naomi.message.Message
import org.jooq.DSLContext

import java.util.Random

class EightBallCommand : Command {
    companion object {
        val eightBallResponses = arrayOf(
            "it is certain.",
            "it is decidedly so.",
            "without a doubt.",
            "yes, definitely.",
            "you may rely on it.",
            "as I see it, yes.",
            "most likely.",
            "outlook good.",
            "yes.",
            "signs point to yes.",
            "reply hazy, try again.",
            "ask again later.",
            "better not tell you now.",
            "cannot predict now.",
            "concentrate and ask again.",
            "don\"t count on it.",
            "my reply is no.",
            "my sources say no.",
            "outlook not so good.",
            "very doubtful."
        )
    }

    override fun matcher(): (Message) -> Boolean = commandMatcher("8ball")

    override fun execute(db: DSLContext, message: Message) {
        val responseIndex = Random().nextInt(eightBallResponses.size - 1)
        message.reply(eightBallResponses[responseIndex])
    }
}
