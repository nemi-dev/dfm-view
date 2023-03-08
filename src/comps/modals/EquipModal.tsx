import styled from "styled-components"
import Fuse from "fuse.js"
import { useCallback, useContext, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../feats/hooks"
import { getCardsForPart, getItem, getItemsByPart, isAccessPart, isArmorPart } from "../../items"
import { ItemName } from "../CommonUI"
import { ItemIcon } from "../widgets/Icons"
import { ModalContext } from "../../modalContext"

import _left from "../../../data/sets/left.json"
import _right from "../../../data/sets/right.json"
import { SetCard, SetCardsAllPossible, SetEquip, SetEquips } from "../../feats/slices/equipSlice"
import { Checkie } from "../widgets/Forms"
import { whois } from "../../dfclass"
import { SetOtherAvatar } from "../../feats/slices/avatarSlice"


const CheckieInline = styled(Checkie)`
  display: inline-flex;
`

function EquipSelect({ item }: { item: Attrs }) {
  const { message, setOpen } = useContext(ModalContext)
  const { part } = message as ModalRequestForItem
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    if ( part === "무기아바타" || part === "오라") dispatch(SetOtherAvatar([part, item.name]))
    else dispatch(SetEquip([part as EquipPart | "칭호", item.name]))
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
  let v: Record<string, Record<string, string>>
  if (isArmorPart(part as EquipPart)) v = _left
  else if (isAccessPart(part as EquipPart)) v = _right
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


function myItemSroter(myWeapons: WeaponType[], a: Attrs, b: Attrs) {
  return myWeapons.indexOf(a.itype as WeaponType) - myWeapons.indexOf(b.itype as WeaponType)
}

function pickItems(items: Attrs[], part: WholePart, myWeapons: WeaponType[]) {
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
  const myDFclass = useAppSelector(state => whois(state.Profile.dfclass))
  const myWeapons = myDFclass.weapons
  
  const dependencies = [part, showMyWeaponsOnly, myDFclass.name]

  const items = useMemo(() => pickItems(getItemsByPart(part), part, showMyWeaponsOnly? myWeapons : null), dependencies)

  const fuse = useMemo(() => new Fuse(items, { keys:["name"], threshold: 0.3 }), dependencies)
  const fusei = useMemo(() => new Fuse(isets, { keys:["name"], threshold: 0.3 }), dependencies)

  const result = useMemo(() => query? fuse.search(query).map(s => s.item) : items, [...dependencies, query])
  const iresult = useMemo(() => query? fusei.search(query).map(s => s.item) : isets, [...dependencies, query])
  return (
    <>
    <SearchField type="text" placeholder="아이템 이름으로 검색해보세요오옷!!" value={query} onChange={ev => setQuery(ev.target.value)} />
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



function CardSelect({ card, all }: { card: Card, all: boolean }) {
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
      {(items as Card[]).map((card) => (
        <CardSelect key={card.name} card={card} all={all} />
      ))}
      </div>
    </div>
  )
}
