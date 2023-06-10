import { useContext } from "react"
import styled from "styled-components"
import { useAppSelector } from "../feats/hooks"
import { ItemIcon } from "./widgets/Icons"
import { ModalContext } from "../feats/contexts"
import { EquipBatch } from "./EquipBatch"
import { MagicProps } from "./MagicProps"
import { selectCard, selectMainItem, selectArtifact } from "../feats/selector/itemSelectors"
import { ArmorMaterialSelect, ArtiUpgrade, EmblemArray, Upgrade } from "./Itemy"
import { hasMagicProps, isCardable, isEquip } from "../items"
import { CardModalFragment } from "./modals/CardModal"


function CardSlot({ part }: { part: WholePart }) {
  if (!isCardable(part)) return null
  const { openModal } = useContext(ModalContext)
  const card = useAppSelector(state => selectCard(state, undefined, part))
  return(
    <ItemIcon className="Card" item={card}
      onClick={() => openModal(<CardModalFragment part={part} />)}
    />
  )
}

const PartLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-block-start: 4px;
`

const PartHeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 80%;
  .ItemIcon {
    --item-size: 24px;
  }
`

const AddonLayout = styled.div`
  display: grid;
  grid-template-areas: 
    "cd em1"
    "cd em2"
  ;
  align-items: center;
  justify-content: center;
  > :first-child {
    grid-area: cd;
  }
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

function Part({ part }: { part: EquipPart | "칭호" | "봉인석" | "크리쳐" }) {
  const item = useAppSelector(state => selectMainItem(state, undefined, part))
  return (
    <PartLayout className="Part Bordered">
      <PartHeading className={item? `Rarity_${item.rarity}`:""}>
        <ItemIcon item={item} />
        {isEquip(part) || part=="크리쳐" ? <Upgrade part={part}/> : part}
      </PartHeading>
      <ArmorMaterialSelect part={part} />
      <AddonLayout>
        <CardSlot part={part} />
        <EmblemArray part={part} />
      </AddonLayout>
      {hasMagicProps(part)? <MagicPropsLayout>
        <MagicProps part={part} item={item} />
      </MagicPropsLayout> : null}
    </PartLayout>
  )
}

function ArtiPart({ color }: { color: ArtifactColor }) {
  const item = useAppSelector(selectArtifact(color))
  return (
    <PartLayout className="Part Bordered">
      <PartHeading className={item? `Rarity_${item.rarity}`:""}>
        <ItemIcon item={item} />
        <ArtiUpgrade color={color} />
      </PartHeading>
    </PartLayout>
  )
}

const ForgeLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
`

const ForgeDiv = styled.div`
  .Card {
    --card-size: min(50px, 12vw);
  }
  .Emblem {
    --emblem-size: min(25px, 6vw);
  }
  .PartAddons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`

export function Forge() {
  return (
    <ForgeDiv id="Forge">
      <ForgeLayout className="ForgeLayout">
        <Part part="무기"/>
        <Part part="팔찌"/>
        <Part part="목걸이"/>
        <Part part="반지"/>
        <Part part="보조장비"/>
        <Part part="머리어깨"/>
        <Part part="상의"/>
        <Part part="하의"/>
        <Part part="벨트"/>
        <Part part="신발"/>
        <Part part="봉인석"/>
        <Part part="크리쳐"/>
        <ArtiPart color="Red" />
        <ArtiPart color="Green" />
        <ArtiPart color="Blue" />
        <Part part="칭호"/>
      </ForgeLayout>
      <EquipBatch />
    </ForgeDiv>
  )
}


