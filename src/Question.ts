

function parseOption(text: string) : Option {
    return new Option(text.slice(3), text.slice(0, 1));
}


export function  parseQuestion(text: string) {
    console.log(`decode response ${text}`);
    const lines = text.split(/\r?\n/);

    let q = '';

    for (const l of lines) {
        if (l.trim().startsWith('Q:')) {
            q = l.trim();
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
                    console.log(`Add option ${optString}`);
                }
        }

        if (l.trim().startsWith('Answer')) {
            question.answer = parseOption(l.trim());;
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
}