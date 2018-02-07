const Command = require('./Command')

const add = (context, user) => {
    const { db, message } = context

    const match = user.match(/^<@!?([0-9]+)>$/)
    const user_id = match && match[1]

    if (!user_id) {
        message.reply('give me a valid user.')
        return
    }

    db.run('INSERT INTO admins (user_id) VALUES (?)', [user_id], err => {
        if (err) {
            message.reply('I could not add ${user}.')
        } else {
            message.reply(`I've added ${user} as an admin.`)
        }
    })
}

const list = context => {
    const { db, message } = context

    db.all('SELECT user_id FROM admins', (err, rows) => {
        if (err) {
            logger.error(err.toString())
            message.reply('I had trouble querying for the admins.')
        } else {
            const admins = (rows || []).map(row => `<@${row.user_id}>`).join(', ')
            message.reply(`The following users are admins: ${admins}`)
        }
    })
}

module.exports = new Command({
    name: 'admin',
    command: list,
    subcommands: {
        add: add,
        list
    }
})