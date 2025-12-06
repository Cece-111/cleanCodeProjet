export class AnswerCard {
    constructor(cardRepository) {
        this.cardRepository = cardRepository;
    }

    async execute(cardId, isValid) {
        const card = await this.cardRepository.findById(cardId);
        if (!card) {
            throw new Error('Card not found');
        }
        card.answerCard(isValid);
        await this.cardRepository.save(card);
    }
}
