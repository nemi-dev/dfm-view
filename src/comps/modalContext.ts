import { createContext, Dispatch, SetStateAction } from "react";

export interface ModalContextType {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;

  itarget: [WholePart, ModalTargetSelector, number]

  openModal: (part: WholePart, target: ModalTargetSelector, index?: number) => any
}

export const ModalContext = createContext<ModalContextType>({
  isOpen: false, setOpen: (b) => { },
  itarget: ["무기", "Equip", 0],
  openModal: () => {}
});
