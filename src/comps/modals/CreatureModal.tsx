import { MouseEvent, useCallback, useMemo, useState } from "react"
import styled from "styled-components"
import { TabContext } from "../../feats/contexts"
import { useAppDispatch, useAppSelector } from "../../feats/hooks"
import { selectMainItem, selectArtifact } from "../../feats/selector/itemSelectors"
import { SetItem, SetMyArtifactValue } from "../../feats/slices/slicev5"
import { getItemsByPart } from "../../items"
import { ArtiUpgrade, Upgrade } from "../Itemy"
import { ItemDetail } from "../widgets/ItemView"
import { NavLink, Tab } from "../widgets/Tab"
import { ItemSizeDefiner } from "./CommonModalComps"
import { CurrentPart } from "./CurrentPart"
import { ModalItemSelect } from "./Select"

const SelectType = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`

const creatures = getItemsByPart("크리쳐")
const artifacts = getItemsByPart("아티팩트")
const [reds, greens, blues] = ["Red", "Green", "Blue"].map(c => artifacts.filter(a => a.ArtiColor === c))

type CreatureModalTabls =  "효과" | "아이템" | "성장"

export function CreatureModal({ initTab = "아이템" }: { initTab?: CreatureModalTabls }) {
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState<CreatureModalTabls>(initTab)
  const creature = useAppSelector(state => selectMainItem(state, undefined, "크리쳐"))
  const red = useAppSelector(state => selectArtifact("Red")(state, undefined))
  const green = useAppSelector(state => selectArtifact("Green")(state, undefined))
  const blue = useAppSelector(state => selectArtifact("Blue")(state, undefined))
  const setCreature = useCallback((i: ItemIdentifier) => {
    dispatch(SetItem([undefined, "크리쳐", i]))
  }, [])
  const setArtifact = useCallback((c: ArtifactColor, i: ItemIdentifier) => {
    dispatch(SetItem([undefined, "아티팩트", c, i]))
  }, [])
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <CurrentPart sel="크리쳐" />
      <ItemSizeDefiner>
        <SelectType>
          <NavLink name="효과">효과 보기</NavLink>
          <NavLink name="아이템">아이템 선택</NavLink>
          <NavLink name="성장">성장/옵션</NavLink>
        </SelectType>
        <div className="ModalMenuScrollable">
          <Tab name="효과">
            <h4>크리쳐</h4>
            <ItemDetail item={creature} />
            <h4>레드 아티팩트</h4>
            <ItemDetail item={red} />
            <h4>블루 아티팩트</h4>
            <ItemDetail item={blue} />
            <h4>그린 아티팩트</h4>
            <ItemDetail item={green} />
          </Tab>
          <Tab name="아이템">
            <div>
              <h4>크리쳐</h4>
              <div className="ItemSelectArray">
                {creatures.map(cr => <ModalItemSelect key={cr.id} item={cr} onClick={() => setCreature(cr.name)}  />)}
              </div>
              <h4>아티팩트</h4>
              <div className="ItemSelectArray">
                {reds.map(cr => <ModalItemSelect key={cr.id} item={cr} onClick={() => setArtifact("Red", cr.name)}  />)}
              </div>
              <div className="ItemSelectArray">
                {blues.map(cr => <ModalItemSelect key={cr.id} item={cr} onClick={() => setArtifact("Blue", cr.name)}  />)}
              </div>
              <div className="ItemSelectArray">
                {greens.map(cr => <ModalItemSelect key={cr.id} item={cr} onClick={() => setArtifact("Green", cr.name)}  />)}
              </div>
            </div>
          </Tab>
          <Tab name="성장">
            <div>
              <div>크리쳐 성장 보너스<Upgrade part="크리쳐" /></div>
              <div>레드 아티팩트의 힘/지능 증가 옵션<ArtiUpgrade color="Red" /></div>
              <div>블루 아티팩트의 공격력 증가 옵션<ArtiUpgrade color="Blue" /></div>
              <div>그린 아티팩트의 내 속성 강화 옵션<ArtiUpgrade color="Green" /></div>
            </div>
          </Tab>
        </div>
      </ItemSizeDefiner>
    </TabContext.Provider>
  )
}
