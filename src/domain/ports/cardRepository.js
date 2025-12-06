/**
 * @interface CardRepository
 */
export class CardRepository {
    /**
     * Save a card
     * @param {import('../card.js').Card} card 
     * @returns {Promise<import('../card.js').Card>}
     */
    async save(card) { throw new Error('Not implemented'); }

    /**
     * Find all cards
     * @returns {Promise<import('../card.js').Card[]>}
     */
    async findAll() { throw new Error('Not implemented'); }

    /**
     * Find card by ID
     * @param {string} id 
     * @returns {Promise<import('../card.js').Card | null>}
     */
    async findById(id) { throw new Error('Not implemented'); }

    /**
     * Find cards by tags
     * @param {string[]} tags 
     * @returns {Promise<import('../card.js').Card[]>}
     */
    async findByTags(tags) { throw new Error('Not implemented'); }
}
