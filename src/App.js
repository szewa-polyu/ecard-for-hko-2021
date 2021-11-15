import Canvas from './Canvas';
import useElementSize from 'hooks/useElementSize';
import './App.css';

const ecardContainerId = 'ecardContainer';

const App = _ => {
  const { width: ecardContainerWidth, height: ecardContainerHeight } =
    useElementSize(ecardContainerId);

  console.log(ecardContainerHeight);

  return (
    <div className='App'>
      <div id={ecardContainerId} className='ecard-container'>
        <Canvas />
      </div>
    </div>
  );
};

export default App;
