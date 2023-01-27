import {RefObject, useEffect, useRef} from 'react';


const useClickOutside = (
    ref: RefObject<HTMLElement | null>,
    callback: () => void,
) => {
    const savedCallback = useRef(callback);
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const handler = (event: Event) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                savedCallback.current();
            }
        }
        window.addEventListener('mousedown', handler);
        window.addEventListener('touchstart', handler);
        window.addEventListener('focusin', handler);
        return () => {
            window.removeEventListener('mousedown', handler);
            window.removeEventListener('touchstart', handler);
            window.removeEventListener('focusin', handler);
        }
    }, [ref]);
}

export default useClickOutside;
