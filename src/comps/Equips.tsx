import '../style/Equips.scss'

import { useContext, useState } from 'react'
import styled from 'styled-components'

import { useAppSelector } from '../feats/hooks'
import { selectMainItem, selectArtifact } from '../feats/selector/itemSelectors'
import { equipParts, getItem } from '../items'
import { ClosedCondyceSet } from './Choices'
import { EquipBatch } from './EquipBatch'
import { ArmorMaterialSelect, CardSlot, EmblemArray, Upgrade } from './Itemy'
import { MagicProps } from './MagicProps'
import { ItemSelect } from './modals/ItemSelect'
import { ModalContext } from '../feats/contexts'
import { SimpleBaseAttrView } from './widgets/AttrsView'
import { ItemIcon } from './widgets/Icons'
import { ItemName } from './widgets/ItemNameView'
import { MyStat } from './MyStat'
import { CreatureModal } from './modals/CreatureModal'
import { selectDFChar } from '../feats/selector/baseSelectors'
import { CracksModal } from './modals/CrackModal'
import { DFCharView } from './DFCharView'

interface PartProps {
  part: EquipPart | "칭호" | "오라" | "무기아바타" | "크리쳐"
}


const MagicPropsLayout = styled.div`

  grid-area: mgp;
  align-self: stretch;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;

  > * {
    flex: 1;
  }

  @media screen and (max-width: 999px) {
    flex-direction: row;
  }
`

function SlotHeading({ part, onItemNameClicked }: PartProps & { onItemNameClicked: React.MouseEventHandler<HTMLDivElement> }) {
  const item = useAppSelector(state => selectMainItem(state, undefined, part))
  return (
    <div className="SlotHeading">
      <ItemName item={item} alt={`${part} 없음`} className="EquipName" onClick={onItemNameClicked} />
      <ArmorMaterialSelect part={part} />
    </div>
  )
}

interface PartWideProps {
  part: EquipPart | "칭호" | "오라" | "무기아바타" | "크리쳐"
  addValue?: number
  setAddValue?: (v: number) => unknown
}

function Part({ part }: PartWideProps) {
  const { openModal } = useContext(ModalContext)
  const item = useAppSelector(state => selectMainItem(state, undefined, part))
  const [detail, setDetail] = useState(false)
  return (
    <div className="EquipSlot Bordered Hovering" style={{ "--equip_area": part }}>
      <div className="EquipPartLayout">
        <ItemIcon item={item}
          onClick={() => openModal(<ItemSelect sel={part} />)}
        />
        <SlotHeading part={part} onItemNameClicked={() => setDetail(!detail)} />
        {item? 
          <div className="PartAddons">
            <CardSlot part={part} />
            <EmblemArray part={part} />
            <Upgrade part={part} />
          </div> : null}
        <MagicPropsLayout>
          <MagicProps item={item} part={part} />
        </MagicPropsLayout>
      </div>
      {
        (detail && item)?
        <SimpleBaseAttrView attrs={item?.attrs} /> : null
      }
    </div>
  )
}


function CreaturePart() {
  const { openModal } = useContext(ModalContext)
  const creature = useAppSelector(state => selectMainItem(state, undefined, "크리쳐"))
  const red = useAppSelector(state => selectArtifact("Red")(state, undefined))
  const green = useAppSelector(state => selectArtifact("Green")(state, undefined))
  const blue = useAppSelector(state => selectArtifact("Blue")(state, undefined))
  return (
    <div className="EquipSlot Bordered Hovering" style={{ "--equip_area": "크리쳐" }}>
      <div className="EquipPartLayout">
        <ItemIcon item={creature} onClick={() => openModal(<CreatureModal />)} />
        <div className="SlotHeading">
          <ItemName item={creature} alt={`크리쳐 없음`} className="EquipName" />
        </div>
          <div className="PartAddons">
            <ItemIcon className="Artifact" item={red} onClick={() => openModal(<CreatureModal />)} />
            <ItemIcon className="Artifact" item={green} onClick={() => openModal(<CreatureModal />)} />
            <ItemIcon className="Artifact" item={blue} onClick={() => openModal(<CreatureModal />)} />
          </div>
      </div>
    </div>
  )
}

function CracksPart() {
  const { openModal } = useContext(ModalContext)
  const item = useAppSelector(state => selectMainItem(state, undefined, "봉인석"))
  const spells = useAppSelector(state => selectDFChar(state, undefined).items.정수.map(getItem) )
  return (
    <div className="EquipSlot Bordered Hovering" style={{ "--equip_area": "봉인석" }}>
      <div className="EquipPartLayout Cracks">
        <ItemIcon item={item} onClick={() => openModal(<CracksModal />)} />
        <div className="SlotHeading">
          <ItemName item={item} alt={`크리쳐 없음`} className="EquipName" />
        </div>
          <div className="PartAddons CrackSpells">
            {spells.map((s, i) => <ItemIcon className="Artifact" item={s} key={i} onClick={() => openModal(<CracksModal />)} />)}
          </div>
          <MagicPropsLayout>
            <MagicProps item={item} part="봉인석" />
          </MagicPropsLayout>
      </div>
    </div>
  )
}


export function CondsAttrsView() {
  const items = ([...equipParts, "칭호", "오라", "무기아바타", "크리쳐"] as const).map(part => useAppSelector(state => selectMainItem(state, undefined, part)))
  items.push(
    useAppSelector(selectArtifact("Red")),
    useAppSelector(selectArtifact("Green")),
    useAppSelector(selectArtifact("Blue")),
  )
  return <ClosedCondyceSet items={items} />
}

const partNames = [
  "머리어깨", "무기",
  "상의",   "팔찌",
  "하의",   "목걸이",
  "벨트",   "반지",
  "신발",   "보조장비", "칭호", "오라", "무기아바타"
] as const


export function Equips() {
  const dfchar = useAppSelector(selectDFChar)
  return (
    <div className="Equips">
      <div>
        <div className="EquipsArrayLayout">
          {partNames.map(part => <Part key={part} part={part} />)}
          <CreaturePart />
          <CracksPart />
        </div>
        <EquipBatch />
      </div>
      <MyStat />
      <CondsAttrsView />
      <DFCharView dfchar={dfchar} />
      {/* {!portrait? <EquipBatch /> : null} */}
    </div>
  )
}

