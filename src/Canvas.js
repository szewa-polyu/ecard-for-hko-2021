import React, { useRef, useEffect, useCallback, useState } from 'react';
import Paper from 'paper';
//import draw1 from 'draw1';
import CandyCrush from 'sketches/candy-crush/CandyCrush';
import './Canvas.css';

// https://stackoverflow.com/questions/56197908/how-to-use-paperjs-with-react

const Canvas = _ => {
  const playTransitionTime = 3000;

  const [isPlay, setIsPlay] = useState(false);
  const [isShowStopButton, setIsShowStopButton] = useState(false);

  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const candyCrushRef = useRef(null);

  useEffect(_ => {
    Paper.setup(canvasRef.current);
    candyCrushRef.current = new CandyCrush();
  }, []);

  useEffect(
    _ => {
      if (isPlay) {
        const view = Paper.view;
        candyCrushRef.current.start(playTransitionTime);
        view.onFrame = event => {
          candyCrushRef.current.onFrame();
        };

        view.draw();
        audioRef.current.play();
      }
    },
    [isPlay]
  );

  const handlePlayButtonClick = useCallback(_ => {
    setIsPlay(true);

    setTimeout(_ => {
      setIsShowStopButton(true);
    }, playTransitionTime + 1000);
  }, []);

  const handleStopButtonClick = useCallback(_ => {
    setIsPlay(false);
    setIsShowStopButton(false);
    candyCrushRef.current.reset();
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  return (
    <div className='canvas-container'>
      <canvas
        ref={canvasRef}
        className={`ecard-canvas ${isPlay ? 'show' : 'hide'}`}
      />
      <button
        className={`button play ${isPlay ? 'hide' : 'show'}`}
        onClick={handlePlayButtonClick}
      />
      <button
        className={`button stop ${isShowStopButton ? 'show' : 'hide'}`}
        onClick={handleStopButtonClick}
      />
      <audio
        ref={audioRef}
        src={
          process.env.PUBLIC_URL +
          'audio/we-wish-you-a-merry-christmas-traditionally-16th-century-english-christmas-carol-sheppard-flute-and-xmas-waltz-8848.mp3'
        }
        loop={true}
      />
    </div>
  );
};

export default Canvas;
