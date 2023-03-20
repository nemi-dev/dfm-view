import "../../style/Modal.scss"
import Modal from "react-modal"
import { useContext } from "react"
import { ModalContext } from "../../modalContext"
import { X } from "react-feather"


interface ItemModalProps {
  isOpen: boolean
}

export default function TheModal({ isOpen }: ItemModalProps) {
  const { closeModal, fragment } = useContext(ModalContext)
  return (
  <Modal className="Modal" overlayClassName="Overlay"
    isOpen={isOpen}
    shouldCloseOnOverlayClick={true}
    onRequestClose={closeModal}>
    <button className="CloseModalButton" onClick={closeModal}><X /></button>
    <div className="ModalContent">
      {fragment}
    </div>
  </Modal>)
}
