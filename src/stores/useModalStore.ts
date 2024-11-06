import { create } from "zustand"



interface UseModalStoreProps {
  modals: { [key: string]: boolean }
  openModal: (modalName: string) => void
  closeModal: (modalName: string) => void
  toggleModal: (modalName: string) => void
}

export const useModalStore = create<UseModalStoreProps>((set) => ({
  modals: {},
  openModal: (modalName) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: false }
    }))
  },
  closeModal: (modalName) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: false }
    }))
  },

  toggleModal: (modalName) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: !state.modals[modalName] }
    }))
  }
})

)