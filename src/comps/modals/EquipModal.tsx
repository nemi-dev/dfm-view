import styled from "styled-components"
import Fuse from "fuse.js"
import { useCallback, useContext, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../feats/hooks"
import { getItem, getItemsByPart, isAccess, isArmor } from "../../items"
import { ItemIcon } from "../widgets/Icons"
import { ModalContext } from "../../modalContext"

import _left from "../../../data/sets/left.json"
import _right from "../../../data/sets/right.json"
import { LabeledSwitch } from "../widgets/Forms"
import { FetchItems, SetItem } from "../../feats/slices/itemSlice"
import { selectMyDFClass } from "../../feats/selector/selfSelectors"
import { ModalItemSelect } from "./Select"
import { CurrentPart } from "./CurrentPart"

type EquipShotgun = Partial<Pick<ItemsState, EquipPart>>

const left = _left as Record<string, EquipShotgun>
const right = _right as Record<string, EquipShotgun>

const CheckieInline = styled(LabeledSwitch)`
  display: inline-flex;
`

interface IsetCatalog {
  name: string
  itemChildren: DFItem[]
  useThisForPayload: EquipShotgun
}

function EquipShotgun({ name, itemChildren, useThisForPayload }: IsetCatalog) {
  const dispatch = useAppDispatch()
  const { closeModal } = useContext(ModalContext)
  return (
    <div className="EquipShotgun" onClick={() => { dispatch(FetchItems(useThisForPayload)); closeModal() }}>
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
  if (isArmor(part)) v = left
  else if (isAccess(part)) v = right
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

function pickItems(items: DFItem[], part: WholePart, myWeapons: WeaponType[] | null) {
  if (part !== "무기" || !myWeapons) return items
  return items
  .filter(item => myWeapons.includes(item.itype as WeaponType))
  .sort(myItemSroter.bind(null, myWeapons))
}

export function EquipModalFragment({ part }: { part: WholePart }) {
  const { closeModal } = useContext(ModalContext)
  const isets = loadShotgun(part) ?? []
  const [query, setQuery] = useState("")
  const [showMyWeaponsOnly, setShowMyWeaponsOnly] = useState(true)
  const myDFclass = useAppSelector(selectMyDFClass)
  const myWeapons = myDFclass?.weapons ?? []

  const dispatch = useAppDispatch()
  const onClick = useCallback((item: DFItem) => {
    dispatch(SetItem([part as EquipPart | "칭호" | "오라" | "무기아바타", item.name]))
    closeModal()
  }, [part])
  
  const dependencies = [part, showMyWeaponsOnly, myDFclass?.name]

  const items = useMemo(() => pickItems(getItemsByPart(part), part, showMyWeaponsOnly? myWeapons : null), dependencies)

  const fuse = useMemo(() => new Fuse(items, { keys:["name"], threshold: 0.3 }), dependencies)
  const fusei = useMemo(() => new Fuse(isets, { keys:["name"], threshold: 0.3 }), dependencies)

  const result = useMemo(() => query? fuse.search(query).map(s => s.item) : items, [...dependencies, query])
  const iresult = useMemo(() => query? fusei.search(query).map(s => s.item) : isets, [...dependencies, query])
  return (
    <>
    <CurrentPart part={part} />
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
        <ModalItemSelect key={item.name} item={item} onClick={() => onClick(item)} />
      ))}
      </div></> : null
      }
    </div>
    </>
  )
}




