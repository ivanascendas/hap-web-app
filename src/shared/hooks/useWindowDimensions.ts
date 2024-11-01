import { useState, useEffect } from 'react';

/**
 * A React hook that returns the current dimensions of the browser window.
 * 
 * This hook uses the `useState` and `useEffect` hooks to track the window dimensions
 * and update the state accordingly. It adds an event listener for the `resize` event
 * and updates the state when the window is resized. The returned object contains the
 * current `width` and `height` of the window.
 * 
 * @returns An object containing the current width and height of the browser window.
 */
const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowDimensions;
};

export default useWindowDimensions;
