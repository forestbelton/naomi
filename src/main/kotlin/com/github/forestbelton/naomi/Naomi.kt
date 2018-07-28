package com.github.forestbelton.naomi

import com.github.forestbelton.naomi.command.allCommands
import com.github.forestbelton.naomi.message.DiscordMessage

import net.dv8tion.jda.core.AccountType
import net.dv8tion.jda.core.JDABuilder
import net.dv8tion.jda.core.events.message.MessageReceivedEvent
import net.dv8tion.jda.core.hooks.ListenerAdapter
import org.apache.logging.log4j.LogManager
import org.flywaydb.core.Flyway

fun main(args: Array<String>) {
    val flyway = Flyway()
    flyway.setDataSource("jdbc:sqlite:./naomi.db", "", "")
    flyway.migrate()

    val token = System.getenv("APP_TOKEN")
    if (token == null) {
        System.err.println("No app token available. Please set the APP_TOKEN environment variable.")
        System.exit(-1)
    }

    val jda = JDABuilder(AccountType.BOT)
        .setToken(token)
        .buildBlocking()

    jda.addEventListener(Naomi())
}

class Naomi : ListenerAdapter() {
    companion object {
        val logger = LogManager.getLogger(Naomi::class.java)
    }

    override fun onMessageReceived(event: MessageReceivedEvent?) {
        if (event == null || event.author.isBot) {
            return
        }

        logger.info("[{}#{}] {} ({}) - {}", event.guild.name, event.channel.name, event.author.name,
            event.author.id, event.message.contentRaw)

        val message = DiscordMessage.from(event)
        for (command in allCommands) {
            val matcher = command.matcher()

            if (matcher(message)) {
                command.execute(message)
                break
            }
        }
    }
}
