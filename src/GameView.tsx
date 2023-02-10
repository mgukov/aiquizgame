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
    const game = new QuizGame(5, generator);
    return game;
}


export const GameView = ({}: {}) => {
    const [game, setGame] = useState<QuizGame | null>(null);
    const [question, setQuestion] = useState<Question | null>(null);
    const [activity, setActivity] = useState<boolean>(false);
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


    const Btn = styled(Button)(({ theme }) => ({
        ...theme.typography.body2,
        padding: theme.spacing(3),
        textAlign: 'center'
    }));

    let gameView: ReactNode;
    if (question == null) {
        gameView = (<Btn onClick={async () => {
            setActivity(true);
            const game = await createGame();
            const q = await game.nextQuestion();
            setActivity(false);

            setGame(game);
            setQuestion(q);

        }}>Start game</Btn>);
    } else {
        gameView = (<Stack>
            <QuestionView question={question}></QuestionView>
            <Btn onClick={async () => {
                setActivity(true);
                const q = await game!.nextQuestion();
                setActivity(false);
                setQuestion(q);
            }}>Next question</Btn>
        </Stack>);
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