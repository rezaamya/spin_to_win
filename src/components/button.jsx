import { useState } from 'react';

const Button = () => {
  return (
    <>
      <div>
        <button className="spinBtn" onClick={spin}>
          Spin my chance!
        </button>
      </div>
    </>
  );

  function spin() {
    console.log('Spin');
  }
};

export default Button;
