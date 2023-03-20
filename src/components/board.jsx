import { useEffect, useContext } from 'react';
import BoardContext from '../context/board-context';
import Canvas from './Canvas';

const Board = ({ isSpinning, rectangles, setRectangles }) => {
  const boardContext = useContext(BoardContext);
  let canvas;
  let context;
  const skeletonImage = new Image();
  skeletonImage.src = '/assets/head.png';
  const winImage = new Image();
  winImage.src = '/assets/win.png';
  const canvasHeight = 320;
  const rectangleHeight = 300;
  const rectangleWidth = 200;
  const rectangleMarginTop = 10;
  const rectangleMarginRight = 4;
  const rectangleBorderColor = '#565f86';
  const rectangleBorderWidth = 1;
  const rectangleBorderRadius = 10;
  const logoWidth = rectangleWidth / 2;
  let logoHeight = logoWidth;
  let winLogoHeight = logoWidth;
  let resizeId;
  let isRotating = false;
  let numberOfRectangles = 100;
  const spinDuration = 4000; //MS
  let spinEndsAt = new Date();
  let intervalId = undefined;
  let middleTop = window.innerWidth / 2;
  let middleBottom = middleTop + rectangleHeight;
  const durationOfEachSpinFrameInterval = 10;
  const rectangleHighlightTransactionDuration = 50;
  const winRate = 0.2;
  const isWinner = false;
  let currentJumpSize = 0;
  let shouldCalculateMaxDistanceMovement = false;
  let maxDistanceMovementIsCalculated = false;
  let maxDistanceWeWillMoveBeforeStop = 0;

  const hoverAudio = new Audio();
  hoverAudio.src = '/assets/multimedia_rollover_037.mp3';
  hoverAudio.preload = 'auto';
  hoverAudio.load();

  let firstRectangleStoppedAtX = 0;

  useEffect(() => {
    //initialize the board
    initCanvas();
  }, []);

  const initCanvas = () => {
    (async () => {
      //load skeleton image in memory to render faster
      await new Promise((resolve) => {
        skeletonImage.onload = () => {
          resolve(skeletonImage);
        };
      });
      await new Promise((resolve) => {
        winImage.onload = () => {
          resolve(winImage);
        };
      });

      window.addEventListener('resize', () => {
        clearTimeout(resizeId);
        resizeId = setTimeout(resizeHandler, 500);
      });

      await resizeHandler();
    })();
  };

  async function drawRoundRect(rectangle) {
    let id = rectangle.id;
    let x = rectangle.x;
    let y = rectangle.y;
    let width = rectangle.width;
    let height = rectangle.height;
    let color = rectangle.color;
    let lineWidth = rectangle.lineWidth;
    let radius = rectangle.radius;
    let winState = rectangle.winState;
    let yellowBorder = rectangle.yellowBorder;
    let yellowBorderOpacity = rectangle.yellowBorderOpacity;
    let willStandOnMiddle = rectangle.willStandOnMiddle;

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

    if (yellowBorder) {
      context.beginPath();
      context.strokeStyle = `rgba(255,232,0,${yellowBorderOpacity})`;
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
    }

    if (willStandOnMiddle) {
      if (isWinner && !winState) {
        // user is winner but rectangle will not show winState, so we need to force winState
        for (let i = 0; i < rectangles.length; i++) {
          if (rectangles[i].id === id) {
            rectangles[i].winState = true;
            break;
          }
        }
        for (let i = 0; i < rectangles.length; i++) {
          if (rectangles[i].id !== id && rectangles[i].winState) {
            rectangles[i].winState = false;
            break;
          }
        }
        winState = true;
      } else if (!isWinner && winState) {
        // user is loser but rectangle will show winState, so we need to remove winState by force
        for (let i = 0; i < rectangles.length; i++) {
          if (rectangles[i].id === id) {
            rectangles[i].winState = false;
            break;
          }
        }
        for (let i = 0; i < rectangles.length; i++) {
          if (rectangles[i].id !== id && !rectangles[i].winState) {
            rectangles[i].winState = true;
            break;
          }
        }
        winState = false;
      }
    }

    if (winState) {
      context.drawImage(
        winImage,
        x + logoWidth / 2,
        y + height / 2 - winLogoHeight / 2,
        logoWidth,
        winLogoHeight,
      );
    } else {
      context.drawImage(
        skeletonImage,
        x + logoWidth / 2,
        y + height / 2 - logoHeight / 2,
        logoWidth,
        logoHeight,
      );
    }
  }

  async function drawMiddleArrow(lineWidth, color) {
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

  function shuffleArray(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const initDraw = async () => {
    const numberOfWinners = numberOfRectangles * winRate;
    let arrayOfWinnerAndLosers = [];
    for (let index = 0; index < numberOfRectangles; index++) {
      if (index < numberOfWinners) {
        arrayOfWinnerAndLosers.push(true);
      } else {
        arrayOfWinnerAndLosers.push(false);
      }
    }
    arrayOfWinnerAndLosers = shuffleArray(arrayOfWinnerAndLosers);

    rectangles = [];
    setRectangles([]);
    for (let i = 0; i < arrayOfWinnerAndLosers.length; i++) {
      let addedRectangle = {
        id: i,
        x:
          firstRectangleStoppedAtX +
          i * (rectangleWidth + rectangleMarginRight),
        y: rectangleMarginTop,
        width: rectangleWidth,
        height: rectangleHeight,
        radius: rectangleBorderRadius,
        lineWidth: rectangleBorderWidth,
        color: rectangleBorderColor,
        yellowBorder: false,
        yellowBorderOpacity: 1,
        winState: arrayOfWinnerAndLosers[i],
        willStandOnMiddle: false,
      };
      await drawRoundRect(addedRectangle);

      if (rectangles.length < numberOfRectangles) {
        rectangles.push(addedRectangle);
      }
    }

    setRectangles(rectangles);

    await drawMiddleArrow(4, '#fff');
  };

  const resizeHandler = async () => {
    setRectangles([]);
    canvas.current.width = window.innerWidth;
    canvas.current.height = canvasHeight;
    middleTop = window.innerWidth / 2;
    middleBottom = middleTop + rectangleHeight;

    if (!isRotating) {
      // In initialization, we should calculate the first left block position, based on middle-center block
      const numberOfRectanglesInHalfOfScreen =
        howManyRectangleIsFitInHalfOfScreen();
      firstRectangleStoppedAtX = parseInt(
        middleTop -
          rectangleWidth / 2 -
          (numberOfRectanglesInHalfOfScreen * rectangleMarginRight +
            numberOfRectanglesInHalfOfScreen * rectangleWidth),
      );
      logoHeight =
        (logoWidth / skeletonImage.naturalWidth) * skeletonImage.naturalHeight;
      winLogoHeight =
        (logoWidth / winImage.naturalWidth) * winImage.naturalHeight;
    }

    await clearAndDraw();
  };

  const clearAndDraw = async () => {
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      await initDraw();
    }
  };

  if (isSpinning) {
    (async () => {
      if (!isRotating) {
        isRotating = true;
        await spin();
      }
    })();
  }

  async function removeRectangleHighlight(rectangle) {
    if (rectangle.x < middleTop && middleTop < rectangle.x + rectangleWidth) {
      //this rectangle is in middle and should stay highlighted
      if (rectangle.timesThatIsStandingInMiddle < 100) {
        rectangle.timesThatIsStandingInMiddle += 1;
        setTimeout(() => {
          removeRectangleHighlight(rectangle);
        }, rectangleHighlightTransactionDuration);
      }
    } else if (rectangle.x + rectangleWidth < 0) {
      // this rectangle is outside the view, and it's highlight should remove immediately
      rectangle.yellowBorder = false;
      rectangle.yellowBorderOpacity = 0;
    } else {
      //this rectangle is going outside, and it's highlight should remove slowly
      rectangle.yellowBorderOpacity -= 0.05;
      if (rectangle.yellowBorderOpacity >= 0) {
        setTimeout(() => {
          removeRectangleHighlight(rectangle);
        }, rectangleHighlightTransactionDuration);
      }
    }

    if (!isRotating) {
      await drawForSpin();
    }
  }

  async function shiftAndPush(array) {
    const clone = [...array];
    array.map((tempRectangle, tempIndex) => {
      if (tempRectangle.x + rectangleWidth < 0) {
        //this rectangle is outside of view, we move it to the end of the list
        clone.shift();
        tempRectangle.x =
          clone[clone.length - 1].x + rectangleMarginRight + rectangleWidth;
        tempRectangle.yellowBorder = undefined;
        tempRectangle.yellowBorderOpacity = 0;
        clone.push(tempRectangle);
      }
    });
    return clone;
  }

  async function drawForSpin() {
    context.clearRect(0, 0, canvas.current.width, canvas.current.height);

    rectangles = await shiftAndPush(rectangles);

    for await (const rectangle of rectangles) {
      if (0 - rectangleWidth < rectangle.x && rectangle.x < window.innerWidth) {
        //play sound
        (() => {
          hoverAudio.play();
        })();

        await drawRoundRect(rectangle);
      }

      await drawMiddleArrow(4, '#fff');
    }
  }

  async function removeStandOnMiddleMarks() {
    rectangles.map((value, index) => {
      if (value.willStandOnMiddle) {
        rectangles[index].willStandOnMiddle = false;
      }
    });
  }

  async function spin() {
    removeStandOnMiddleMarks();
    let maxJump = rectangleWidth;
    let minJump = 1;
    spinEndsAt = new Date();
    spinEndsAt.setMilliseconds(spinEndsAt.getMilliseconds() + spinDuration);
    shouldCalculateMaxDistanceMovement = false;
    maxDistanceMovementIsCalculated = false;
    maxDistanceWeWillMoveBeforeStop = 0;

    if (!intervalId) {
      clearInterval(intervalId);
      currentJumpSize = 0;
      intervalId = setInterval(async () => {
        let currentLoopIsHappeningAt = new Date();
        const dateDifference =
          spinEndsAt.getTime() - currentLoopIsHappeningAt.getTime();
        if (dateDifference < 0) {
          // stop spin
          isRotating = false;
          clearInterval(intervalId);
          boardContext.setSpin(false);

          setRectangles(rectangles);
        } else {
          // we have time to continue the spinning
          const percentRemainingOfSpinningTime = dateDifference / spinDuration;

          if (0.5 < percentRemainingOfSpinningTime) {
            currentJumpSize += minJump;
          } else {
            currentJumpSize -= minJump;
            if (!maxDistanceMovementIsCalculated) {
              shouldCalculateMaxDistanceMovement = true;
            }
          }

          if (currentJumpSize > maxJump) {
            currentJumpSize = maxJump;
          }
          if (currentJumpSize < minJump) {
            currentJumpSize = minJump;
          }

          if (shouldCalculateMaxDistanceMovement && currentJumpSize < 30) {
            // spin is going to stop, we need to calculate the distance to final card
            let tempCurrentJumpSize = currentJumpSize;
            while (tempCurrentJumpSize > 0) {
              if (tempCurrentJumpSize > maxJump) {
                tempCurrentJumpSize = maxJump;
              }
              if (tempCurrentJumpSize < minJump) {
                tempCurrentJumpSize = minJump;
              }
              maxDistanceWeWillMoveBeforeStop += tempCurrentJumpSize;
              tempCurrentJumpSize -= 1;
            }

            let remainDistanceToStopOnMiddle =
              middleTop + maxDistanceWeWillMoveBeforeStop;
            let lastRectangle = rectangles[rectangles.length - 1];

            if (remainDistanceToStopOnMiddle < lastRectangle.x) {
              // movement will stop on current spin
              // so the block that will stand in middle after stop, is in the current queue
            } else {
              remainDistanceToStopOnMiddle =
                remainDistanceToStopOnMiddle % lastRectangle.x;
            }

            rectangles.map((value, index) => {
              if (
                value.x <= remainDistanceToStopOnMiddle &&
                remainDistanceToStopOnMiddle <=
                  value.x + rectangleWidth + rectangleMarginRight
              ) {
                rectangles[index].willStandOnMiddle = true;
              }
            });

            shouldCalculateMaxDistanceMovement = false;
            maxDistanceMovementIsCalculated = true;
          }

          rectangles.map((value, index) => {
            let newX = rectangles[index].x - currentJumpSize;

            if (newX < middleTop && middleTop < newX + rectangleWidth) {
              rectangles[index].yellowBorder = true;
              rectangles[index].yellowBorderOpacity = 1;
              rectangles[index].timesThatIsStandingInMiddle = 0;
              setTimeout(() => {
                removeRectangleHighlight(rectangles[index]);
              }, rectangleHighlightTransactionDuration);
            }
            rectangles[index].x = newX;
          });

          await drawForSpin();
        }
      }, durationOfEachSpinFrameInterval);
    }
  }

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
