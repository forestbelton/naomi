package com.github.forestbelton.naomi.urbandictionary

import com.beust.klaxon.Klaxon
import okhttp3.OkHttpClient
import okhttp3.Request

class OkHttpUrbanDictionaryClient(private val client: OkHttpClient) : UrbanDictionaryClient {

    private val urbanDictionaryUrl = "http://api.urbandictionary.com"

    override fun define(term: String): DefineResponse? {
        val request = Request.Builder()
            .url("$urbanDictionaryUrl/v0/define?term=$term")
            .build()

        val response = client
            .newCall(request)
            .execute()

        val bodyJson = response.body()

        return if (bodyJson != null) {
            Klaxon().parse<DefineResponse>(bodyJson.string())
        } else {
            null
        }
    }

}