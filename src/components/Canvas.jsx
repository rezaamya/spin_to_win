import React from 'react';
import PropTypes from 'prop-types';
const Canvas = ({ getCanvas, getContext /*, height, width*/ }) => {
  const canvas = React.useRef();
  React.useEffect(() => {
    const context = canvas.current.getContext('2d');
    getCanvas(canvas);
    getContext(context);
  });
  return <canvas ref={canvas} /*width={width} height={height}*/ />;
};
Canvas.propTypes = {
  getCanvas: PropTypes.func.isRequired,
  getContext: PropTypes.func.isRequired,
  // height: PropTypes.number.isRequired,
  // width: PropTypes.number.isRequired,
};
export default Canvas;
