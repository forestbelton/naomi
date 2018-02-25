import Command from './Command'
import PromisedDatabase from '../util/PromisedDatabase'

module.exports = new Command({
    name: 'balance',
    command: ({ db, message }) => {
        const user = `${message.author.username}#${message.author.discriminator}`
        const pdb = new PromisedDatabase(db)

        pdb.get('SELECT balance FROM user_casebucks WHERE user = ?', [user])
            .then(({ balance }) => message.reply(`you have a balance of ${balance} casebucks.`))
            .catch(() => message.reply('you have no casebucks.'))
    }
})
