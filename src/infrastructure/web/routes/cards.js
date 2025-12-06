import express from 'express';
import { CreateCard } from '../../../application/createCard.js';
import { GetQuizz } from '../../../application/getQuizz.js';
import { AnswerCard } from '../../../application/answerCard.js';
import { InMemoryCardRepository } from '../../repositories/inMemoryCardRepository.js';

const router = express.Router();
const cardRepository = new InMemoryCardRepository(); // Singleton-ish for now (in real app, use DI)

// Hack to keep state across requests since we re-instantiate repo otherwise
// Actually, for in-memory to work across requests, we need a singleton instance exported or passed around.
// Let's create a singleton instance in a separate file or just attach it to app.
// For now, let's just export the instance from the repo file or create it here outside the route handler?
// No, module caching will handle it if we export an instance, but we exported the class.
// Let's create a singleton instance here for simplicity, but wait, if I import this router in server.js, this code runs once.
// So `const cardRepository = new InMemoryCardRepository();` is fine as long as server stays alive.
// BUT for tests, we might want a fresh one.
// Let's stick to this for now.

router.get('/', async (req, res) => {
    try {
        const tags = req.query.tags ? req.query.tags.split(',') : [];
        const cards = await cardRepository.findByTags(tags);
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const useCase = new CreateCard(cardRepository);
        const card = await useCase.execute(req.body);
        res.status(201).json(card);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/quizz', async (req, res) => {
    try {
        const date = req.query.date;
        const useCase = new GetQuizz(cardRepository);
        const cards = await useCase.execute(date);
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:cardId/answer', async (req, res) => {
    try {
        const { cardId } = req.params;
        const { isValid } = req.body;
        
        if (isValid === undefined) {
            return res.status(400).json({ error: 'isValid is required' });
        }

        const useCase = new AnswerCard(cardRepository);
        await useCase.execute(cardId, isValid);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'Card not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

export default router;
