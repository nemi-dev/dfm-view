import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { selectArtifacts, selectItem } from '../feats/selectors'
import { SetArtifactValue, SetCreatureStat } from '../feats/slices/slice'
import { LabeledInput } from "./widgets/Forms"
import { ItemIcon } from './widgets/Icons'
import { ItemName } from './widgets/ItemNameView'

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

function CreatureOrArtifactView({ item }: { item: DFItem }) {
  return (
    <CreatureOrArtiLayout>
      <ItemIcon item={item} />
      <ItemName item={item} />
    </CreatureOrArtiLayout>
  )
}

export function Creatures() {
  const
    creature = useAppSelector(selectItem["크리쳐"])
  const
    { Red, Green, Blue } = useAppSelector(selectArtifacts),
    stat = useAppSelector(state => state.CreatureProp.CreatureStat),
    redValue = useAppSelector(state => state.CreatureProp.RedPropsValue),
    greenValue = useAppSelector(state => state.CreatureProp.GreenPropsEl),
    blueValue = useAppSelector(state => state.CreatureProp.BluePropsValue)
  
  const dispatch = useAppDispatch()
  return (
    <div>
      <header>
      <h3>크리쳐</h3>
      </header>
      <IconsLayout>
        <CreatureOrArtifactView item={creature} />
        <CreatureOrArtifactView item={Red} />
        <CreatureOrArtifactView item={Green} />
        <CreatureOrArtifactView item={Blue} />
      </IconsLayout>
      <div className="InputArea">
        <LabeledInput label="크리쳐 스탯" value={stat} onChange={value => dispatch(SetCreatureStat(value))} />
      </div>
      <header>
      <h4>아티팩트 옵션</h4>
      <h5>(미지의 이빨 돌려서 맞추는 그)거</h5>
      </header>
      <div className="InputArea">
        <LabeledInput label="레드 아티팩트 옵션 (힘/지능)" value={redValue} onChange={value => dispatch(SetArtifactValue(["RedPropsValue", value]))} />
        <LabeledInput label="블루 아티팩트 옵션 (물리/마법공격력)" value={blueValue} onChange={value => dispatch(SetArtifactValue(["BluePropsValue", value]))} />
        <LabeledInput label="그린 아티팩트 옵션 (속성 강화)" value={greenValue} onChange={value => dispatch(SetArtifactValue(["GreenPropsValue", value]))} />
      </div>
    </div>
  )
}




