#!/usr/bin/env node

var Discord = require('discord.js')
var client = new Discord.Client()

var config = require('../conf/app.json')

var knex = require('knex')({
    client: 'sqlite',
    connection: {
        filename: config.database
    }
})

if (typeof process.env.APP_TOKEN === 'undefined') {
    throw new Error('The APP_TOKEN environment variable must be set')
}

function updateDiscordName(user) {
    console.log('Updating user ' + user.discord_id)

    return client.fetchUser(user.discord_id)
        .then(function(user) {
            var discord_name = user.username + '#' + user.discriminator

            return knex('users').update({
                discord_name: discord_name
            }).where('discord_id', '=', user.discord_id)
        })
}

client.on('ready', function() {
    knex('users').select('discord_id')
        .then(function(rows) {
            var rowPromises = rows.map(updateDiscordName)
            return Promise.all(rowPromises)
        })
        .then(function() {
            console.log('Done updating Discord names.')
            client.destroy().then(process.exit)
        })
})

client.login(process.env.APP_TOKEN)
