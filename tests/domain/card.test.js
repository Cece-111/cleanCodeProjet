import { Card } from '../../src/domain/card.js';
import { Category } from '../../src/domain/category.js';

describe('Card Domain Entity', () => {
    test('should create a card with default values', () => {
        const card = new Card({ question: 'Q', answer: 'A', tag: 'T' });
        expect(card.id).toBeDefined();
        expect(card.category).toBe(Category.FIRST);
        expect(card.lastAnsweredDate).toBeNull();
    });

    test('should promote card to next category on correct answer', () => {
        const card = new Card({ question: 'Q', answer: 'A', tag: 'T' });
        card.answerCard(true);
        expect(card.category).toBe(Category.SECOND);
        expect(card.lastAnsweredDate).not.toBeNull();
    });

    test('should reset card to FIRST category on wrong answer', () => {
        const card = new Card({ question: 'Q', answer: 'A', tag: 'T', category: Category.THIRD });
        card.answerCard(false);
        expect(card.category).toBe(Category.FIRST);
    });

    test('should remove card from system (DONE) after SEVENTH category', () => {
        const card = new Card({ question: 'Q', answer: 'A', tag: 'T', category: Category.SEVENTH });
        card.answerCard(true);
        expect(card.category).toBe(Category.DONE);
    });

    test('should determine if card is due for review', () => {
        const card = new Card({ question: 'Q', answer: 'A', tag: 'T' });
        
        // New card is always due (or maybe not? Logic says if no date, it's due)
        // My implementation: if (!this.lastAnsweredDate) return true;
        expect(card.isDue()).toBe(true);

        card.answerCard(true); // Moved to SECOND (2 days interval)
        
        // Mock date to be same day
        expect(card.isDue(new Date())).toBe(false);

        // Mock date to be 2 days later
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 2);
        expect(card.isDue(futureDate)).toBe(true);
    });
});
