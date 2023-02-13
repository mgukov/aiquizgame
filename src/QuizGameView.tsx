import { Backdrop, Button, CircularProgress, Stack, styled } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { QuestionGenerator } from "./QuestionGenerator";
import { Question } from "./Question";
import { QuestionView } from "./QuestionView";
import { QuizGame } from "./QuizGame";


async function createGame() {
    const key =  await (await fetch('./openai.key')).text();
    const generator =  new QuestionGenerator(key, 'test');
    const game = new QuizGame(5, generator, 'software development');
    return game;
}

const Btn = styled(Button)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: 'center'
}));


const QuestionRenderer = (onClick: () => void, calueChanged: (v: string) => void, question: Question, game: QuizGame) => {
    return  (<Stack>
        <p>Question {game.getCurrentQuestionNum()} of {game.questionCount}</p>
        <QuestionView question={question} onChange={v => calueChanged(v)}/>
        <Btn onClick={() => onClick()}>Next question</Btn>
    </Stack>);
}

const ResultRenderer = (result: Number) => {
    return (<Paper><>Game completed, your result is {result} %</></Paper>);
}

const StartGameRenderer = (onClick: () => void) => {
    return  (<Btn onClick={() => onClick()}>Start game</Btn>);
}

export const QuizGameView = ({}: {}) => {

    const [game, setGame] = useState<QuizGame | null>(null);
    const [question, setQuestion] = useState<Question | null>(null);
    const [activity, setActivity] = useState<boolean>(false);
    const [answer, setAnswer] = useState<string|null>(null);
    const [complete, setCompletey] = useState<boolean>(false);

    // useEffect(() => {
    //     setIntervalValue('');
    // }, [currentInterval]);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));



    let gameView: ReactNode;
    if (question == null) {
        if (complete) {
            gameView = ResultRenderer(game!.getResult());
        } else {
            gameView = StartGameRenderer(async () => {
                setActivity(true);
                const game = await createGame();
                const q = await game.nextQuestion();
                setActivity(false);
        
                setGame(game);
                setQuestion(q);
            });
        }
    } else {
        gameView = QuestionRenderer(async () => {
            setActivity(true);
            if (game) {
                if (answer) {
                    game.setAnswerLetter(answer);
                }
                const q = await game!.nextQuestion();
                setCompletey(game!.isComplete());
                setQuestion(q);
            }
            setActivity(false);
        }, v => setAnswer(v), question, game!);
    }

    const m = (<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={activity}>
        <CircularProgress color="inherit" />
    </Backdrop>);
    return (
        <Box sx={{ width: '100%' }}>
                {gameView}
                {activity ? m : null}
        </Box>);
}