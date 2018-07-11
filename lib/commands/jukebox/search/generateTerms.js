/**
 * Tokenize a document (or query) into a collection of its terms.
 *
 * @function generateTerms
 * @param {string} docStr - The document to generate terms of.
 */
export default docStr => docStr
    .replace(/[^ a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .filter(token => token !== '')
    .map(term => term.toLowerCase())
