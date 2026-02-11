import { useEffect } from 'react';

export function useClickOutside<T extends HTMLElement>(
    ref: React.RefObject<T | null>,
    handler: () => void
) {
    useEffect(() => {
        const listener = (e: MouseEvent) => {
            if (!ref.current || ref.current.contains(e.target as Node)) return;
            handler();
        };

        document.addEventListener('mousedown', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
        };
    }, [ref, handler]);
}