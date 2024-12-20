import { UserRolesType } from '@/utils/user-roles'
import { create } from 'zustand'

interface UserData {
  id: string
  name?: string
  role?: UserRolesType
  email?: string
  password?: string
}

interface UseModalStoreProps {
  modals: { [key: string]: boolean }
  userData: UserData | null
  openModal: (modalName: string, userData?: UserData) => void
  closeModal: (modalName: string) => void
  toggleModal: (modalName: string) => void
}

export const useModalStore = create<UseModalStoreProps>((set) => ({
  modals: {},
  userData: null,
  openModal: (modalName, userData?) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: true },
      userData: userData || state.userData,
    }))
  },
  closeModal: (modalName) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: false },
    }))
  },
  toggleModal: (modalName) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: !state.modals[modalName] },
    }))
  },
}))
