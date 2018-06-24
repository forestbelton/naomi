const corpus = {}
let corpusLength = 0
let avgDocLength = 0

export const addToCorpus = doc => {
    if (typeof corpus[doc.name] === 'undefined') {
        corpus[doc.name] = doc
        corpusLength++

        avgDocLength -= avgDocLength / corpusLength
        avgDocLength += doc.terms.length / corpusLength
    }
}

export const removeFromCorpus = doc => {
    if (typeof corpus[doc.name] !== 'undefined') {
        delete corpus[doc.name]

        avgDocLength -= doc.terms.length / corpusLength
        avgDocLength += avgDocLength / corpusLength
        corpusLength--
    }
}

export const searchCorpus = (query, searchResults) => {
    const queryTerms = generateTerms(query)
    const documents = Object.keys(corpus)
        .filter(doc => score(corpus[doc].terms, queryTerms) > 0)
        .sort((doc1, doc2) => {
            const score1 = score(corpus[doc1].terms, queryTerms)
            const score2 = score(corpus[doc2].terms, queryTerms)

            return score2 - score1
        })

    return documents
        .slice(0, searchResults)
        .map(name => corpus[name])
}

export const generateTerms = docStr => docStr
    .replace(/[^ a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .filter(token => token !== '')
    .map(term => term.toLowerCase())

const score = (docTerms, queryTerms) => {
    const k1 = 1.5
    const b = 0.75

    const f = qi => docTerms
        .reduce((count, term) => count + (term === qi ? 1 : 0), 0)

    return queryTerms
        .map(qi =>
            (f(qi) * (k1 + 1))
            / (f(qi) + k1 * (1 - b + b * (docTerms.length / avgDocLength)))
        )
        .reduce((a, b) => a + b, 0)
}

const IDF = qi => {
    const N = Object.keys(corpus).length
    const nqi = Object.keys(corpus)
        .reduce((n, doc) => doc.terms.indexOf(qi) !== -1 ? n + 1 : n, 0)

    return Math.log(
        (N - nqi + 0.5)
        / (nqi + 0.5)
    )
}