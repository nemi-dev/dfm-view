import "../../style/Modal.scss"
import Modal from "react-modal"
import { useContext } from "react"
import { ModalContext } from "../../modalContext"
import { CardModalFragment, EquipModalFragment } from "./EquipModal"
import { EmblemModalFragment } from "./EmblemModal"
import { RuneModalFragment, SpellModalFragment } from "./CrackModal"
import { DFClassModal } from "./DFClassModal"
import { acceptEmblem } from "../../emblem"
import { useAppSelector } from "../../feats/hooks"
import { selectWeaponAvatar, selectAura, selectSpell, selectItem, selectCard, selectEmblemSpecs } from "../../feats/selectors"
import { isCardable } from "../../items"
import { ItemName } from "../CommonUI"
import { ItemIcon, EmblemIcon } from "../widgets/Icons"


interface ItemModalProps {
  isOpen: boolean
}

function CloseModalButton() {
  const { setOpen } = useContext(ModalContext)
  return (
    <button className="CloseModalButton" onClick={() => setOpen(false)}>나가기</button>
  )
}


function ItemSelectModal() {
  const { message } = useContext(ModalContext)
  const { part, target } = message as ModalRequestForItem
  if (part === "봉인석") return <RuneModalFragment />
  if (part === "정수") return <SpellModalFragment />
  if (target === "MainItem") return <EquipModalFragment />
  if (target === "Card") return <CardModalFragment />
  return <EmblemModalFragment />
}



function mainItemSelector(part: WholePart, index?: number) {
  if (part === "무기아바타") return selectWeaponAvatar
  if (part === "오라") return selectAura
  if (part === "정수") return selectSpell(index)
  return selectItem[part]
}

interface CurrentPartProps {
  part: WholePart
  index?: number
}

function CurrentPart({ part, index }: CurrentPartProps) {
  const mainitem = useAppSelector(mainItemSelector(part, index))
  const card = isCardable(part)? useAppSelector(selectCard[part]) : null
  const emblems = isCardable(part)? useAppSelector(selectEmblemSpecs[part]) : []
  const accept = acceptEmblem(part as EquipPart | "칭호")
  return (
    <header>
      <div className="EquipSlot AlwaysEquipPartLayout CurrentPartItem">
        <ItemIcon item={mainitem} />
        <div className="SlotHeading">
          <ItemName item={mainitem} alt={`${part} 없음`} />
        </div>
        {(mainitem != null && isCardable(part)) ?
          <div className="EquipAddons">
            <ItemIcon className="Card" item={card} />
            {emblems.map((spec, index) => <EmblemIcon key={index} spec={spec} accept={accept} />
            )}
          </div> : null}
      </div>
    </header>
  )
}


function ModalRouter() {
  const { message } = useContext(ModalContext)
  switch(message.name) {
    case "item":
      return (
        <>
          <CurrentPart part={message.part} index={message.index} />
          <ItemSelectModal />
        </>)
    case "dfclass":
      return <DFClassModal />
  }
}

export default function TheModal({ isOpen }: ItemModalProps) {
  const { setOpen } = useContext(ModalContext)
  return (<Modal className="Modal" overlayClassName="Overlay"
    isOpen={isOpen}
    shouldCloseOnOverlayClick={true}
    onRequestClose={() => setOpen(false)}>
    <CloseModalButton />
    <div className="ModalContent">
      <ModalRouter />
    </div>
  </Modal>)
}
