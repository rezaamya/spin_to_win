import { useState, useEffect } from 'react';

import React from 'react';
import Canvas from './Canvas';

const Board = () => {
  useEffect(() => {
    //initialize the board
    window.addEventListener('resize', () => {
      setTimeout(resizeHandler, 500);
    });
    resizeHandler();
    draw();
  }, []);

  const draw = () => {
    // const board = new Board('board');
    Board._context.beginPath();
    Board._context.moveTo(0, 0);
    Board._context.lineTo(300, 150);
    Board._context.stroke();
  };

  const resizeHandler = () => {
    Board._canvas.current.width = window.innerWidth;
    Board._canvas.current.height = Board._height;
    clearAndDraw();
  };

  const clearAndDraw = () => {
    if (Board._context) {
      Board._context.clearRect(0, 0, Board._canvas.width, Board._canvas.height);
      draw();
    }
  };

  class Board {
    static _height = 320;
    static _firstInitialization = true;
    static _firstRectangleStoppedAtX = 0;
    static _canvas;
    static _context;
    constructor() {}
  }

  class Rectangle {
    static _height = 300;
    static _width = 200;
    static _marginTop = 10;
    static _marginRight = 4;
    static _borderColor = '#565f86';
    static _borderWidth = 1;
    static _borderRadius = 10;
  }

  class SkeletonHeadImage {
    static _SkeletonHead = './assets/head.png';
    static _base64 = '';
  }

  function spin() {
    // setSpin(true);
  }

  const setContext = (context) => {
    Board._context = context;
  };

  const setCanvas = (canvas) => {
    Board._canvas = canvas;
  };

  return (
    <>
      <Canvas id="board" getContext={setContext} getCanvas={setCanvas} />
    </>
  );
};

export default Board;
