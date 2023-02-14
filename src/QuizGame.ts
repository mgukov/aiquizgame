import { Option, Question } from "./Question";
import { QuestionGenerator } from "./QuestionGenerator";


export class QuizGame {
    readonly questions: Question[] = [];
    readonly answers: Option[] = [];

    constructor(readonly questionCount: number, readonly generator: QuestionGenerator, readonly topics: string[]) {
    }

    async nextQuestion() {

        if (this.isComplete()) {
            return null;
        }

        const index = Math.floor(this.topics.length * Math.random());
        
        const q = await this.generator.generateQuestion(this.topics[index]);
        this.questions.push(q);
        return q;
    }


    isComplete() {
        return this.questions.length >= this.questionCount && this.answers.length >= this.questionCount;
    }

    setAnswer(opt: Option) {
        this.answers.push(opt);
    }

    setAnswerLetter(letter: string) {
        const opts = this.questions[this.questions.length - 1].options;

        for (const opt of opts) {
            if (opt.letter === letter) {
                this.setAnswer(opt);
                return;
            }
        }
        console.warn(`Option with letter ${letter} not found`);
    }

    getResult() {

        const len = Math.min(this.questions.length, this.answers.length);
        let corrects = 0;

        for (let i = 0; i < len; ++i) {
            const q = this.questions[i];
            const a = this.answers[i];

            if (q.answer?.letter === a.letter) {
                corrects++;
            }
        }
        return corrects / len * 100.0;
    }

    getCurrentQuestionNum() {
        return this.questions.length;
    }
}