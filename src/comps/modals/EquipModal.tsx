import { useCallback, useContext } from "react"
import { useAppDispatch } from "../../feats/hooks"
import { _action_card_, _action_equip_ } from "../../feats/modalIntergrating"
import { getCardsForPart, getItem, getItemsByPart, isAccessPart, isArmorPart } from "../../items"
import { ItemName } from "../CommonUI"
import { ItemIcon } from "../widgets/Icons"
import { ModalContext } from "../../modalContext"

import _left from "../../../data/sets/left.json"
import _right from "../../../data/sets/right.json"
import { SetEquips } from "../../feats/slices/equipSlice"

function EquipSelect({ item }: { item: Attrs }) {
  const { itarget: [part,,], setOpen } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    dispatch(_action_equip_(part, item.name))
    setOpen(false)
  }, [part, item.name])
  return (
    <div className="ModalItemSelect" onClick={onClick}>
      <ItemIcon attrs={item}/>
      <ItemName item={item} className="ItemNameResponsive" />
    </div>
  )
}

interface IsetCatalog {
  name: string
  itemChildren: Attrs[]
  useThisForPayload: Record<string, string>
}

function EquipShotgun({ name, itemChildren, useThisForPayload }: IsetCatalog) {
  const dispatch = useAppDispatch()
  const { setOpen } = useContext(ModalContext)
  return (
    <div className="EquipShotgun" onClick={() => {dispatch(SetEquips(useThisForPayload)); setOpen(false) }}>
      <div className="IsetName">{name}</div>
      <div className="IsetIconArray">
      {itemChildren.map((item) => (
        <ItemIcon key={item.name} attrs={item} />
        ))}
      </div>
    </div>
  )
}


function inflate(m: Record<string, string>) {
  const n: Attrs[] = []
  for (const part in m) {
    n.push(getItem(m[part]))
  }
  return n
}

function loadShotgun(part: WholePart) {
  let v: Record<string, Record<string, string>>
  if (isArmorPart(part as EquipPart)) v = _left
  else if (part === "무기" || part === "보조장비" || isAccessPart(part as EquipPart)) v = _right
  else return

  const w: IsetCatalog[] = []
  for (const isetname of Object.keys(v).sort()) {
    w.push({
      name: isetname,
      itemChildren: inflate(v[isetname]),
      useThisForPayload: v[isetname]
    })
  }

  return w
}

export function EquipModalFragment() {
  const { itarget: [part,,] } = useContext(ModalContext)
  const items = getItemsByPart(part)
  const isets = loadShotgun(part) ?? []
  return (
    <>
    <div className="ItemSelectScrollable">
      {isets.length > 0?
        <>
          <h4>세트 한번에 끼기</h4>
          <div className="ItemShotgunArray">
            {isets.map(({name, itemChildren, useThisForPayload}) => {
              return <EquipShotgun key={name} name={name} itemChildren={itemChildren} useThisForPayload={useThisForPayload} />
            })}
          </div>
      </> : null}
      <h4>단일 장비</h4>
      <div className="ItemSelectArray">
      {items.map((item) => (
        <EquipSelect key={item.name} item={item} />
      ))}
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
      <ItemIcon attrs={card}/>
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
