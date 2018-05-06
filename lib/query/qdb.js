export const getRandomQuote = knex => knex('qdb')
    .orderByRaw('random()')
    .where('deleted', '=', 0)
    .first('id', 'upvotes', 'downvotes', 'content')

export const addQuote = knex => ({ quote, author }) => knex('qdb')
    .insert({
        content: quote,
        author
    })

export const removeQuote = knex => id => knex('qdb')
    .update({ deleted: 1 })
    .where('deleted', '=', 0)
    .where('id', '=', id)
