import { DependencyList, useCallback, useEffect } from 'react';
type Effect = () => void;

export function useDebounce(effect: Effect, dependencies: DependencyList, delay: number) {
  const callback = useCallback(effect, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}