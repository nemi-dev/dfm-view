import styled from 'styled-components'

import { AtypeAttrKey, Elemental } from '../constants'
import { AtkOut, critChance, critFt, EldmgFt, StatOut } from '../damage'
import { useAppSelector } from '../feats/hooks'
import { selectClassAtype } from '../feats/selector/baseSelectors'
import { selectMyAttr, selectMyFinalEltype } from '../feats/selector/selectors'
import { add } from '../utils'
import { Num } from './widgets/NumberView'

interface ResultOneProps {
  numStyle?: string
  name: string
  value: any
  signed?: boolean
  percented?: boolean
  separated?: boolean
  precision?: number
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-around;
  width: 100%;
`

const NamedValueStyle = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 0;
  font-size: 1rem;
  .KeyName {
    font-size: 0.8rem;
  }
  @media screen and (max-width: 999px) {
    gap: 2px;
    font-size: 0.9rem;
    .KeyName {
      font-size: 0.6rem;
    }
  }
`


function NamedNumber({ name, numStyle = "", value, signed = false, percented = false, separated = false, precision = 0 }: ResultOneProps) {
  return (
    <NamedValueStyle>
      <div className="KeyName">{name}</div>
      <Num className={"AttrValue "+numStyle}
        value={value ?? 0}
        signed={signed}
        percented={percented}
        separated={separated}
        percision={precision}
      />
    </NamedValueStyle>
  )
}

function ElValue({ eltype }: { eltype: Eltype }) {
  const myAttrs = useAppSelector(selectMyAttr)
  const elName = Elemental[eltype]["속성"]
  const elKey = Elemental[eltype].el
  const el = myAttrs[elKey] ?? 0
  return <NamedNumber numStyle={eltype} name={`${elName}속`} value={el} />
}

function EltypeArray() {
  const eltypes = useAppSelector(selectMyFinalEltype)
  if (!eltypes?.length)
  return (
    <NamedValueStyle>
    <div className="AttrValue">속성 없음!!!</div>
    </NamedValueStyle>
  )

  return (
    <>
    {eltypes.map(eltype => <ElValue key={eltype} eltype={eltype} />)}
    </>
  )
}

function ElAddDamage({ eltype }: { eltype: Eltype }) {
  const myAttrs = useAppSelector(selectMyAttr)
  const elKey = Elemental[eltype].el
  const eldmgKey = Elemental[eltype].eldmg
  const el = myAttrs[elKey]
  const eldmg = myAttrs[eldmgKey]
  const value = EldmgFt(el, eldmg)
  if (Math.abs(value) < 0.001) return null
  return <Num className={"AttrValue " + eltype} value={value * 100} percented percision={1} />
}


const MyStatArea = styled.div`
  flex-wrap: wrap;
  gap: 3px;
`

const FirstFuckingRow = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr 3fr 2fr;
  justify-items: start;

`

const SecondFuckingRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: start;
`

export function SecondRow() {
  const myAttrs = useAppSelector(selectMyAttr)
  const atype = useAppSelector(selectClassAtype)
  const { 
    Stat: statKey,
    StatInc: statIncKey,
    Atk: atkKey,
    AtkInc: atkIncKey,
    Crit: critKey,
    CritCh: critChKey,
    스탯,
    타입
  } = AtypeAttrKey[atype]
  const stat = StatOut(myAttrs[statKey], myAttrs[statIncKey])
  const statInc = myAttrs[statIncKey] ?? 0
  const atk = AtkOut(myAttrs[atkKey], myAttrs[atkIncKey], myAttrs[statKey], myAttrs[statIncKey])
  const atkInc = myAttrs[atkIncKey] ?? 0
  const chance = critChance(myAttrs[critKey], myAttrs[critChKey]) * 100
  const critft = critFt(myAttrs["cdmg_inc"], myAttrs["catk_inc"]) * 100
  const skinc = add(myAttrs["sk_inc"], myAttrs["sk_inc_sum"])
  return (
    <MyStatArea>
      <FirstFuckingRow>
        <NamedNumber name={스탯} value={stat}  separated />
        <NamedNumber name={`${스탯}증가`} value={statInc}  signed percented />
        <NamedNumber name={`${타입[0]}공`} value={atk} separated />
        <NamedNumber name={`${타입[0]}공증가`} value={atkInc}  percented />
      </FirstFuckingRow>
      <SecondFuckingRow>
        <NamedNumber name="크확" value={chance} percented precision={2} />
        <NamedNumber name="크배율" value={critft} percented precision={2}/>
        <NamedNumber name="뎀증" value={myAttrs["dmg_inc"]} percented precision={2}/>
        <NamedNumber name="스증" value={skinc} percented />
        <NamedNumber name="추뎀" value={myAttrs["dmg_add"]} percented />
      </SecondFuckingRow>
      <Row>
        <EltypeArray />
        <NamedValueStyle>
        <div className="KeyName">속추뎀(실적용)</div>
        {["Fire", "Ice", "Light", "Dark"].map(eltype => (
          <ElAddDamage key={eltype} eltype={eltype as Eltype} />
        ))}
        </NamedValueStyle>
      </Row>
    </MyStatArea>
  )
}
