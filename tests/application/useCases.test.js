import { CreateCard } from '../../src/application/createCard.js';
import { GetQuizz } from '../../src/application/getQuizz.js';
import { AnswerCard } from '../../src/application/answerCard.js';
import { InMemoryCardRepository } from '../../src/infrastructure/repositories/inMemoryCardRepository.js';
import { Card } from '../../src/domain/card.js';
import { Category } from '../../src/domain/category.js';

describe('Application Use Cases', () => {
    let repo;

    beforeEach(() => {
        repo = new InMemoryCardRepository();
    });

    test('CreateCard should save a new card', async () => {
        const useCase = new CreateCard(repo);
        const cardData = { question: 'Q', answer: 'A', tag: 'T' };
        const card = await useCase.execute(cardData, 'user1');
        
        expect(card.id).toBeDefined();
        expect(card.question).toBe('Q');
        expect(card.userId).toBe('user1');
        
        const stored = await repo.findById(card.id);
        expect(stored).toEqual(card);
    });

    test('GetQuizz should return due cards', async () => {
        const c1 = new Card({ question: 'Q1', answer: 'A1', tag: 'T1', userId: 'user1' }); // Due (new)
        const c2 = new Card({ question: 'Q2', answer: 'A2', tag: 'T2', lastAnsweredDate: new Date(), userId: 'user1' }); // Not due
        const c3 = new Card({ question: 'Q3', answer: 'A3', tag: 'T3', userId: 'user2' }); // Other user
        
        await repo.save(c1);
        await repo.save(c2);
        await repo.save(c3);

        const useCase = new GetQuizz(repo);
        const quizz = await useCase.execute('user1');
        
        expect(quizz.length).toBe(1);
        expect(quizz[0].id).toBe(c1.id);
    });

    test('AnswerCard should update card category', async () => {
        const card = new Card({ question: 'Q', answer: 'A', tag: 'T', userId: 'user1' });
        await repo.save(card);

        const useCase = new AnswerCard(repo);
        await useCase.execute(card.id, true);

        const updated = await repo.findById(card.id);
        expect(updated.category).toBe(Category.SECOND);
    });

    test('AnswerCard should throw error if card not found', async () => {
        const useCase = new AnswerCard(repo);
        await expect(useCase.execute('invalid-id', true)).rejects.toThrow('Card not found');
    });
});
