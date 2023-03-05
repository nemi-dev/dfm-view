import "../style/Modal.scss"
import Modal from "react-modal"
import { useAppSelector } from "../feats/hooks"
import { getItem } from "../items"
import { acceptEmblem } from "../emblem"
import { EmblemIcon, ItemIcon, ItemName } from "./CommonUI"
import { useContext } from "react"
import { RootState } from "../feats/store"
import { ModalContext } from "../modalContext"
import { CardModalFragment, EquipModalFragment } from "./modals/EquipModal"
import { EmblemModalFragment } from "./modals/EmblemModal"
import { RuneModalFragment, SpellModalFragment } from "./modals/CrackModal"
import { selectWeaponAvatar, selectAura, selectDFTitle, selectDFTitleCard } from "../feats/avatarSelectors"


interface ItemModalProps {
  isOpen: boolean
}



type ItemSelector = (s: RootState) => Attrs
type EmblemSpecSelector = (s: RootState) => EmblemSpec[]

function properCurrentSelectors(part: WholePart): [ItemSelector, ItemSelector, EmblemSpecSelector] {
  if (part === "무기아바타") return [ selectWeaponAvatar as ItemSelector, () => null, () => null]
  if (part === "오라") return [ selectAura as ItemSelector, () => null, () => null ]
  if (part === "칭호") return [
    selectDFTitle as ItemSelector,
    selectDFTitleCard,
    (state: RootState) => state.Avatar.emblem
  ]
  return [
    (state: RootState) => getItem(state.Equips[part].name),
    (state: RootState) => getItem(state.Equips[part].card),
    (state: RootState) => state.Equips[part].emblems,
  ]
}


function CloseModalButton() {
  const { setOpen } = useContext(ModalContext)
  return (
    <button className="CloseModalButton" onClick={() => setOpen(false)}>나가기</button>
  )
}



function CurrentPart() {
  const { itarget: [part, target, index] } = useContext(ModalContext)
  if (part === "봉인석" || part === "정수") return null
  const [selectEquip, selectCard, selectEmblem] = properCurrentSelectors(part)
  const equip = useAppSelector(selectEquip)
  const card = useAppSelector(selectCard)
  const emblems = useAppSelector(selectEmblem)
  const accept = acceptEmblem(part as EquipPart | "칭호")
  return (
    <header>
      <div className="EquipSlot AlwaysEquipPartLayout CurrentPartItem">
      <ItemIcon attrs={equip} />
      <div className="SlotHeading">
        <ItemName item={equip} alt={`${part} 없음`} />
      </div>
      {
        (equip != null && part !== "무기아바타" && part !== "오라")? 
        <div className="EquipAddons">
          <ItemIcon className="Card" attrs={card}/>
          {emblems.map((spec, index) => <EmblemIcon key={index} spec={spec} accept={accept}/>
          )}
        </div> : null
      }
    </div>
    </header>
  )
}

function ModalFragment() {
  const { itarget: [part, target, index] } = useContext(ModalContext)
  if (part === "봉인석") return <RuneModalFragment />
  if (part === "정수") return <SpellModalFragment />
  if (target === "Equip") return <EquipModalFragment />
  if (target === "Card") return <CardModalFragment />
  return <EmblemModalFragment />
}

export function ItemSelectModal({ isOpen }: ItemModalProps) {
  const { setOpen } = useContext(ModalContext)
  return (<Modal className="Modal" overlayClassName="Overlay" isOpen={isOpen} shouldCloseOnOverlayClick={true} onRequestClose={() => setOpen(false)}>
    <CloseModalButton />
    <CurrentPart />
    <ModalFragment />
  </Modal>)
}
