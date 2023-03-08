import { createContext, Dispatch, SetStateAction } from "react";

export interface ModalContextType {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>

  message: ModalRequest
  openModal: (m: ModalRequest) => unknown
}

export const ModalContext = createContext<ModalContextType>({
  isOpen: false, setOpen: (b) => { },
  message: null,
  openModal: () => {}
});
