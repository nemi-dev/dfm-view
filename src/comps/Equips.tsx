import '../style/Equips.scss'

import { Fragment, useContext, useState } from 'react'
import styled from 'styled-components'

import { useAppSelector } from '../feats/hooks'
import { selectMainItem, selectArtifact } from '../feats/selector/itemSelectors'
import { equipParts, getItem } from '../items'
import { PortraitMode } from '../feats/contexts'
import { ClosedCondyceSet } from './Choices'
import { EquipBatch } from './EquipBatch'
import { ArmorMaterialSelect, ArtiUpgrade, CardSlot, EmblemArray, Upgrade } from './Itemy'
import { MagicProps } from './MagicProps'
import { ItemSelect } from './modals/ItemSelect'
import { ModalContext } from '../feats/contexts'
import { SimpleBaseAttrView } from './widgets/AttrsView'
import { ItemIcon } from './widgets/Icons'
import { ItemName } from './widgets/ItemNameView'
import { EditEltype } from './MyStat'
import { CreatureModal } from './modals/CreatureModal'
import { selectDFChar } from '../feats/selector/baseSelectors'
import { CracksModal } from './modals/CrackModal'

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

function PartWide({ part }: PartWideProps) {
  const { openModal } = useContext(ModalContext)
  const item = useAppSelector(state => selectMainItem(state, undefined, part))
  const [detail, setDetail] = useState(false)
  return (
    <div className="EquipSlot Bordered Hovering">
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

function PartCompact({ part }: PartProps) {
  const { openModal } = useContext(ModalContext)
  const item = useAppSelector(state => selectMainItem(state, undefined, part))
  return (
    <div className="EquipSlot">
      <div className="EquipPartLayout">
        <ItemIcon item={item} onClick={() => openModal(<ItemSelect sel={part} />)}
        />
      </div>
    </div>
  )
}


function CreaturePartWide() {
  const { openModal } = useContext(ModalContext)
  const creature = useAppSelector(state => selectMainItem(state, undefined, "크리쳐"))
  const red = useAppSelector(state => selectArtifact("Red")(state, undefined))
  const green = useAppSelector(state => selectArtifact("Green")(state, undefined))
  const blue = useAppSelector(state => selectArtifact("Blue")(state, undefined))
  return (
    <div className="EquipSlot Bordered Hovering">
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


function CreaturePartCompact() {
  const { openModal } = useContext(ModalContext)
  const item = useAppSelector(state => selectMainItem(state, undefined, "크리쳐"))
  return (
    <div className="EquipSlot">
      <div className="EquipPartLayout">
        <ItemIcon item={item} onClick={() => openModal(<CreatureModal />)}
        />
      </div>
    </div>
  )
}

function CracksPartWide() {
  const { openModal } = useContext(ModalContext)
  const item = useAppSelector(state => selectMainItem(state, undefined, "봉인석"))
  const spells = useAppSelector(state => selectDFChar(state, undefined).items.정수.map(getItem) )
  return (
    <div className="EquipSlot Bordered Hovering">
      <div className="EquipPartLayout">
        <ItemIcon item={item} onClick={() => openModal(<CracksModal />)} />
        <div className="SlotHeading">
          <ItemName item={item} alt={`크리쳐 없음`} className="EquipName" />
        </div>
          <div className="PartAddons">
            {spells.map((s, i) => <ItemIcon className="Artifact" item={s} key={i} onClick={() => openModal(<CracksModal />)} />)}
          </div>
          <MagicPropsLayout>
            <MagicProps item={item} part="봉인석" />
          </MagicPropsLayout>
      </div>
    </div>
  )
}

function CracksPartCompact() {
  const { openModal } = useContext(ModalContext)
  const item = useAppSelector(state => selectMainItem(state, undefined, "봉인석"))
  return (
    <div className="EquipSlot">
      <div className="EquipPartLayout">
        <ItemIcon item={item} onClick={() => openModal(<CracksModal />)}
        />
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

const wideOrder = [
  "머리어깨", "무기",
  "상의",   "팔찌",
  "하의",   "목걸이",
  "벨트",   "반지",
  "신발",   "보조장비",
] as const

const compactOrder = [
  "무기", "팔찌", "목걸이", "반지", "보조장비",
  "머리어깨", "상의", "하의", "벨트", "신발",
] as const

const EquipsArrayLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(5, auto);
  align-items: start;
  gap: 4px;

  @media screen and (max-width: 999px) {
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(2, auto);
    grid-auto-flow: row;
  }
`

const ExtraEquipsStyle = styled.div`
  grid-column-start: 1;
  grid-column-end: -1;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: start;
  gap: 4px;
`


export function Equips() {
  const portrait = useContext(PortraitMode)
  const Part = portrait? PartCompact : PartWide
  const CreaturePart = portrait? CreaturePartCompact : CreaturePartWide
  const CracksPart = portrait? CracksPartCompact : CracksPartWide
  const order = portrait? compactOrder : wideOrder
  const ExtraEquips = portrait? Fragment : ExtraEquipsStyle
  return (
    <div className="Equips">
      <EquipsArrayLayout className="EquipsArrayLayout">
        {order.map(part => <Part key={part} part={part} />)}
        <CreaturePart />
        <CracksPart />
        <ExtraEquips>
          <Part part="칭호" />
          <Part part="오라" />
          <Part part="무기아바타" />
        </ExtraEquips>
      </EquipsArrayLayout>
      {portrait && <div>
        <div className="CondContainerName">속성부여</div>
        <EditEltype />
      </div>}
      <CondsAttrsView />
      {!portrait? <EquipBatch /> : null}
    </div>
  )
}

