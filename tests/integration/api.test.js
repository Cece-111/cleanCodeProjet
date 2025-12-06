import request from 'supertest';
import app from '../../src/infrastructure/web/server.js';

describe('API Integration Tests', () => {
    test('POST /cards should create a card', async () => {
        const res = await request(app)
            .post('/cards')
            .send({
                question: 'What is DDD?',
                answer: 'Domain Driven Design',
                tag: 'Architecture'
            });
        
        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.category).toBe('FIRST');
    });

    test('GET /cards should return all cards', async () => {
        await request(app).post('/cards').send({ question: 'Q1', answer: 'A1', tag: 'T1' });
        
        const res = await request(app).get('/cards');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /cards/quizz should return due cards', async () => {
        // Create a new card (it will be due)
        const createRes = await request(app).post('/cards').send({ question: 'Q_Quizz', answer: 'A_Quizz', tag: 'T_Quizz' });
        const cardId = createRes.body.id;

        const res = await request(app).get('/cards/quizz');
        expect(res.statusCode).toBe(200);
        const found = res.body.find(c => c.id === cardId);
        expect(found).toBeDefined();
    });

    test('PATCH /cards/:id/answer should update category', async () => {
        const createRes = await request(app).post('/cards').send({ question: 'Q_Ans', answer: 'A_Ans', tag: 'T_Ans' });
        const cardId = createRes.body.id;

        const res = await request(app)
            .patch(`/cards/${cardId}/answer`)
            .send({ isValid: true });
        
        expect(res.statusCode).toBe(204);

        // Verify it moved to SECOND category (need to fetch it to check, but we don't have GET /cards/:id exposed in routes yet, only GET /cards)
        // Let's use GET /cards and filter
        const listRes = await request(app).get('/cards');
        const card = listRes.body.find(c => c.id === cardId);
        expect(card.category).toBe('SECOND');
    });
});
