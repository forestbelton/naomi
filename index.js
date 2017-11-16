const Discord = require('discord.js')
const client = new Discord.Client()

const appToken = process.env.APP_TOKEN
if (typeof appToken === 'undefined') {
    throw new Error('Please specify an application token via the `APP_TOKEN\''
        + ' environment variable.')
}

client.login(appToken)
