import React from 'react';
import logo from './logo.svg';
import './App.css';
import { QuestionView } from './QuestionView';
import { GameView } from './GameView';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GameView key={'test'}></GameView>
      </header>
    </div>
  );
}

export default App;
