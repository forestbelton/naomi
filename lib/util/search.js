/** A document existing in a search corpus. */
export class SearchDocument {
    constructor(opts) {
        const { name, terms, ...data } = opts

        this.name = name
        this.terms = terms
        this.data = data
    }
}

/** A corpus of documents indexed for search. */
export class Search {

    constructor() {
        this.corpus = {}
        this.corpusLength = 0
        this.avgDocLength = 0
    }

    /**
     * Add a document to the search corpus.
     * @param {SearchDocument} doc - The document to add.
     */
    add(doc) {
        const existingDocument = this.corpus[doc.name]

        if (typeof existingDocument === 'undefined') {
            this.corpus[doc.name] = doc
            this.corpusLength++

            this.avgDocLength -= this.avgDocLength / this.corpusLength
            this.avgDocLength += doc.terms.length / this.corpusLength
        }
    }

    /**
     * Remove a document from the search corpus.
     * @param {SearchDocument} doc  - The document to remove.
     */
    remove(doc) {
        const existingDocument = this.corpus[doc.name]

        if (typeof existingDocument !== 'undefined') {
            delete this.corpus[doc.name]

            this.avgDocLength -= doc.terms.length / this.corpusLength
            this.avgDocLength += this.avgDocLength / this.corpusLength
            --this.corpusLength
        }
    }

    /**
     * Find the most relevant documents pertaining to a query.
     * @param {*} query - The search query.
     * @param {number} maxResultCount - The maximum number of results to return.
     * @returns {array} - An array of {@link SearchDocument}s.
     */
    find(query, maxResultCount) {
        const queryTerms = generateTerms(query)
        const documents = Object.keys(this.corpus)
            .map(name => [name, this.score(this.corpus[name].terms, queryTerms)])
            .filter(([_name, score]) => score > 0)
            .sort(([_name1, score1], [_name2, score2]) => score2 - score1)

        return documents
            .slice(0, maxResultCount)
            .map(([name, _score]) => this.corpus[name])
    }

    /**
     * Compute the score (ranking) of an individual document.
     * @private
     * @param {array} docTerms - The terms of the document to score.
     * @param {array} queryTerms - The terms of the query to score against.
     * @returns {number}
     */
    score(docTerms, queryTerms) {
        const k1 = 1.5
        const b = 0.75

        const f = qi => docTerms
            .reduce((count, term) => count + wordMatchingScore(term, qi), 0)

        return queryTerms
            .map(qi =>
                this.IDF(qi)
                * ((f(qi) * (k1 + 1))
                    / (f(qi) + k1 * (1 - b + b * (docTerms.length / this.avgDocLength))))
            )
            .reduce((a, b) => a + b, 0)
    }

    /**
     * Compute the inverse document frequency of a term.
     * @private
     * @param {string} qi - The term to compute.
     * @returns {number}
     */
    IDF(qi) {
        const N = this.corpusLength
        const nqi = Object.keys(this.corpus)
            .reduce((acc, name) => {
                const terms = this.corpus[name].terms
                const docScore = terms.reduce((acc1, term) => acc1 + wordMatchingScore(term, qi), 0)

                return acc + (docScore > 0 ? 1 : 0)
            }, 0)

        return Math.log(
            (N - nqi + 0.5)
            / (nqi + 0.5)
            + 1
        )
    }
}

/**
 * Tokenize a document (or query) into a collection of its terms.
 *
 * @function
 * @param {string} docStr - The document to generate terms of.
 */
export const generateTerms = docStr => docStr
    .replace(/[^ a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .filter(token => token !== '')
    .map(term => term.toLowerCase())

/**
 * Compute a score based on how closely two words match.
 * Words are rated similar up to an edit distance of N.
 *
 * @function
 * @private
 * @param {string} wa - The first word to compare.
 * @param {string} wb - The second word to compare.
 * @returns {number} A score ranging in [0, 1]. 1 represents an exact match.
 */
const wordMatchingScore = (wa, wb) => {
    const N = 2
    const editDistance = []

    for (let m = 0; m <= wa.length; m++) {
        editDistance[m] = []
        editDistance[m][0] = m
    }

    for (let n = 0; n <= wb.length; n++) {
        editDistance[0][n] = n
    }

    for (let j = 1; j <= wb.length; ++j) {
        for (let i = 1; i <= wa.length; ++i) {
            if (wa.charAt(i) === wb.charAt(j)) {
                editDistance[i][j] = editDistance[i - 1][j - 1]
            } else {
                editDistance[i][j] = Math.min(
                    editDistance[i - 1][j],
                    Math.min(
                        editDistance[i][j - 1],
                        editDistance[i - 1][j - 1]
                    )
                ) + 1
            }
        }
    }

    return 1 - Math.min(editDistance[wa.length][wb.length], N) / N
}
