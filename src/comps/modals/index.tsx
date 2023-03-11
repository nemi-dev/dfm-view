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
import { selectSpell } from "../../feats/selectors"
import { selectArtifacts, selectArtifact } from "../../feats/selector/creatureSelectors"
import { selectItem, selectCard, selectEmblemSpecs } from "../../feats/selector/equipSelectors"
import { isCardable } from "../../items"
import { ItemName } from "../widgets/ItemNameView"
import { ItemIcon, EmblemIcon } from "../widgets/Icons"
import { ArtifactModalFragment, CreatureModalFragment } from "./CreatureModal"


interface ItemModalProps {
  isOpen: boolean
}

function CloseModalButton() {
  const { setOpen } = useContext(ModalContext)
  return (
    <button className="CloseModalButton" onClick={() => setOpen(false)}>나가기</button>
  )
}


function ModalRouter() {
  const { message } = useContext(ModalContext)
  const { name } = message as ModalRequest
  if (name !== "item") return
  const { part, target } = message as ModalRequestForItem

  if (part === "봉인석") return <RuneModalFragment />
  if (part === "정수") return <SpellModalFragment />
  if (part === "크리쳐") return <CreatureModalFragment />
  if (part === "아티팩트") return <ArtifactModalFragment />
  if (target === "MainItem") return <EquipModalFragment />
  if (target === "Card") return <CardModalFragment />
  return <EmblemModalFragment />
}



function mainItemSelector(part: WholePart, index?: number | "Red" | "Green" | "Blue") {
  if (part === "정수") return selectSpell(index as number)
  if (part === "아티팩트") return selectArtifact(index as "Red"|"Green"|"Blue")
  return selectItem[part]
}

interface CurrentPartProps {
  part: WholePart
  index?: number | "Red" | "Green" | "Blue"
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


function ModalFragment() {
  const { message } = useContext(ModalContext)
  switch(message.name) {
    case "item":
      return (
        <>
          <CurrentPart part={message.part} index={message.index} />
          <ModalRouter />
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
      <ModalFragment />
    </div>
  </Modal>)
}
