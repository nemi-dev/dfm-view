import Fuse from 'fuse.js'
import produce from 'immer'
import {
    Fragment, MouseEventHandler, useCallback, useContext, useEffect, useMemo, useState
} from 'react'
import styled from 'styled-components'

import { createSelector } from '@reduxjs/toolkit'

import _left from '../../../data/sets/left.json'
import _right from '../../../data/sets/right.json'
import { useAppDispatch, useAppSelector } from '../../feats/hooks'
import { selectDFChar, selectDFClass } from '../../feats/selector/baseSelectors'
import { SetItems, SetItem } from '../../feats/slices/slicev5'
import {
    equipParts, getCircus2Items, getItem, getItemsByPart, isAccess, isArmor, isEquip, party
} from '../../items'
import { TabContext } from '../../feats/contexts'
import { ItemIcon } from '../widgets/Icons'
import { ItemDetail } from '../widgets/ItemView'
import { NavLink, Tab } from '../widgets/Tab'
import { ItemSizeDefiner } from './CommonModalComps'
import { CurrentPart } from './CurrentPart'
import { ModalContext } from '../../feats/contexts'
import { ModalItemSelect } from './Select'
import { selectMainItem } from '../../feats/selector/itemSelectors'

type EquipShotgun = Partial<Pick<ItemsState, EquipPart>>

const fuseOption = { keys:["name"], threshold: 0.3 }

const left = _left as Record<string, EquipShotgun>
const right = _right as Record<string, EquipShotgun>

const SearchField = styled.input`
input[type=text]& {
  width: calc(100% - 40px);
  height: 1.2rem;
  margin-block: 0.5rem;
  text-align: center;

  position: sticky;
  top: 0.5rem;
  z-index: 1;
  background-color: #000000;
}
`


interface IsetCatalog {
  name: string
  items: DFItem[]
  useThisForPayload: EquipShotgun
}

function myItemSorter(myWeapons: WeaponType[], a: DFItem, b: DFItem) {
  return myWeapons.indexOf(a.itype as WeaponType) - myWeapons.indexOf(b.itype as WeaponType)
}

