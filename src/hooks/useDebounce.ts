import { DependencyList, useEffect } from "react";

type Effect = () => void;

export function useDebounce(
  effect: Effect,
  dependencies: DependencyList,
  delay: number
) {
  useEffect(() => {
    const timeout = setTimeout(effect, delay);
    return () => clearTimeout(timeout);
  }, [...dependencies, delay]);
}
