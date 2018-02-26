import { format } from 'date-fns'

export const createUser = knex => ({ discord_id, discord_name }) => knex('users')
    .insert({
        createdate: format(Date.now()),
        discord_id,
        discord_name
    })

export const getUsers = knex => knex('users')
    .select()

export const removeUser = knex => ({ discord_id }) => knex('users')
    .del()
    .where('discord_id', '=', discord_id)

export const findById = knex => id => knex('users')
    .where('discord_id', '=', id)
    .first()

export const findByName = knex => name => knex('users')
    .where('discord_name', '=', name)
    .first()

export const updateBalance = knex => ({ user, balance }) => knex('users')
    .update({ balance: balance })
    .where('discord_name', '=', user.discord_name)

export const addPayoutEvent = knex => ({ user, amount, reason }) => knex('casebuck_events')
    .insert({
        createdate: format(Date.now()),
        user: user.discord_name,
        amount,
        reason
    })