function pickItems(items: DFItem[], part: WholePart, myWeapons?: WeaponType[]) {
  if (part == "무기" && myWeapons)
  return items
  .filter(item => myWeapons.includes(item.itype as WeaponType))
  .sort(myItemSorter.bind(null, myWeapons))

  return items.filter(item => !(item.content?.includes("환영극단 2막")))
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
  for (const isetname of Object.keys(v)) {
    w.push({
      name: isetname,
      items: inflate(v[isetname]),
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

  const fuse: Fuse<IT> = useMemo(() => new Fuse<IT>(collection, fuseOption), [])
  const [result, setResult] = useState<IT[]>(query? fuse.search(query).map(s => s.item) : collection)

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

function SingleItemList({ part }: { part: WholePart }) {
  const { closeModal } = useContext(ModalContext)
  const [query, setQuery] = useState("")
  const dispatch = useAppDispatch()
  const myDFclass = useAppSelector(selectDFClass)

  const onClick = useCallback((item: DFItem) => {
    dispatch(SetItem([undefined, part as EquipPart | "칭호" | "오라" | "무기아바타", item.name]))
    closeModal()
  }, [part])

  const myWeapons = myDFclass.weapons ?? []
  const dependencies = [part, myDFclass.name]
  const items = useMemo(() => pickItems(getItemsByPart(part), part, myWeapons), dependencies)
  return (
  <div>
    <SearchField type="text" placeholder="아이템 이름 찾기" value={query} onChange={ev => setQuery(ev.target.value)} />
    <div className="ItemSelectArray">
      <SearchList collection={items} query={query} onItemClick={onClick} ChildComponent={ModalItemSelect} />
    </div>
  </div>
  )
}

const Circus2ListStyle = styled.div`
  button.Apply {
    position: sticky;
    bottom: 0;
  }
`

const Circus2ListInnerLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(11, auto);

  justify-content: space-evenly;

  .ItemIcon {
    opacity: 0.75;
    filter: grayscale(50%);

    &.Active {
      opacity: 1;
      filter: unset;
    }
  }

  h4, h5 {
    cursor: default;    
  }

  @media screen and (max-width: 999px) {
    grid-template-rows: repeat(11, auto);
    grid-auto-columns: auto;
    grid-template-columns: unset;
    grid-auto-flow: column;

  }
`

const selectEquipMainItems = createSelector(
  selectDFChar,
  (dfchar) =>  equipParts.map(part => getItem(dfchar.items[part]))
)

function Circus2List() {
  const { closeModal } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const myDFClass = useAppSelector(selectDFClass)
  const collection = getCircus2Items(myDFClass.name)
  const currentItems = useAppSelector(selectEquipMainItems)

  const [shotgun, setShotgun] = useState<EquipShotgun>(currentItems.reduce((sh, item) => 
    (sh[party(item.itype)] = item.name, sh)
  , {}))

  const loadOne = useCallback((item: DFItem) => {
    const part: EquipPart = party(item.itype) as EquipPart
    setShotgun(produce(shotgun, sh => { sh[part] = item.name }))
  }, [shotgun])

  const loadAll = useCallback((items: DFItem[]) => {
    const s: EquipShotgun = items.reduce((sh, item) => (sh[party(item.itype)] = item.name, sh), {} as EquipShotgun)
    setShotgun(produce(shotgun, sh => { Object.assign(sh, s) }))
  }, [shotgun])

  const apply = useCallback(() => {
    dispatch(SetItems({ items: shotgun }))
    closeModal()
  }, [shotgun])

  return (
    <Circus2ListStyle>
      <div style={{ marginBlock: "1rem" }}>
        착용할 아이템을 선택한 후, 아래의 "착용하기" 버튼을 눌러주세요.<br />
        세트 이름을 누르면 모든 세트 아이템을 장착합니다.<br />
      </div>
      <Circus2ListInnerLayout>
        <h5 onClick={() => loadAll(currentItems)}>(착용중)</h5>
        {currentItems.map((item, index) =>
          <ItemIcon key={item.name} item={item} className={shotgun[party(item.itype)] == item.name ? "Active" : ""} onClick={() => loadOne(item)} />
        )}
        {Object.keys(collection).map(isetName => {
          const thisItems = collection[isetName]
          return <Fragment key={isetName}>
            <h4 onClick={() => loadAll(thisItems)}>{isetName.split(/\s+/)[1]}</h4>
            {thisItems.map(item => <ItemIcon key={item.name} item={item} className={shotgun[party(item.itype)] == item.name ? "Active" : ""} onClick={() => loadOne(item)} />)}
          </Fragment>
        }
        )}
      </Circus2ListInnerLayout>
      <button className="Apply" onClick={apply}>착용하기</button>
    </Circus2ListStyle>
    
  )
}


const EquipShotgunStyle = styled.div`
  padding: 4px;

  .IsetName {
    margin-block: 0.1rem;
    font-weight: 700;
  }

  .IsetIconArray {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
`

function EquipShotgunTab({ item, onClick }: { item: IsetCatalog, onClick: MouseEventHandler<HTMLDivElement>}) {
  const { closeModal } = useContext(ModalContext)
  const { name, items, useThisForPayload } = item
  const dispatch = useAppDispatch()
  return (
    <EquipShotgunStyle className="EquipShotgun" 
      onClick={() => { dispatch(SetItems({ items: useThisForPayload })); closeModal() }}>
      <div className="IsetName">{name}</div>
      <div className="IsetIconArray">
      {items.map((item) => (
        <ItemIcon key={item.name} item={item} />
        ))}
      </div>
    </EquipShotgunStyle>
  )
}

function Epic60SetList({ part }: { part: WholePart }) {
  const isets = loadShotgun(part) ?? []
  const [query, setQuery] = useState("")
  return (
    <div>
      <SearchField type="text" placeholder="세트 이름 찾기" value={query} onChange={ev => setQuery(ev.target.value)} />
      <div className="ItemShotgunArray">
        <SearchList collection={isets} query={query} onItemClick={() => {}} ChildComponent={EquipShotgunTab} />
      </div>
    </div>
  )
}



const SelectType = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`


interface ItemSelectProps {
  sel: MainItemSelector
}

export function ItemSelect({ sel }: ItemSelectProps) {
  const part = typeof sel === "string" ? sel : sel.part
  const mainitem = useAppSelector(state => selectMainItem(state, undefined, sel))
  const [activeTab, setActiveTab] = useState("일반")

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <CurrentPart sel={sel} />
      <ItemSizeDefiner>
        <SelectType>
          <NavLink name="효과">효과 보기</NavLink>
          <NavLink name="일반">일반</NavLink>
          <NavLink name="세트">세트</NavLink>
          {isEquip(part) && <NavLink name="환영극단 2막">환영극단 2막</NavLink>}
        </SelectType>
        <div className="ModalMenuScrollable">
          <Tab name="효과">
            <ItemDetail item={mainitem} />
          </Tab>
          <Tab name="일반">
            <SingleItemList part={part} />
          </Tab>
          <Tab name="환영극단 2막">
            <Circus2List />
          </Tab>
          <Tab name="세트">
            <Epic60SetList part={part} />
          </Tab>
        </div>
      </ItemSizeDefiner>
    </TabContext.Provider>
  )
}




