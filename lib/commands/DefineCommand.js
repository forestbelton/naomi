import axios from 'axios'

import Command from './Command'

const client = axios.create({
    baseURL: 'http://api.urbandictionary.com'
})

const define = ({ logger, message }, term, index) => {
    client
        .get(`/v0/define?term=${term}`)
        .then(response => {
            const definitions = response.data.list

            if (definitions.length === 0) {
                message.reply(`${term}: not found`, {
                    reply: null
                })
            } else {
                let definitionIndex = index

                if (index > definitions.length - 1) {
                    definitionIndex = 0
                }

                const definition = definitions[definitionIndex]

                message.reply(`${term} [${definitionIndex}/${definitions.length - 1}]: ${definition.definition}`, {
                    reply: null
                })
            }
        })
        .catch(error => {
            logger.error(error)
        })
}

const parseCommand = context => {
    const { data } = context

    const match = data.match(/^(.*?)(?:\s+([0-9]+)\s*)?$/)
    if (match !== null) {
        const term = match[1]
        const index = parseInt(match[2] || '0')

        define(context, term, index)
    }
}

module.exports = new Command({
    name: 'define',
    command: context => {
        parseCommand(context)
    }
})
