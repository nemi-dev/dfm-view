import { useCallback, useContext } from "react"
import { useAppDispatch } from "../../feats/hooks"
import { _action_card_, _action_equip_ } from "../../feats/modalIntergrating"
import { getCardsForPart, getItemsByPart } from "../../items"
import { ItemIcon2, ItemName } from "../CommonUI"
import { ModalContext } from "../modalContext"

function EquipSelect({ item }: { item: Attrs }) {
  const { itarget: [part,,], setOpen } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    dispatch(_action_equip_(part, item.name))
    setOpen(false)
  }, [part, item.name])
  return (
    <div className="ModalItemSelect" onClick={onClick}>
      <ItemIcon2 attrs={item}/>
      <ItemName item={item} className="ItemNameResponsive" />
    </div>
  )
}

export function EquipModalFragment() {
  const { itarget: [part,,] } = useContext(ModalContext)
  const items = getItemsByPart(part)
  return (
    <>
    <div className="ItemSelectScrollable">
      <h4>단일 장비</h4>
      <div className="ItemSelectArray">
      {items.map((item) => (
        <EquipSelect key={item.name} item={item} />
      ))}
      </div>
      <h4>세트 한번에 끼기</h4>
      <div className="ItemSelectArray">

      </div>
    </div>
    </>
  )
}



function CardSelect({ card }: { card: Card }) {
  const { itarget: [part,,], setOpen } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    dispatch(_action_card_(part, card.name))
    setOpen(false)
  }, [part, card.name])
  return (
    <div className="ModalItemSelect" onClick={onClick}>
      <ItemIcon2 attrs={card}/>
      <ItemName item={card} className="ItemNameResponsive" />
    </div>
  )
}

export function CardModalFragment() {
  const { itarget: [part,,] } = useContext(ModalContext)
  const items = getCardsForPart(part as EquipPart)
  return (
    <div className="ItemSelectScrollable">
      <div className="ItemSelectArray">
      {(items as Card[]).map((card) => (
        <CardSelect key={card.name} card={card} />
      ))}
      </div>
    </div>
  )
}
