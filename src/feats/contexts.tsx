import { createContext } from "react"

export interface ModalContextType {

  fragment: JSX.Element | undefined

  /** 모달을 그냥 확! 으이? */
  openModal: (children: JSX.Element) => unknown

  closeModal: () => unknown

}

export const ModalContext = createContext<ModalContextType>({
  fragment: <></>,
  openModal: (children) => {},
  closeModal: () => {},
})

export interface TabContextType {
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

export const PortraitMode = createContext(false)
export const TabContext = createContext<TabContextType>({
  activeTab: "장비",
  setActiveTab: (s) => {}
})
