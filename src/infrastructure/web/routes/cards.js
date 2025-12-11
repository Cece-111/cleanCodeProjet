import express from 'express';
import { CreateCard } from '../../../application/createCard.js';
import { GetQuizz } from '../../../application/getQuizz.js';
import { AnswerCard } from '../../../application/answerCard.js';
import { InMemoryCardRepository } from '../../repositories/inMemoryCardRepository.js';

const router = express.Router();
const cardRepository = new InMemoryCardRepository();


router.get('/', async (req, res) => {
    try {
        const tags = req.query.tags ? req.query.tags.split(',') : [];
        const userId = req.headers['x-user-id'] || 'anonymous';
        const cards = await cardRepository.findByTags(userId, tags);
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const useCase = new CreateCard(cardRepository);
        const userId = req.headers['x-user-id'] || 'anonymous';
        const card = await useCase.execute(req.body, userId);
        res.status(201).json(card);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/quizz', async (req, res) => {
    try {
        const date = req.query.date;
        const userId = req.headers['x-user-id'] || 'anonymous';
        const useCase = new GetQuizz(cardRepository);
        const cards = await useCase.execute(userId, date);
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
