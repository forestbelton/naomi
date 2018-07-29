package com.github.forestbelton.naomi.command.commands.qdb

import com.forestbelton.github.naomi.database.codegen.tables.Qdb.QDB
import com.github.forestbelton.naomi.command.Command
import com.github.forestbelton.naomi.command.matcher.PatternComponent
import com.github.forestbelton.naomi.command.matcher.WordMatcher
import com.github.forestbelton.naomi.command.matcher.commandMatcher
import com.github.forestbelton.naomi.message.Message
import org.jooq.DSLContext
import org.jooq.impl.DSL

class QdbCommand : Command {
    override fun matcher(): (Message) -> Boolean = commandMatcher("qdb")

    override fun execute(db: DSLContext, message: Message) {
        val addArgs = matchAdd(message.content())
        if (addArgs != null) {
            add(db, message, addArgs)
            return
        }

        val randomArgs = matchRandom(message.content())
        if (randomArgs != null) {
            random(db, message, randomArgs)
            return
        }

        message.reply("I didn't understand that.")
    }

    fun matchAdd(content: String): List<String>? {
        val addCommand = WordMatcher.builder()
            .word()
            .exact("qdb")
            .exact("add")
            .tail()

        return addCommand.matchComponents(content)
    }

    fun add(db: DSLContext, message: Message, args: List<String>) {
        val quote = args[2]

        db.insertInto(QDB,
            QDB.CONTENT, QDB.AUTHOR)
            .values(quote, message.author())
            .execute()

        message.reply("the quote has been successfully added.")
    }

    fun matchRandom(content: String): List<String>? {
        val randomCommand = WordMatcher.builder()
            .word()
            .exact("qdb")
            .exact("random")
            .build()

        return randomCommand.matchComponents(content)
    }

    fun random(db: DSLContext, message: Message, args: List<String>) {
       val quote = db.select(QDB.ID, QDB.CONTENT)
           .from(QDB)
           .orderBy(
               DSL.rand()
           ).first()

        message.reply("#${quote[0]} - ${quote[1]}")
    }
}
