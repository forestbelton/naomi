/** A document existing in a search corpus. */
export default class SearchDocument {
    constructor(opts) {
        const { name, terms, ...data } = opts

        this.name = name
        this.terms = terms
        this.data = data
    }
}
