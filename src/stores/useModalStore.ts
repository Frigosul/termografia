import { UserRolesType } from '@/utils/user-roles'
import { create } from 'zustand'

interface UserData {
  id: string
  name?: string
  role?: UserRolesType
  email?: string
  password?: string
}
interface AlertData {
  action: 'Deg' | 'Vent'
  name: string
  instrumentId: number
  active: boolean
  model: number
}

interface UseModalStoreProps {
  modals: { [key: string]: boolean }
  userData: UserData | null
  alertData: AlertData | null
  openModal: (
    modalName: string,
    userData?: UserData,
    alertData?: AlertData,
  ) => void
  closeModal: (modalName: string) => void
  toggleModal: (modalName: string) => void
}

export const useModalStore = create<UseModalStoreProps>((set) => ({
  modals: {},
  alertData: null,
  userData: null,
  openModal: (modalName, userData?, alertData?) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: true },
      userData: userData || state.userData,
      alertData: alertData || state.alertData,
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
