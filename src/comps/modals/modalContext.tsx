import { createContext } from "react";

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
