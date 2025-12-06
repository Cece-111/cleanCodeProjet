export class GetQuizz {
    constructor(cardRepository) {
        this.cardRepository = cardRepository;
    }

    async execute(date) {
        const cards = await this.cardRepository.findAll();
        const quizzDate = date ? new Date(date) : new Date();
        return cards.filter(card => card.isDue(quizzDate));
    }
}
