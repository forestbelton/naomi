package com.github.forestbelton.naomi.command.matcher

import org.apache.logging.log4j.LogManager

sealed class PatternComponent
data class ExactComponent(val word: String) : PatternComponent()
class WordComponent : PatternComponent()
class TailComponent : PatternComponent()

class WordMatcher(val pattern: List<PatternComponent>) {
    companion object {
        val logger = LogManager.getLogger(WordMatcher::class.java)

        fun builder(): Builder = Builder()
    }

    fun matchComponents(content: String): List<String>? {
        var components = mutableListOf<String>()
        var contentLeft = content

        for (component in pattern) {
            logger.info("trying to match ${component}, content=$contentLeft")

            val matches = when (component) {
                is ExactComponent -> contentLeft.startsWith(component.word)
                is WordComponent -> contentLeft.indexOf(' ') != -1
                is TailComponent -> true
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
            }
        }

        return components
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

        fun build(): WordMatcher = WordMatcher(pattern)
    }
}
