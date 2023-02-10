import { Button, FormControl, FormControlLabel, Radio, RadioGroup, Stack, styled } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { QuestionGenerator } from "./QuestionGenerator";
import { Question } from "./Question";
import { StyledComponent } from "@emotion/styled";

export const QuestionView = ({question}: {question: Question}) => {
    const [error, setError] = useState<string | null>(null);
    const [intervalValue, setIntervalValue] = useState('10');

    // useEffect(() => {
    //     setIntervalValue('');
    // }, [currentInterval]);

    const QuestionItem = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        fontSize: '15pt'
    }));

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        marginTop: theme.spacing(1),
        textAlign: 'start',
        color: theme.palette.text.secondary,
    }));

    var items: ReactNode[] = [];
    
    for (const opt of question.options) {
        items.push(<Item key={opt.text}><FormControlLabel control={<Radio></Radio>} label={opt.text} value={opt.text}></FormControlLabel></Item>)
    }

    return (<Box sx={{ width: '100%' }}
    display="flex"
    justifyContent="center"
    alignItems="center">
        <Box sx={{ width: '80%' }} >

            <Stack spacing={1} >
                <QuestionItem>{question.text}</QuestionItem>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
            >
                {items}
            </RadioGroup>
                    
            </Stack>
        </Box></Box>
        );
}