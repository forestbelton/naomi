package com.github.forestbelton.naomi.command.matcher

import org.apache.logging.log4j.LogManager

sealed class PatternComponent
data class ExactComponent(val word: String) : PatternComponent()
class WordComponent : PatternComponent()
class TailComponent : PatternComponent()
class EndComponent : PatternComponent()

class WordMatcher(val pattern: List<PatternComponent>) {
    companion object {
        val logger = LogManager.getLogger(WordMatcher::class.java)

        fun builder(): Builder = Builder()
    }

    fun matchComponents(content: String): List<String>? {
        logger.debug("Attempting to match '{}' against {}", regex(), content)

        var components = mutableListOf<String>()
        var contentLeft = content

        for (component in pattern) {
            val matches = when (component) {
                is ExactComponent -> contentLeft.startsWith(component.word)
                is WordComponent -> contentLeft.indexOf(' ') != -1
                is TailComponent -> true
                is EndComponent -> contentLeft.isEmpty()
            }

            if (!matches) {
                return null
            }

            contentLeft = when (component) {
                is ExactComponent -> {
                    components.add(component.word)

                    val trimLength = Math.min(
                        component.word.length + 1,
                        contentLeft.length
                    )
                    contentLeft.substring(trimLength)
                }
                is WordComponent -> {
                    val wordLength = contentLeft.indexOf(' ')
                    components.add(contentLeft.substring(wordLength))

                    val trimLength = Math.min(
                        wordLength + 1,
                        contentLeft.length
                    )
                    contentLeft.substring(trimLength)
                }
                is TailComponent -> {
                    components.add(contentLeft)
                    ""
                }
                is EndComponent -> ""
            }
        }

        return components
    }

    fun regex(): String {
        val output = pattern.map { component: PatternComponent ->
            when (component) {
                is ExactComponent -> component.word
                is WordComponent -> "([^ ]+?)"
                is TailComponent -> "(.*)$"
                is EndComponent -> "$"
            }
        }

        return output.joinToString(" ")
    }

    class Builder {
        val pattern = mutableListOf<PatternComponent>()

        fun exact(word: String): Builder {
            pattern.add(ExactComponent(word))
            return this
        }

        fun word(): Builder {
            pattern.add(WordComponent())
            return this
        }

        fun tail(): WordMatcher {
            pattern.add(TailComponent())
            return WordMatcher(pattern)
        }

        fun end(): WordMatcher {
            pattern.add(EndComponent())
            return WordMatcher(pattern)
        }
    }
}
