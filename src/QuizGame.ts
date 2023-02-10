import { Option, Question } from "./Question";
import { QuestionGenerator } from "./QuestionGenerator";


export class QuizGame {


    readonly questions: Question[] = [];
    readonly answers: Option[] = [];

    constructor(readonly questionCount: number, readonly generator: QuestionGenerator) {
    }

    async nextQuestion() {
        const q = await this.generator.generateQuestion('world history');
        this.questions.push(q);
        return q;
    }


    setAnswer(opt: Option) {
        this.answers.push(opt);
    }

    getResult() {
        return 0;
    }
}