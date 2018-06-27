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

// words greater than an edit distance of N are ignored
// otherwise, they are scaled linearly by similarity
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

const score = (docTerms, queryTerms) => {
    const k1 = 1.5
    const b = 0.75

    const f = qi => docTerms
        .reduce((count, term) => count + wordMatchingScore(term, qi), 0)

    return queryTerms
        .map(qi =>
            IDF(qi)
            * ((f(qi) * (k1 + 1))
                / (f(qi) + k1 * (1 - b + b * (docTerms.length / avgDocLength))))
        )
        .reduce((a, b) => a + b, 0)
}

const IDF = qi => {
    const N = Object.keys(corpus).length
    const nqi = Object.keys(corpus)
        .reduce((acc, name) => {
            const terms = corpus[name].terms
            const docScore = terms.reduce((acc1, term) => acc1 + wordMatchingScore(term, qi), 0)

            return acc + (docScore > 0 ? 1 : 0)
        }, 0)

    const s = Math.log(
        (N - nqi + 0.5)
        / (nqi + 0.5)
        + 1
    )

    return s
}
