import { InMemoryCardRepository } from '../../src/infrastructure/repositories/inMemoryCardRepository.js';
import { Card } from '../../src/domain/card.js';

describe('InMemoryCardRepository', () => {
    let repo;

    beforeEach(() => {
        repo = new InMemoryCardRepository();
    });

    test('should save and retrieve a card', async () => {
        const card = new Card({ question: 'Q', answer: 'A', tag: 'T', userId: 'user1' });
        await repo.save(card);
        const found = await repo.findById(card.id);
        expect(found).toEqual(card);
    });

    test('should return null if card not found', async () => {
        const found = await repo.findById('non-existent');
        expect(found).toBeNull();
    });

    test('should find all cards for a user', async () => {
        await repo.save(new Card({ question: 'Q1', answer: 'A1', tag: 'T1', userId: 'user1' }));
        await repo.save(new Card({ question: 'Q2', answer: 'A2', tag: 'T2', userId: 'user1' }));
        await repo.save(new Card({ question: 'Q3', answer: 'A3', tag: 'T3', userId: 'user2' })); // Other user
        
        const all = await repo.findAll('user1');
        expect(all.length).toBe(2);
        expect(all.map(c => c.id)).not.toContain('user2');
    });

    test('should find cards by tags for a user', async () => {
        const c1 = new Card({ question: 'Q1', answer: 'A1', tag: 'T1', userId: 'user1' });
        const c2 = new Card({ question: 'Q2', answer: 'A2', tag: 'T2', userId: 'user1' });
        const c3 = new Card({ question: 'Q3', answer: 'A3', tag: 'T1', userId: 'user1' });
        const c4 = new Card({ question: 'Q4', answer: 'A4', tag: 'T1', userId: 'user2' }); // Tag match but wrong user
        
        await repo.save(c1);
        await repo.save(c2);
        await repo.save(c3);
        await repo.save(c4);

        const found = await repo.findByTags('user1', ['T1']);
        expect(found.length).toBe(2);
        expect(found.map(c => c.id)).toContain(c1.id);
        expect(found.map(c => c.id)).toContain(c3.id);
        expect(found.map(c => c.id)).not.toContain(c4.id);
    });
});
