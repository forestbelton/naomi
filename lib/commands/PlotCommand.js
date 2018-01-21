const gnuplot = require('gnuplot')
const Command = require('./Command')
const Discord = require('discord.js')

module.exports = new Command({
    name: 'plot',
    command: (context, f) => {
        const { logger } = context
        const { channel } = context.message
        const id = Math.random().toString().replace(/\./g, '')
        const fileName = `/tmp/plot-${id}.png`

        gnuplot()
            .set('term png')
            .set(`output "${fileName}"`)
            .set('zeroaxis')
            .plot(f)
            .end(() => {
                setTimeout(() => {
                    const embed = new Discord.RichEmbed()
                    embed.attachFile(fileName)
                    embed.setDescription(`This is the plot of f(x) = ${f}.`)

                    channel.send(embed)
                }, 100)
            })
    }
})
