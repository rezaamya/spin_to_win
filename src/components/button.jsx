import { useContext } from 'react';
import BoardContext from '../context/board-context';

const Button = ({ isSpinning }) => {
  const boardContext = useContext(BoardContext);
  return (
    <>
      <div>
        <button
          disabled={isSpinning ? 'disabled' : ''}
          className={isSpinning ? 'spinBtn disabled' : 'spinBtn'}
          onClick={spin}
        >
          Spin my chance!
        </button>
      </div>
    </>
  );

  function spin() {
    if (!boardContext.isSpinning) {
      boardContext.setSpin(true);
    }
  }
};

export default Button;
