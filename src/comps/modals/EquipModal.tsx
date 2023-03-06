import styled from "styled-components"
import Fuse from "fuse.js"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useAppDispatch } from "../../feats/hooks"
import { _action_card_, _action_equip_ } from "../../feats/modalIntergrating"
import { getCardsForPart, getItem, getItemsByPart, isAccessPart, isArmorPart } from "../../items"
import { ItemName } from "../CommonUI"
import { ItemIcon } from "../widgets/Icons"
import { ModalContext } from "../../modalContext"

import _left from "../../../data/sets/left.json"
import _right from "../../../data/sets/right.json"
import { SetCardsAllPossible, SetEquips } from "../../feats/slices/equipSlice"
import { Checkie } from "../widgets/Forms"

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

const SearchField = styled.input`
input[type=text]& {
  width: 100%;
  text-align: center;
}
  
`

export function EquipModalFragment() {
  const { itarget: [part,,] } = useContext(ModalContext)
  const items = getItemsByPart(part)
  const isets = loadShotgun(part) ?? []
  const [query, setQuery] = useState("")
  const [showItems, setShowItems] = useState(items)
  const [showIsets, setShowIsets] = useState(isets)
  const fuse = useMemo(() => new Fuse(items, { keys:["name"], threshold: 0.3 }), [part])
  const fuse2 = useMemo(() => new Fuse(isets, { keys:["name"], threshold: 0.3 }), [part])
  const searche = useCallback((q: string) => {
    setQuery(q)
    if (!q) {
      setShowItems(items)
      setShowIsets(isets)
      return
    }
    const search = fuse.search(q)
    const isearch = fuse2.search(q)
    setShowItems(search.map(s => s.item))
    setShowIsets(isearch.map(s => s.item))
  }, [part])
  return (
    <>
    <SearchField type="text" placeholder="아이템 이름으로 검색해보세요오옷!!" value={query} onChange={ev => searche(ev.target.value)} />
    <div className="ItemSelectScrollable">
      {showIsets.length > 0?
        <>
          <h4>세트 한번에 끼기</h4>
          <div className="ItemShotgunArray">
            {showIsets.map(({name, itemChildren, useThisForPayload}) => {
              return <EquipShotgun key={name} name={name} itemChildren={itemChildren} useThisForPayload={useThisForPayload} />
            })}
          </div>
      </> : null}
      {showItems.length > 0?
      <>
      <h4>단일 장비</h4>
      <div className="ItemSelectArray">
      {showItems.map((item) => (
        <EquipSelect key={item.name} item={item} />
      ))}
      </div></> : null
      }
    </div>
    </>
  )
}



function CardSelect({ card, all }: { card: Card, all: boolean }) {
  const { itarget: [part,,], setOpen } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    if (all) dispatch(SetCardsAllPossible(card.name))
    else dispatch(_action_card_(part, card.name))
    setOpen(false)
  }, [part, card.name, all])
  return (
    <div className="ModalItemSelect" onClick={onClick}>
      <ItemIcon attrs={card}/>
      <ItemName item={card} className="ItemNameResponsive" />
    </div>
  )
}

const Checkie2 = styled(Checkie)`
  display: inline-flex;
`

export function CardModalFragment() {
  const { itarget: [part,,] } = useContext(ModalContext)
  const items = getCardsForPart(part as EquipPart)
  const [all ,setAll] = useState(false)
  return (
    <div className="ItemSelectScrollable">
      <header>
        <Checkie2 label="선택한 카드를 가능한 모든 부위에 바르기" checked={all} onChange={setAll} />
      </header>
      <div className="ItemSelectArray">
      {(items as Card[]).map((card) => (
        <CardSelect key={card.name} card={card} all={all} />
      ))}
      </div>
    </div>
  )
}
