package com.github.forestbelton.naomi.urbandictionary

interface UrbanDictionaryClient {

    fun define(term: String): DefineResponse?

}