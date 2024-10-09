'use client'
import { createContext, ReactNode, useContext, useState } from 'react'

interface ModalContextProps {
  modals: { [key: string]: boolean }
  openModal: (modalName: string) => void
  closeModal: (modalName: string) => void
  toggleModal: (modalName: string) => void
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined)

export function DialogProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<{ [key: string]: boolean }>({})

  const openModal = (modalName: string) => {
    setModals((prev) => ({ ...prev, [modalName]: true }))
  }

  const closeModal = (modalName: string) => {
    setModals((prev) => ({ ...prev, [modalName]: false }))
  }

  const toggleModal = (modalName: string) => {
    setModals((prev) => ({ ...prev, [modalName]: !prev[modalName] }))
  }

  return (
    <ModalContext.Provider
      value={{ modals, openModal, closeModal, toggleModal }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a DialogProvider')
  }
  return context
}
