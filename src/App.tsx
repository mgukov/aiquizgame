import React from 'react';
import logo from './logo.svg';
import './App.css';
import { QuestionView } from './QuestionView';
import { QuizGameView } from './QuizGameView';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <QuizGameView key={'test'}></QuizGameView>
      </header>
    </div>
  );
}

export default App;
