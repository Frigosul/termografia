import { DependencyList, useEffect } from 'react'

type Effect = () => void

export function useDebounce(
  effect: Effect,
  dependencies: DependencyList,
  delay: number,
) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      effect() // Chama o efeito quando o timeout é concluído
    }, delay)

    return () => clearTimeout(timeout) // Limpa o timeout se as dependências mudarem ou o componente desmontar
  }, [dependencies, delay, effect]) // Inclua todas as dependências e o delay
}
