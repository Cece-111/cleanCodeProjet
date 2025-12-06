import { Card } from '../domain/card.js';

export class CreateCard {
    constructor(cardRepository) {
        this.cardRepository = cardRepository;
    }

    async execute(cardData) {
        const card = new Card(cardData);
        return await this.cardRepository.save(card);
    }
}
