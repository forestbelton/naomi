package com.github.forestbelton.naomi.urbandictionary

import com.beust.klaxon.Json

data class DefineResponse(val tags: List<String>,
                          @Json(name = "result_type")
                          val resultType: String,
                          val list: List<Definition>)

data class Definition(val defid: Int,
                      val word: String,
                      val definition: String,
                      val permalink: String,
                      @Json(name = "thumbs_up")
                      val thumbsUp: Int,
                      @Json(name = "thumbs_down")
                      val thumbsDown: Int,
                      val author: String,
                      val example: String,
                      @Json(name = "written_on")
                      val writtenOn: String)
