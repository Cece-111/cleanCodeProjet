import { Card } from '../domain/card.js';

export class CreateCard {
    constructor(cardRepository) {
        this.cardRepository = cardRepository;
    }

    async execute(cardData, userId) {
        const card = new Card({ ...cardData, userId });
        return await this.cardRepository.save(card);
    }
}
