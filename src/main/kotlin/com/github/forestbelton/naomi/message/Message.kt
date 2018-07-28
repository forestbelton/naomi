package com.github.forestbelton.naomi.message

interface Message {
    fun content(): String

    fun asked(): Boolean

    fun reply(content: String)
}
