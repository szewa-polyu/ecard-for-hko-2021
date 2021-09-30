import React, { useRef, useEffect } from 'react';
import Paper from 'paper';
import draw1 from 'draw1';
import './Canvas.css';

// https://stackoverflow.com/questions/56197908/how-to-use-paperjs-with-react

const Canvas = ({ width = 550, height = 320, ...props }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    Paper.setup(canvas);
    draw1();
  }, []);

  return (
    <div className='canvas-container'>
      <canvas
        className='ecard-canvas'
        ref={canvasRef}
        {...props}
        width={width}
        height={height}
      />
    </div>
  );
};

export default Canvas;
