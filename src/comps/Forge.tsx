import "../style/Forge.scss"
import { useContext } from "react"
import styled from "styled-components"
import { acceptEmblem } from "../emblem"
import { useAppSelector, useAppDispatch } from "../feats/hooks"
import { NextMagicProps, SetEquipUpgradeValue, SetMaterial } from "../feats/slices/equipSlice"
import { getItem, isArmorPart } from "../items"
import { EmblemArray } from "./CommonUI"
import { NumberInput } from "./widgets/Forms"
import { ItemIcon } from "./widgets/Icons"
import { ModalContext } from "../modalContext"
import { EquipBatch } from "./EquipBatch"
import { MagicPropSet } from "./MagicProps"


interface PartProps {
  part: EquipPart
  interactive?: boolean
  showUpgarde?: boolean
}


function ArmorMaterialSelectElement({ part }: PartProps) {
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

const PartLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-block-start: 4px;
`

const RowLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const MagicPropsLayout = styled.div`
  flex-grow: 1;
  align-self: stretch;
  height: max(calc(100vw / 15 - 20px), 30px);

  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  
`

function Part({ part }: PartProps) {
  const item = useAppSelector(state => getItem(state.Equips[part].name))
  const { openModal } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const cardName = useAppSelector(state => state.Equips[part].card)
  const card = getItem(cardName) as Card
  const upgradeBonus = useAppSelector(state => state.Equips[part].upgrade)
  const emblems = useAppSelector(state => state.Equips[part].emblems)
  const emblemAccept = acceptEmblem(part)
  return (
    <PartLayout className="Part Bordered">
      <div className={item? `Rarity_${item.rarity}`:""}>{part}</div>
      <ItemIcon attrs={item} />
      <ArmorMaterialSelectElement part={part} />
      <div className="EquipUpgradeValue">
        +<NumberInput value={upgradeBonus}
        onChange={v => dispatch(SetEquipUpgradeValue([part, v]))} />
      </div>
      <ItemIcon className="Card" attrs={card} onClick={() => openModal(part, "Card", 0)} />
      <RowLayout>
        <EmblemArray emblems={emblems} accept={emblemAccept}
          onItemClick={index => openModal(part, "Emblem", index)}
        />
      </RowLayout>
      <MagicPropsLayout>
      <MagicPropSet part={part} item={item}
      arraySelector={state => state.Equips[part].magicProps}
      actionCreator={(part: EquipPart, index) => NextMagicProps([part, index])}
      />
      </MagicPropsLayout>
    </PartLayout>
  )
}

const AddonsArrayLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
`

export function Forge() {
  return (
    <div className="Forge">
      <header>
        <h3>대장간</h3>
        <div>강화,카드,마봉,엠블렘</div>
      </header>
      <AddonsArrayLayout className="AddonsArrayLayout">
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
      </AddonsArrayLayout>
      <EquipBatch />
    </div>
  )
}


