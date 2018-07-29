package com.github.forestbelton.naomi.command.commands.qdb

import com.forestbelton.github.naomi.database.codegen.tables.Qdb.QDB
import com.github.forestbelton.naomi.command.Command
import com.github.forestbelton.naomi.command.matcher.MatchAction
import com.github.forestbelton.naomi.command.matcher.WordMatcher
import com.github.forestbelton.naomi.message.Message
import org.jooq.DSLContext
import org.jooq.impl.DSL

class QdbCommand : Command {
    override fun matcher(): WordMatcher = WordMatcher.builder()
        .word()
        .exact("qdb")
        .build()

    override fun actions(): List<MatchAction> = listOf(
        MatchAction(
            WordMatcher.builder()
                .word()
                .exact("qdb")
                .exact("add")
                .tail(),
            this::add
        ),
        MatchAction(
            WordMatcher.builder()
                .word()
                .exact("qdb")
                .exact("random")
                .build(),
            this::random
        )
    )

    fun add(db: DSLContext, message: Message, args: List<String>) {
        val quote = args[2]

        db.insertInto(QDB,
            QDB.CONTENT, QDB.AUTHOR)
            .values(quote, message.author())
            .execute()

        message.reply("the quote has been successfully added.")
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
