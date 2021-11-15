import { useEffect, useRef } from 'react';

const useEventListener = ({ eventName, handler, elementId }) => {
  // Create a ref that stores handler
  const savedHandler = useRef(null);

  useEffect(() => {
    // Define the listening target
    const targetElement = document.getElementById(elementId) || window;
    if (!(targetElement && targetElement.addEventListener)) {
      return null;
    }

    // Update saved handler if necessary
    if (savedHandler.current !== handler) {
      savedHandler.current = handler;
    }

    // Create event listener that calls handler function stored in ref
    const eventListener = event => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!savedHandler?.current) {
        savedHandler.current(event);
      }
    };

    targetElement.addEventListener(eventName, eventListener);

    // Remove event listener on cleanup
    return _ => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, elementId, handler]);
};

export default useEventListener;
