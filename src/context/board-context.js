import { createContext } from 'react';

const BoardContext = createContext({
  isSpinning: false,
  setSpin: () => {},
});

export default BoardContext;
