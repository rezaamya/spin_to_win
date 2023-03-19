import './App.css';
import { useState } from 'react';
import Board from './components/board';
import Button from './components/button';
import BoardContext from './context/board-context';

function App() {
  const [rectangles, setRectangles] = useState([]);
  const [isSpinning, setSpin] = useState(false);
  const changeSpinStatus = (newStatus) => {
    setSpin(newStatus);
  };
  return (
    <>
      <BoardContext.Provider
        value={{ isSpinning: isSpinning, setSpin: changeSpinStatus }}
      >
        <div id="app">
          <Board
            isSpinning={isSpinning}
            rectangles={rectangles}
            setRectangles={setRectangles}
          />
          <Button isSpinning={isSpinning} />
        </div>
      </BoardContext.Provider>
    </>
  );
}

export default App;
