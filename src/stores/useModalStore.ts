import { create } from 'zustand'

// interface UserData {
//   id: string
//   name?: string
//   role?: UserRolesType
//   email?: string
//   password?: string
// }
interface AlertData {
  action: 'Deg' | 'Vent'
  name: string
  instrumentId: number
  active: boolean
  model: number
}

interface UseModalStoreProps<T = unknown> {
  modals: { [key: string]: boolean }
  data: T | null
  alertData: AlertData | null
  openModal: (modalName: string, data?: unknown, alertData?: AlertData) => void
  closeModal: (modalName: string) => void
  toggleModal: (modalName: string) => void
}

export const useModalStore = create<UseModalStoreProps>((set) => ({
  modals: {},
  alertData: null,
  data: null,
  openModal: (modalName, data?, alertData?) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: true },
      data: data || state.data,
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
