import { useContext } from "react"
import styled from "styled-components"
import { acceptEmblem } from "../emblem"
import { useAppSelector, useAppDispatch } from "../feats/hooks"
// import { SetEquipUpgradeValue } from "../feats/slices/equipSlice"
import { NumberInput } from "./widgets/Forms"
import { ItemIcon } from "./widgets/Icons"
import { ModalContext } from "../modalContext"
import { EquipBatch } from "./EquipBatch"
import { MagicProps } from "./MagicProps"
import { selectCard, selectEmblemSpecs, selectItem, selectUpgrade } from "../feats/selectors"
import { ArmorMaterialSelect, EmblemArray } from "./Itemy"
import { SetUpgradeValue } from "../feats/slices/itemSlice"


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

function Part({ part }: { part: EquipPart }) {
  const item = useAppSelector(selectItem[part])
  const { openModal } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const card = useAppSelector(selectCard[part])
  const upgradeBonus = useAppSelector(selectUpgrade[part])
  const emblems = useAppSelector(selectEmblemSpecs[part])
  const emblemAccept = acceptEmblem(part)
  return (
    <PartLayout className="Part Bordered">
      <div className={item? `Rarity_${item.rarity}`:""}>{part}</div>
      <ItemIcon item={item} />
      <ArmorMaterialSelect part={part} />
      <div className="EquipUpgradeValue">
        +<NumberInput value={upgradeBonus}
        onChange={v => dispatch(SetUpgradeValue([part, v]))} />
      </div>
      <ItemIcon className="Card" item={card}
      onClick={() => openModal({name:"item", part, target: "Card", index: 0})} />
      <RowLayout>
        <EmblemArray emblems={emblems} accept={emblemAccept}
          onItemClick={index => openModal({name:"item", part, target: "Emblem", index })}
        />
      </RowLayout>
      <MagicPropsLayout>
      <MagicProps part={part} item={item} />
      </MagicPropsLayout>
    </PartLayout>
  )
}

const ForgeLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
`

const ForgeDiv = styled.div`
  .ItemIcon {
    --item-size: 36px;
  }
  .Card {
    --card-size: min(64px, 18vw);
  }
  .Emblem {
    --emblem-size: min(35px, 8.5vw);
  }
  .EquipAddons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`

export function Forge() {
  return (
    <ForgeDiv id="Forge">
      <header>
        <h3>대장간</h3>
        <div>강화,카드,마봉,엠블렘</div>
      </header>
      <ForgeLayout className="ForgeLayout">
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
      </ForgeLayout>
      <EquipBatch />
    </ForgeDiv>
  )
}


