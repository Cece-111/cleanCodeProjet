import { CardRepository } from '../../domain/ports/cardRepository.js';

export class InMemoryCardRepository extends CardRepository {
    constructor() {
        super();
        this.cards = new Map();
    }

    async save(card) {
        this.cards.set(card.id, card);
        return card;
    }

    async findAll() {
        return Array.from(this.cards.values());
    }

    async findById(id) {
        return this.cards.get(id) || null;
    }

    async findByTags(tags) {
        if (!tags || tags.length === 0) {
            return this.findAll();
        }
        return Array.from(this.cards.values()).filter(card => 
            tags.includes(card.tag)
        );
    }
}
