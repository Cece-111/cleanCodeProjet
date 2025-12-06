import { InMemoryCardRepository } from '../../src/infrastructure/repositories/inMemoryCardRepository.js';
import { Card } from '../../src/domain/card.js';

describe('InMemoryCardRepository', () => {
    let repo;

    beforeEach(() => {
        repo = new InMemoryCardRepository();
    });

    test('should save and retrieve a card', async () => {
        const card = new Card({ question: 'Q', answer: 'A', tag: 'T' });
        await repo.save(card);
        const found = await repo.findById(card.id);
        expect(found).toEqual(card);
    });

    test('should return null if card not found', async () => {
        const found = await repo.findById('non-existent');
        expect(found).toBeNull();
    });

    test('should find all cards', async () => {
        await repo.save(new Card({ question: 'Q1', answer: 'A1', tag: 'T1' }));
        await repo.save(new Card({ question: 'Q2', answer: 'A2', tag: 'T2' }));
        const all = await repo.findAll();
        expect(all.length).toBe(2);
    });

    test('should find cards by tags', async () => {
        const c1 = new Card({ question: 'Q1', answer: 'A1', tag: 'T1' });
        const c2 = new Card({ question: 'Q2', answer: 'A2', tag: 'T2' });
        const c3 = new Card({ question: 'Q3', answer: 'A3', tag: 'T1' });
        
        await repo.save(c1);
        await repo.save(c2);
        await repo.save(c3);

        const found = await repo.findByTags(['T1']);
        expect(found.length).toBe(2);
        expect(found.map(c => c.id)).toContain(c1.id);
        expect(found.map(c => c.id)).toContain(c3.id);
    });
});
