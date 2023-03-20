import { useContext } from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { selectArtifacts } from "../feats/selector/creatureSelectors"
import { selectItem } from "../feats/selector/equipSelectors"
import { SetArtifactValue, SetCreatureStat } from '../feats/slices/slice'
import { ModalContext } from '../modalContext'
import { ClosedCondyceSet } from './Choices'
import { ArtifactModalFragment, CreatureModalFragment } from './modals/CreatureModal'
import { LabeledNumberInput } from "./widgets/Forms"
import { ItemIcon } from './widgets/Icons'

const IconsLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`

const CreatureOrArtiLayout = styled.div`
  flex-basis: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .ItemName {
    white-space: nowrap;
  }
`

function CreatureOrArtifactView({ item, part, color }: { item: DFItem, part: "크리쳐" | "아티팩트", color?: "Red" | "Green" | "Blue" }) {
  const { openModal } = useContext(ModalContext)

  return (
    <CreatureOrArtiLayout>
      <ItemIcon item={item} onClick={() => {
        if (part === "크리쳐") openModal(<CreatureModalFragment />)
        else openModal(<ArtifactModalFragment artiColor={color} />)
      }} />
    </CreatureOrArtiLayout>
  )
}

export function Creatures() {
  const
    creature = useAppSelector(selectItem["크리쳐"])
  const
    { Red, Green, Blue } = useAppSelector(selectArtifacts),
    stat = useAppSelector(state => state.My.CreatureProp.CreatureStat),
    redValue = useAppSelector(state => state.My.CreatureProp.RedPropsValue),
    greenValue = useAppSelector(state => state.My.CreatureProp.GreenPropsEl),
    blueValue = useAppSelector(state => state.My.CreatureProp.BluePropsValue)
  
  const dispatch = useAppDispatch()
  return (
    <div>
      <header>
      <h3>크리쳐</h3>
      </header>
      <IconsLayout>
        <CreatureOrArtifactView item={creature} part="크리쳐" />
        <CreatureOrArtifactView item={Red} part="아티팩트" color="Red"  />
        <CreatureOrArtifactView item={Green} part="아티팩트" color="Green"  />
        <CreatureOrArtifactView item={Blue} part="아티팩트" color="Blue"  />
      </IconsLayout>
      <div className="InputArea">
        <LabeledNumberInput label="크리쳐 스탯" value={stat} onChange={value => dispatch(SetCreatureStat(value))} />
      </div>
      <header>
      <h4>아티팩트 옵션</h4>
      <h5>(미지의 이빨 돌려서 맞추는 그거)</h5>
      </header>
      <div className="InputArea">
        <LabeledNumberInput label="레드 아티팩트 옵션 (힘/지능)" value={redValue} onChange={value => dispatch(SetArtifactValue(["RedPropsValue", value]))} />
        <LabeledNumberInput label="블루 아티팩트 옵션 (물리/마법공격력)" value={blueValue} onChange={value => dispatch(SetArtifactValue(["BluePropsValue", value]))} />
        <LabeledNumberInput label="그린 아티팩트 옵션 (속성 강화)" value={greenValue} onChange={value => dispatch(SetArtifactValue(["GreenPropsEl", value]))} />
      </div>
      <ClosedCondyceSet items={[creature, Red, Green, Blue]} />
    </div>
  )
}




