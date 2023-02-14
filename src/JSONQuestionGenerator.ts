import { Configuration, CreateCompletionResponse, OpenAIApi } from "openai";
import { parseJsonQuestion } from "./Question";
import { QuestionGenerator } from "./QuestionGenerator";


export class JSONQuestionGenerator implements QuestionGenerator {


    private readonly openai: OpenAIApi;

    constructor(private readonly key: string, readonly user: string) {
        const configuration = new Configuration({
            apiKey: this.key
        });
        this.openai = new OpenAIApi(configuration);
    }

    parseResponse(res: CreateCompletionResponse) {
        if (res.choices.length == 0) {
            return null;
        }
        const text = res.choices[0].text?.trim();

        if (text == null) {
            return null;
        }
        return parseJsonQuestion(text);
    }

    async generateQuestion(topic: string) {

        const response = await this.openai.createCompletion({
            model: "text-davinci-003",
            prompt: `generate quiz trivia question with four variant answers on ${topic} topic and only one answer must be correct, use next JSON format: 
            { 
                "question": "question text", 
                "answers": [
                    { "letter": "A", "text": "answer1"}, 
                    { "letter": "B", "text": "answer2"}, 
                    { "letter": "C", "text": "answer3"}, 
                    { "letter": "D", "text": "answer4"}
                ], 
                "correctAnswer": "A"
            }`,
            temperature: 1,
            max_tokens: 180,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            user: this.user,
        });

        let q = this.parseResponse(response.data);
        while (q == null) {
            await new Promise(r => setTimeout(r, 1000));
            q = this.parseResponse(response.data);
        }

        return q;
    }
}