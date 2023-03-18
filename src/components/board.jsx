import { useState, useEffect } from 'react';

import React from 'react';
import Canvas from './Canvas';

const Board = () => {
  const [firstInitialization, setFirstInitialization] = useState(true);
  let canvas;
  let context;
  const skeletonImage = new Image();
  skeletonImage.src = '/assets/head.png';
  const canvasHeight = 320;
  const rectangleHeight = 300;
  const rectangleWidth = 200;
  const rectangleMarginTop = 10;
  const rectangleMarginRight = 4;
  const rectangleBorderColor = '#565f86';
  const rectangleBorderWidth = 1;
  const rectangleBorderRadius = 10;

  let firstRectangleStoppedAtX = 0;
  const rectangles = [];

  useEffect(() => {
    //initialize the board
    initCanvas();
  }, []);

  const initCanvas = () => {
    (async () => {
      if (firstInitialization) {
        //load skeleton image in memory to render faster
        await new Promise((resolve) => {
          skeletonImage.onload = () => {
            resolve(skeletonImage);
          };
        });

        window.addEventListener('resize', () => {
          setTimeout(resizeHandler, 500);
        });

        // In initialization, we should calculate the first left block position, based on middle-center block
        const numberOfRectangles = howManyRectangleIsFitInHalfOfScreen();
        firstRectangleStoppedAtX =
          window.innerWidth / 2 -
          rectangleWidth / 2 -
          (numberOfRectangles * rectangleMarginRight +
            numberOfRectangles * rectangleWidth);

        await resizeHandler();
        await draw();
        setFirstInitialization(false);
      }
    })();
  };

  async function drawRoundRect(
    x,
    y,
    width,
    height,
    radius,
    lineWidth = 2,
    color = '#000',
  ) {
    let r = x + width;
    let b = y + height;
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth / 2;
    context.moveTo(x + radius, y + 0.5);
    context.lineTo(r - radius, y + 0.5);
    context.quadraticCurveTo(r, y, r, y + radius);
    context.lineTo(r, y + height - radius + 0.5);
    context.quadraticCurveTo(r, b, r - radius, b);
    context.lineTo(x + radius, b + 0.5);
    context.quadraticCurveTo(x, b, x, b - radius);
    context.lineTo(x, y + radius + 0.5);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.stroke();

    //calculate height of the image based of resized width
    const imageNewWidthAfterResize = rectangleWidth / 2;
    const imageNewHeightAfterResize =
      (imageNewWidthAfterResize / skeletonImage.naturalWidth) *
      skeletonImage.naturalHeight;

    context.drawImage(
      skeletonImage,
      x + imageNewWidthAfterResize / 2,
      y + height / 2 - imageNewHeightAfterResize / 2,
      imageNewWidthAfterResize,
      imageNewHeightAfterResize,
    );
  }

  async function drawMiddleArrow(lineWidth, color) {
    const middleTop = window.innerWidth / 2;
    const middleBottom = middleTop + rectangleHeight;
    console.log('middleTop', middleTop);
    console.log('middleBottom', middleBottom);

    // draw middle line
    context.beginPath();
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.moveTo(middleTop, 0);
    context.lineTo(middleTop, middleBottom);
    context.stroke();
    context.closePath();

    // Draw Triangle on top
    context.beginPath();
    context.moveTo(middleTop - 8, 0);
    context.lineTo(middleTop + 8, 0);
    context.lineTo(middleTop, 16);
    context.fillStyle = color;
    context.fill();
    context.closePath();

    // Draw Triangle on bottom
    console.log('middleBottom', middleBottom);
    context.beginPath();
    context.moveTo(middleTop - 8, canvasHeight);
    context.lineTo(middleTop + 8, canvasHeight);
    context.lineTo(middleTop, canvasHeight - 16);
    context.closePath();
    context.fillStyle = color;
    context.fill();
  }

  const howManyRectangleIsFitInHalfOfScreen = () => {
    return Math.ceil(
      (window.innerWidth - rectangleWidth - rectangleMarginRight) /
        rectangleWidth /
        2,
    );
  };

  const draw = async () => {
    for (let i = 0; i < 1000; i++) {
      await drawRoundRect(
        firstRectangleStoppedAtX + i * (rectangleWidth + rectangleMarginRight),
        rectangleMarginTop,
        rectangleWidth,
        rectangleHeight,
        rectangleBorderRadius,
        rectangleBorderWidth,
        rectangleBorderColor,
      );
    }

    await drawMiddleArrow(4, '#fff');
  };

  const resizeHandler = async () => {
    canvas.current.width = window.innerWidth;
    canvas.current.height = canvasHeight;
    await clearAndDraw();
  };

  const clearAndDraw = async () => {
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      await draw();
    }
  };

  const rectangle = () => {
    return {
      height: 300,
      width: 200,
      marginTop: 10,
      marginRight: 4,
      borderColor: '#565f86',
      borderWidth: 1,
      borderRadius: 10,
    };
  };

  // function spin() {
  //   // setSpin(true);
  // }

  const setContext = (receivedContext) => {
    context = receivedContext;
  };

  const setCanvas = (receivedCanvas) => {
    canvas = receivedCanvas;
  };

  return (
    <>
      <Canvas getContext={setContext} getCanvas={setCanvas} />
    </>
  );
};

export default Board;
