package com.github.forestbelton.naomi

import com.github.forestbelton.naomi.command.allCommands
import com.github.forestbelton.naomi.command.matcher.match
import com.github.forestbelton.naomi.message.DiscordMessage

import net.dv8tion.jda.core.AccountType
import net.dv8tion.jda.core.JDABuilder
import net.dv8tion.jda.core.events.message.MessageReceivedEvent
import net.dv8tion.jda.core.hooks.ListenerAdapter
import org.apache.logging.log4j.LogManager
import org.apache.logging.log4j.Logger
import org.flywaydb.core.Flyway
import org.jooq.DSLContext
import org.jooq.SQLDialect
import org.jooq.impl.DSL
import java.sql.DriverManager

fun main(args: Array<String>) {
    val flyway = Flyway()
    val jdbcUrl = System.getenv("JDBC_URL") ?: "jdbc:sqlite:./naomi.db"
    flyway.setDataSource(jdbcUrl, "", "")
    flyway.migrate()

    val logger = LogManager.getLogger()
    logger.info("Establishing database connection...")
    val db = DSL.using(
        DriverManager.getConnection(jdbcUrl),
        SQLDialect.SQLITE
    )

    val token = System.getenv("APP_TOKEN")
    if (token == null) {
        logger.error("No app token available. Please set the APP_TOKEN environment variable.")
        System.exit(-1)
    }

    val jda = JDABuilder(AccountType.BOT)
        .setToken(token)
        .buildBlocking()

    jda.addEventListener(Naomi(db))
}

class Naomi(val db: DSLContext) : ListenerAdapter() {
    companion object {
        val logger: Logger = LogManager.getLogger(Naomi::class.java)
    }

    override fun onMessageReceived(event: MessageReceivedEvent?) {
        if (event == null || event.author.isBot) {
            return
        }

        logger.info("\"{}\" <@{}>: {}", event.author.name, event.author.id, event.message.contentRaw)

        val message = DiscordMessage.from(event)
        for (command in allCommands) {
            val content = message.content()

            if (command.matches(content)) {
                logger.info("Executing command {}", command)
                match(db, message, command.actions())
                break
            }
        }
    }
}
