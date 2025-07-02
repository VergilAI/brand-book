import { useRef, useCallback } from 'react';

export function useTextEditor2() {
  const contentRef = useRef('');
  const callbacksRef = useRef<{
    onChange?: (content: string) => void;
    onStatsUpdate?: (stats: any) => void;
  }>({});

  const setContent = useCallback((content: string) => {
    contentRef.current = content;
    callbacksRef.current.onChange?.(content);
  }, []);

  const getContent = useCallback(() => contentRef.current, []);

  const registerCallbacks = useCallback((callbacks: typeof callbacksRef.current) => {
    callbacksRef.current = callbacks;
  }, []);

  return {
    setContent,
    getContent,
    registerCallbacks,
  };
}