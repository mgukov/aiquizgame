import { Question } from "./Question";

export interface QuestionGenerator {
    generateQuestion(topic: string) : Promise<Question>;
}