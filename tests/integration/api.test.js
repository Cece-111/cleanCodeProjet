import request from 'supertest';
import app from '../../src/infrastructure/web/server.js';

describe('API Integration Tests', () => {
    test('POST /cards should create a card', async () => {
        const res = await request(app)
            .post('/cards')
            .set('x-user-id', 'user1')
            .send({
                question: 'What is DDD?',
                answer: 'Domain Driven Design',
                tag: 'Architecture'
            });
        
        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.category).toBe('FIRST');
        expect(res.body.userId).toBe('user1');
    });

    test('GET /cards should return all cards for user', async () => {
        await request(app).post('/cards').set('x-user-id', 'user1').send({ question: 'Q1', answer: 'A1', tag: 'T1' });
        
        const res = await request(app).get('/cards').set('x-user-id', 'user1');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /cards should NOT return cards for other user', async () => {
        await request(app).post('/cards').set('x-user-id', 'user1').send({ question: 'Q1', answer: 'A1', tag: 'T1' });
        
        const res = await request(app).get('/cards').set('x-user-id', 'user2');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(0);
    });

    test('GET /cards/quizz should return due cards', async () => {
        // Create a new card (it will be due)
        const createRes = await request(app).post('/cards').set('x-user-id', 'user1').send({ question: 'Q_Quizz', answer: 'A_Quizz', tag: 'T_Quizz' });
        const cardId = createRes.body.id;

        const res = await request(app).get('/cards/quizz').set('x-user-id', 'user1');
        expect(res.statusCode).toBe(200);
        const found = res.body.find(c => c.id === cardId);
        expect(found).toBeDefined();
    });

    test('PATCH /cards/:id/answer should update category', async () => {
        const createRes = await request(app).post('/cards').set('x-user-id', 'user1').send({ question: 'Q_Ans', answer: 'A_Ans', tag: 'T_Ans' });
        const cardId = createRes.body.id;

        const res = await request(app)
            .patch(`/cards/${cardId}/answer`)
            .set('x-user-id', 'user1')
            .send({ isValid: true });
        
        expect(res.statusCode).toBe(204);

        // Verify it moved to SECOND category
        const listRes = await request(app).get('/cards').set('x-user-id', 'user1');
        const card = listRes.body.find(c => c.id === cardId);
        expect(card.category).toBe('SECOND');
    });
});
