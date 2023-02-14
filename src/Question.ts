

function parseOption(text: string) : Option {
    return new Option(text.slice(3), text.slice(0, 1));
}

function parseJsonOption(opt: any) : Option {
    return new Option(opt.text, opt.letter);
}


export function  parseJsonQuestion(json: string) {
    console.log(`decode JSON response ${json}`);
    
    let obj = JSON.parse(json);

    if (typeof obj.question != 'string') {
        return null;
    }

    if (typeof obj.answers != 'object' || obj.answers.length == null) {
        return null;
    }

    if (typeof obj.correctAnswer != 'string') {
        return null;
    }

    const q = new Question(obj.question as string);
    for (var a of (obj.answers as {text: string, letter: string}[])) {
        if (a.letter != null) {
            const opt = parseJsonOption(a);
            q.addOption(opt);
        }
    }

    q.answer = new Option('', obj.correctAnswer as string);

    return q;
}


export function  parseQuestion(text: string) {
    console.log(`decode response ${text}`);
    
    const lines = text.split(/\r?\n/);

    let q = '';

    for (const l of lines) {
        if (l.trim().startsWith('Q:')) {
            q = l.trim().slice(2);
            break;
        }
    }

    if (q == '') {
        console.log('Question not found in response');
        return null;
    }

    console.log(`Add question ${q}`);
    const question = new Question(q);

    for (const l of lines) {
        if (l.trim().startsWith('A.') 
            || l.trim().startsWith('B.') 
            || l.trim().startsWith('C.') 
            || l.trim().startsWith('D.')) {
                const optString = l.trim();
                const option = parseOption(optString);
                if (option != null) {
                    question.addOption(option);
                    console.log(`Add option ${option.toString()}`);
                }
        }

        if (l.trim().startsWith('Answer:')) {
            question.answer = parseOption(l.trim().slice(8));
            console.log(`Add answer ${question.answer.toString()}`);
        }
    }
    
    return question.options.length > 0 && question.answer != null ? question : null;
}

export class Question {
    
    readonly options: Option[] = [];
    public answer: Option|null = null;
    
    constructor(readonly text: string) {
    }

    addOption(opt: Option) {
        this.options.push(opt);
    }
}

export class Option {
    constructor(readonly text: string, readonly letter: string) {
    }

    toString() {
        return `opt {text: ${this.text}, letter: ${this.letter}}`;
    }
}