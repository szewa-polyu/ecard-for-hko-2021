import { useCallback, useLayoutEffect, useState } from 'react';

// See: https://usehooks-ts.com/react-hook/use-event-listener
import useEventListener from './useEventListener';

// https://usehooks-ts.com/react-hook/use-element-size

const useElementSize = ({ elementId }) => {
  const [size, setSize] = useState({
    width: 0,
    height: 0
  });

  // Prevent too many rendering using useCallback
  const handleSize = useCallback(
    event => {
      const node = event?.target;
      if (node) {
        setSize({
          width: node.offsetWidth || 0,
          height: node.offsetHeight || 0
        });
      }
    },
    [elementId]
  );

  useEventListener('resize', handleSize, elementId);

  // Initial size on mount
  useLayoutEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return size;
};

export default useElementSize;
