import "../../style/Modal.scss"
import Modal from "react-modal"
import { useContext } from "react"
import { ModalContext } from "./modalContext"
import { X } from "react-feather"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"



function ModalIsBroken({ error, resetErrorBoundary } : FallbackProps) {
  return (
    <div>
      <h3>
      이런! 선택창이 고장나버렸어요! 어서 개발자에게 알려주세요!
      </h3>
      <div>
        오류 이름 : {error.name}
      </div>
      <div>
        오류 메시지 : {error.message}
      </div>
      <div>
        오류 스택 : {error.stack}
      </div>
      <button onClick={resetErrorBoundary}>새로고침</button>
    </div>
  )
}

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
      <ErrorBoundary FallbackComponent={ModalIsBroken}>
      {fragment}
      </ErrorBoundary>
    </div>
  </Modal>)
}
