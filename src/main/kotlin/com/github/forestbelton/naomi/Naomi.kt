package com.github.forestbelton.naomi

import net.dv8tion.jda.core.AccountType
import net.dv8tion.jda.core.JDABuilder

fun main(args: Array<String>) {
    val token = System.getenv("APP_TOKEN")
    if (token == null) {
        System.err.println("No app token available. Please set the APP_TOKEN environment variable.")
        System.exit(-1)
    }

    JDABuilder(AccountType.BOT)
            .setToken(token)
            .buildBlocking()
}
