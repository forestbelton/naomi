export default class PromisedDatabase {
    constructor(database) {
        this.database = database
    }

    all(query, args) {
        return new Promise((resolve, reject) => {
            this.database.all(query, args, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    get(query, args) {
        return new Promise((resolve, reject) => {
            this.database.get(query, args, (err, row) => {
                if (err) {
                    reject(err)
                } else if (!row) {
                    reject('No row returned for query')
                } else {
                    resolve(row)
                }
            })
        })
    }

    run(query, args) {
        return new Promise((resolve, reject) => {
            this.database.get(query, args, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
}