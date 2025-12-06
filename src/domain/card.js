import { v4 as uuidv4 } from 'uuid';
import { Category, Intervals, getNextCategory } from './category.js';

export class Card {
    constructor({ id, question, answer, tag, category = Category.FIRST, lastAnsweredDate = null }) {
        this.id = id || uuidv4();
        this.question = question;
        this.answer = answer;
        this.tag = tag;
        this.category = category;
        this.lastAnsweredDate = lastAnsweredDate ? new Date(lastAnsweredDate) : null;
    }

    answerCard(isValid) {
        this.lastAnsweredDate = new Date();
        if (isValid) {
            this.category = getNextCategory(this.category);
        } else {
            this.category = Category.FIRST;
        }
    }

    isDue(date = new Date()) {
        if (this.category === Category.DONE) return false;
        if (!this.lastAnsweredDate) return true;

        const intervalDays = Intervals[this.category];
        const nextDueDate = new Date(this.lastAnsweredDate);
        nextDueDate.setDate(nextDueDate.getDate() + intervalDays);
        
        // Reset hours to compare dates only
        const today = new Date(date);
        today.setHours(0, 0, 0, 0);
        nextDueDate.setHours(0, 0, 0, 0);

        return today >= nextDueDate;
    }
}
