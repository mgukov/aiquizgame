import { Configuration, CreateCompletionResponse, OpenAIApi } from "openai";
import { Option, parseQuestion, Question } from "./Question";


export class QuestionGenerator {


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
        const text = res.choices[0].text;

        if (text == null) {
            return null;
        }
        return parseQuestion(text);
    }

    async generateQuestion(topic: string) {

        const response = await this.openai.createCompletion({
            model: "text-davinci-003",
            prompt: `generate quiz trivia question with four variant answers on ${topic} topic and only one answer must be correct, use next format: Q: question text, write each possible answer on the new line, start it with uppercase letter and one dot, for example, "A. answer optioin", write correct answer letter in the last line with "Answer:"`,
            temperature: 1,
            max_tokens: 100,
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