import './App.css';
import { useState } from 'react';
import Board from './components/board';
import Button from './components/button';

function App() {
  const [isSpinning, setSpin] = useState(false);
  return (
    <>
      <div id="app">
        <Board />
        <Button />
      </div>
    </>
  );
}

export default App;
