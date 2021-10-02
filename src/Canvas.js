import React, { useRef, useEffect } from 'react';
import Paper from 'paper';
//import draw1 from 'draw1';
import CandyCrush from 'sketches/candy-crush/CandyCrush';
import './Canvas.css';

// https://stackoverflow.com/questions/56197908/how-to-use-paperjs-with-react

const Canvas = ({ width = 550, height = 320, ...props }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    Paper.setup(canvas);

    const candyCrush = new CandyCrush();

    const view = Paper.view;

    view.onFrame = event => {
      candyCrush.onFrame();
    };

    Paper.view.draw();
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
