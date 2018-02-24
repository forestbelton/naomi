import gnuplot from 'gnuplot'
import Command from './Command'
import Discord from 'discord.js'

module.exports = new Command({
    name: 'plot',
    command: ({ message }, f) => {
        const { channel } = message
        const id = Math.random().toString().replace(/\./g, '')
        const fileName = `/tmp/plot-${id}.png`

        gnuplot()
            .set('term pngcairo')
            .set(`output "${fileName}"`)
            .set('zeroaxis')
            .plot(f)
            .end(() => {
                setTimeout(() => {
                    const embed = new Discord.RichEmbed()
                    embed.attachFile(fileName)
                    embed.setDescription(`This is the plot of f(x) = ${f}.`)

                    channel.send(embed)
                }, 1000)
            })
    }
})
