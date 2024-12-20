import { create } from 'zustand'

interface AppearanceStoreProps {
  appearanceMode: 'simple' | 'graph'
  onModeAppearance: (appearance: 'simple' | 'graph') => void
}

export const useApperanceStore = create<AppearanceStoreProps>((set) => ({
  appearanceMode: 'graph',
  onModeAppearance: (appearance) => {
    set(() => ({
      appearanceMode: appearance,
    }))
  },
}))
