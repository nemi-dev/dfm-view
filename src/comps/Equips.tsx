import { useContext, useState } from "react"

import "../style/Equips.scss"
import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { SimpleBaseAttrView } from "./AttrsView"
import { getItem, isArmorPart } from "../items"
import { selectItem, selectWholeFromPart } from "../selectors"
import { EmblemArray, ItemName } from "./CommonUI"
import { NumberInput } from "./widgets/Forms"
import { ItemIcon } from "./widgets/Icons"
import { NextMagicProps, SetEquipUpgradeValue, SetMaterial } from "../feats/slices/equipSlice"
import { OptionalAttrsView } from "./ConditionalAttrs"
import { ModalContext } from "../modalContext"
import { MagicPropsArray } from "./MagicProps"
import { PortraitMode } from "../responsiveContext"
import { EquipBatch } from "./EquipBatch"
import { acceptEmblem } from "../emblem"
import styled from "styled-components"

interface EquipProps {
  part: EquipPart
}


interface PartProps {
  part: EquipPart
  interactive?: boolean
  showUpgarde?: boolean
}


function NormalAddonsArray({ part, interactive = false, showUpgarde = false }: PartProps) {
  const { openModal } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const card = useAppSelector(state => getItem(state.Equips[part].card))
  const upgradeBonus = useAppSelector(state => state.Equips[part].upgrade)
  const emblems = useAppSelector(state => state.Equips[part].emblems)
  const emblemAccept = acceptEmblem(part)
  return(
    <div className="EquipAddons">
      <ItemIcon className="Card" attrs={card} onClick={() => interactive && openModal(part, "Card", 0)} />
      <EmblemArray emblems={emblems} accept={emblemAccept}
        onItemClick={index => interactive && openModal(part, "Emblem", index)}
      />
      {showUpgarde?
      <div className="EquipUpgradeValue">
        +<NumberInput value={upgradeBonus} onChange={v => dispatch(SetEquipUpgradeValue([part, v]))} />
      </div>: null}
    </div>
  )
}


function ArmorMaterialSelectElement({ part }: EquipProps) {
  const name = useAppSelector(state => state.Equips[part].name)
  if (!isArmorPart(part) || !name) return null
  const material = useAppSelector(state => state.Equips[part].material)
  const dispatch = useAppDispatch()
  return(
    <select className="ArmorMaterialSelector" value={material} onChange={ev => dispatch(SetMaterial([part, ev.target.value as ArmorMaterial]))}>
      <option value="천">천</option>
      <option value="가죽">가죽</option>
      <option value="경갑">경갑</option>
      <option value="중갑">중갑</option>
      <option value="판금">판금</option>
    </select>
  )
}



function SlotHeading({ part, onItemNameClicked }: EquipProps & { onItemNameClicked: React.MouseEventHandler<HTMLDivElement> }) {
  const portrait = useContext(PortraitMode)
  if (portrait) return null
  const item = useAppSelector(selectItem[part])
  return (
    <div className="SlotHeading">
      <ItemName item={item} alt={`${part} 없음`} className="EquipName" onClick={onItemNameClicked} />
      <ArmorMaterialSelectElement part={part} />
    </div>
  )
}

function PartCompact({ part }: EquipProps) {
  const { openModal } = useContext(ModalContext)
  const item = useAppSelector(selectItem[part])
  const [detail, setDetail] = useState(false)
  return (
    <div className="EquipSlot">
      <div className="EquipPartLayout">
        <ItemIcon attrs={item} onClick={() => openModal(part, "Equip", 0)} />
        <SlotHeading part={part} onItemNameClicked={() => setDetail(!detail)} />
        {item? <NormalAddonsArray part={part}/> : null}
      </div>
    </div>
  )
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

function PartWide({ part }: EquipProps) {
  const { openModal } = useContext(ModalContext)
  const item = useAppSelector(selectItem[part])
  const [detail, setDetail] = useState(false)
  const equipPartAttr = useAppSelector(selectWholeFromPart[part])
  return (
    <div className="EquipSlot Bordered Hovering">
      <div className="EquipPartLayout">
        <ItemIcon attrs={item} onClick={() => openModal(part, "Equip", 0)} />
        <SlotHeading part={part} onItemNameClicked={() => setDetail(!detail)} />
        {item? <NormalAddonsArray part={part} showUpgarde interactive /> : null}
        {item? <MagicPropsLayout>
        <MagicPropsArray level={item.level} part={part} rarity={item.rarity}
          arraySelector={state => state.Equips[part].magicProps}
          actionCreator={(part: EquipPart, index) => NextMagicProps([part, index])}
        />
        </MagicPropsLayout> : null}
      </div>
      {
        (detail && item)?
        <SimpleBaseAttrView attrs={equipPartAttr} /> : null
      }
    </div>
  )
}


function Part({ part }: EquipProps) {
  const portrait = useContext(PortraitMode)
  return portrait? <PartCompact part={part} /> : <PartWide part={part} />
}


export function Equips() {
  const portrait = useContext(PortraitMode)
  return (
    <div className="Equips">
      <header>
        <h3>장비</h3>
        <div>※ 칼박 100%로 계산합니다.</div>
      </header>
      <div className="EquipsArrayLayout">
        <Part part="상의"/>
        <Part part="하의"/>
        <Part part="머리어깨"/>
        <Part part="벨트"/>
        <Part part="신발"/>
        <Part part="무기"/>
        <Part part="팔찌"/>
        <Part part="목걸이"/>
        <Part part="반지"/>
        <Part part="보조장비"/>
      </div>
      <OptionalAttrsView />
      {!portrait? <EquipBatch /> : null}
    </div>
  )
}

