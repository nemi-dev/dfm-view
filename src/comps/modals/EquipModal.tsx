import styled from "styled-components"
import Fuse from "fuse.js"
import { useCallback, useContext, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../feats/hooks"
import { getCardsForPart, getItem, getItemsByPart, isAccessPart, isArmorPart } from "../../items"
import { ItemName } from "../widgets/ItemNameView"
import { ItemIcon } from "../widgets/Icons"
import { ModalContext } from "../../modalContext"

import _left from "../../../data/sets/left.json"
import _right from "../../../data/sets/right.json"
import { Checkie } from "../widgets/Forms"
import { FetchItems, SetCard, SetCardsAllPossible, SetItem } from "../../feats/slices/itemSlice"
import { selectMyDFClass } from "../../feats/selectors"

type EquipShotgun = Partial<Pick<ItemsState, EquipPart>>

const left = _left as Record<string, EquipShotgun>
const right = _right as Record<string, EquipShotgun>

const CheckieInline = styled(Checkie)`
  display: inline-flex;
`

function EquipSelect({ item }: { item: DFItem }) {
  const { message, setOpen } = useContext(ModalContext)
  const { part } = message as ModalRequestForItem
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    dispatch(SetItem([part as EquipPart | "칭호" | "오라" | "무기아바타", item.name]))
    setOpen(false)
  }, [part, item.name])
  return (
    <div className="ModalItemSelect" onClick={onClick}>
      <ItemIcon item={item}/>
      <ItemName item={item} className="ItemNameResponsive" />
    </div>
  )
}

interface IsetCatalog {
  name: string
  itemChildren: DFItem[]
  useThisForPayload: EquipShotgun
}

function EquipShotgun({ name, itemChildren, useThisForPayload }: IsetCatalog) {
  const dispatch = useAppDispatch()
  const { setOpen } = useContext(ModalContext)
  return (
    <div className="EquipShotgun" onClick={() => {dispatch(FetchItems(useThisForPayload)); setOpen(false) }}>
      <div className="IsetName">{name}</div>
      <div className="IsetIconArray">
      {itemChildren.map((item) => (
        <ItemIcon key={item.name} item={item} />
        ))}
      </div>
    </div>
  )
}


function inflate(m: Record<string, string>) {
  return Object.keys(m).map(part => getItem(m[part]))
}

function loadShotgun(part: WholePart) {
  let v: Record<string, EquipShotgun>
  if (isArmorPart(part)) v = left
  else if (isAccessPart(part)) v = right
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


function myItemSroter(myWeapons: WeaponType[], a: DFItem, b: DFItem) {
  return myWeapons.indexOf(a.itype as WeaponType) - myWeapons.indexOf(b.itype as WeaponType)
}

function pickItems(items: DFItem[], part: WholePart, myWeapons: WeaponType[]) {
  if (part !== "무기") return items
  if (!myWeapons) return items
  return items
  .filter(item => myWeapons.includes(item.itype as WeaponType))
  .sort(myItemSroter.bind(null, myWeapons))
}

export function EquipModalFragment() {
  const { message } = useContext(ModalContext)
  const { part } = message as ModalRequestForItem
  const isets = loadShotgun(part) ?? []
  const [query, setQuery] = useState("")
  const [showMyWeaponsOnly, setShowMyWeaponsOnly] = useState(true)
  const myDFclass = useAppSelector(selectMyDFClass)
  const myWeapons = myDFclass.weapons
  
  const dependencies = [part, showMyWeaponsOnly, myDFclass.name]

  const items = useMemo(() => pickItems(getItemsByPart(part), part, showMyWeaponsOnly? myWeapons : null), dependencies)

  const fuse = useMemo(() => new Fuse(items, { keys:["name"], threshold: 0.3 }), dependencies)
  const fusei = useMemo(() => new Fuse(isets, { keys:["name"], threshold: 0.3 }), dependencies)

  const result = useMemo(() => query? fuse.search(query).map(s => s.item) : items, [...dependencies, query])
  const iresult = useMemo(() => query? fusei.search(query).map(s => s.item) : isets, [...dependencies, query])
  return (
    <>
    <SearchField type="text" placeholder="아이템 이름으로 검색해보세요!!" value={query} onChange={ev => setQuery(ev.target.value)} />
    {part === "무기"? <CheckieInline label="착용가능 무기만 표시하기" checked={showMyWeaponsOnly} onChange={setShowMyWeaponsOnly} /> : null}
    <div className="ModalMenuScrollable">
      {iresult.length > 0?
        <>
          <h4>세트 한번에 끼기</h4>
          <div className="ItemShotgunArray">
            {iresult.map(({name, itemChildren, useThisForPayload}) => {
              return <EquipShotgun key={name} name={name} itemChildren={itemChildren} useThisForPayload={useThisForPayload} />
            })}
          </div>
      </> : null}
      {result.length > 0?
      <>
      <h4>단일 장비</h4>
      <div className="ItemSelectArray">
      {result.map((item) => (
        <EquipSelect key={item.name} item={item} />
      ))}
      </div></> : null
      }
    </div>
    </>
  )
}



function CardSelect({ card, all }: { card: DFItem, all: boolean }) {
  const { message, setOpen } = useContext(ModalContext)
  const { part } = message as ModalRequestForItem
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    if (all) dispatch(SetCardsAllPossible(card.name))
    else dispatch(SetCard([part as CardablePart, card.name]))
    setOpen(false)
  }, [part, card.name, all])
  return (
    <div className="ModalItemSelect" onClick={onClick}>
      <ItemIcon item={card}/>
      <ItemName item={card} className="ItemNameResponsive" />
    </div>
  )
}


export function CardModalFragment() {
  const { message } = useContext(ModalContext)
  const { part } = message as ModalRequestForItem
  const items = getCardsForPart(part as EquipPart)
  const [all ,setAll] = useState(false)
  return (
    <div className="ModalMenuScrollable">
      <header>
        <CheckieInline label="선택한 카드를 가능한 모든 부위에 바르기" checked={all} onChange={setAll} />
      </header>
      <div className="ItemSelectArray">
      {items.map((card) => (
        <CardSelect key={card.name} card={card} all={all} />
      ))}
      </div>
    </div>
  )
}
