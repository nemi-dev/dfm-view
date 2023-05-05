import styled from "styled-components"
import Fuse from "fuse.js"
import { MouseEventHandler, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../feats/hooks"
import { getItem, getItemsByPart, isAccess, isArmor } from "../../items"
import { ItemIcon } from "../widgets/Icons"
import { ModalContext } from "./modalContext"

import _left from "../../../data/sets/left.json"
import _right from "../../../data/sets/right.json"
import { LabeledSwitch } from "../widgets/Forms"
import { FetchItems, SetItem } from "../../feats/slices/itemSlice"
import { selectMyDFClass } from "../../feats/selector/selfSelectors"
import { ModalItemSelect } from "./Select"
import { CurrentPart } from "./CurrentPart"
import { TabContext } from "../../responsiveContext"
import { NavLink, Tab } from "../widgets/Tab"
import { ItemDetail } from "../widgets/ItemView"
import { mainItemSelector } from "./CurrentPart"

type EquipShotgunType = Partial<Pick<ItemsState, EquipPart>>

const fuseOption = { keys:["name"], threshold: 0.3 }

const left = _left as Record<string, EquipShotgunType>
const right = _right as Record<string, EquipShotgunType>

const CheckieInline = styled(LabeledSwitch)`
  display: inline-flex;
`

interface IsetCatalog {
  name: string
  itemChildren: DFItem[]
  useThisForPayload: EquipShotgunType
}


function EquipShotgun2({ item, onClick }: { item: IsetCatalog, onClick: MouseEventHandler<HTMLDivElement>}) {
  const { name, itemChildren, useThisForPayload } = item
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

function myItemSorter(myWeapons: WeaponType[], a: DFItem, b: DFItem) {
  return myWeapons.indexOf(a.itype as WeaponType) - myWeapons.indexOf(b.itype as WeaponType)
}

function pickItems(items: DFItem[], part: WholePart, myWeapons: WeaponType[] | null | undefined) {
  if (part !== "무기" || !myWeapons) return items
  return items
  .filter(item => myWeapons.includes(item.itype as WeaponType))
  .sort(myItemSorter.bind(null, myWeapons))
}

function inflate(m: Record<string, string>) {
  return Object.keys(m).map(part => getItem(m[part]))
}

function loadShotgun(part: WholePart) {
  let v: Record<string, EquipShotgunType>
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

interface SearchListProps<IT extends DFItem | IsetCatalog> {
  query: string
  collection: IT[]
  onItemClick: (item: IT) => unknown
  ChildComponent: React.FC<{ item: IT, onClick: MouseEventHandler<HTMLDivElement> }>
}

function SearchList<IT extends DFItem | IsetCatalog>({ collection, query, onItemClick, ChildComponent }: SearchListProps<IT>) {
  const fuse: Fuse<IT> = useMemo(() => new Fuse([], fuseOption), [])
  const [result, setResult] = useState<IT[]>([])
  useEffect(() => {
    fuse.setCollection(collection)
  }, [collection])
  useEffect(() => {
    setResult(query? fuse.search(query).map(s => s.item) : collection)
  }, [collection, query])
  return <>
    {result.map(item => 
      <ChildComponent key={item.name} item={item} onClick={() => onItemClick(item)} />
    )}
  </>
  
}


const SearchField = styled.input`
input[type=text]& {
  width: 100%;
  text-align: center;
}
  
`

const SelectType = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`



export function EquipModalFragment({ part }: { part: WholePart }) {
  const { closeModal } = useContext(ModalContext)
  const isets = loadShotgun(part) ?? []
  const [query, setQuery] = useState("")
  const mainitem = useAppSelector(mainItemSelector(part))
  const [showMyWeaponsOnly, setShowMyWeaponsOnly] = useState(true)
  const myDFclass = useAppSelector(selectMyDFClass)

  const [activeTab, setActiveTab] = useState("단일")

  const myWeapons = myDFclass?.weapons ?? []

  const dispatch = useAppDispatch()
  const onClick = useCallback((item: DFItem) => {
    dispatch(SetItem([part as EquipPart | "칭호" | "오라" | "무기아바타", item.name]))
    closeModal()
  }, [part])
  
  const dependencies = [part, showMyWeaponsOnly, myDFclass.name]

  const items = useMemo(() => pickItems(getItemsByPart(part), part, showMyWeaponsOnly? myWeapons : null), dependencies)

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <CurrentPart part={part} />
      <SearchField type="text" placeholder="아이템 이름으로 검색해보세요!!" value={query} onChange={ev => setQuery(ev.target.value)} />
      {part === "무기"? <CheckieInline label="착용가능 무기만 표시하기" checked={showMyWeaponsOnly} onChange={setShowMyWeaponsOnly} /> : null}
      <SelectType>
        <NavLink name="효과">효과 보기</NavLink>
        <NavLink name="단일">단일</NavLink>
        <NavLink name="세트">세트</NavLink>
      </SelectType>
      <div className="ModalMenuScrollable">
        <Tab name="효과">
          <ItemDetail item={mainitem} />
        </Tab>
        <Tab name="단일">
          <div className="ItemSelectArray">
            <SearchList collection={items} query={query} onItemClick={onClick} ChildComponent={ModalItemSelect} />
          </div>
        </Tab>
        <Tab name="세트">
          <div className="ItemShotgunArray">
            <SearchList collection={isets} query={query} onItemClick={() => {}} ChildComponent={EquipShotgun2} />
          </div>
        </Tab>
      </div>
    </TabContext.Provider>
  )
}




