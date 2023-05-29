import { createContext, useContext, useState } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { PlusCircle } from 'react-feather'
import styled from 'styled-components'

import { AtypeAttrKey, Elemental } from '../constants'
import { AtkOut, critChance, StatOut } from '../damage'
import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { selectMyAttr, selectMyAttrTown, selectMyFinalEltype } from '../feats/selector/selectors'
import { selectClassAtype, selectCalibrate } from '../feats/selector/baseSelectors'
import {
  AddMyCaliSkillInc, DeleteMyCaliSkillInc, SetMyCaliSingleAttr, SetMyCaliEltype, SetMyCaliSkillInc
} from '../feats/slices/slicev5'
import { add } from '../utils'
import { Gridy } from './widgets/CommonUI'
import { CheckboxGroup, DisposableInput, LabeledSwitch, NumberInput } from './widgets/Forms'
import { Num } from './widgets/NumberView'

interface OneAttrTripletProps {
  numStyle?: string
  name?: string | JSX.Element
  aKey: keyof NumberCalibrate
  percent?: boolean
  signed?: boolean
}

const MyAttrsContext = createContext<BaseAttrs>({})


function OneAttrEditable({ numStyle = "", aKey, name, percent = false, signed = false }: OneAttrTripletProps) {
  const me = useContext(MyAttrsContext)
  const { [aKey]: value = 0 } = useAppSelector(selectCalibrate)
  const dispatch = useAppDispatch()
  return (
    <div className="FormDF AttrItem">
      {name? <div className="KeyName">{name}</div>: null}
      <Num className={"AttrValue " + numStyle} value={me[aKey]} signed={signed} percented={percent} />
      <NumberInput value={value} onChange={v => dispatch(SetMyCaliSingleAttr([aKey, v]))} />
    </div>
  )
}


const GridyTwo = styled.div`
  display: grid;
  grid-template-columns: 5fr 3fr;
  gap: 2px;
`

function StatAtkCrit() {
  const me = useContext(MyAttrsContext)
  const atype = useAppSelector(selectClassAtype)
  const { Stat, StatInc, Atk, AtkInc, Crit, CritCh, 스탯, 타입 } = AtypeAttrKey[atype]
  const stat = StatOut(me[Stat] ?? 0, me[StatInc] ?? 0)
  const atk = AtkOut(me[Atk] ?? 0, me[AtkInc] ?? 0, me[Stat] ?? 0, me[StatInc] ?? 0)
  const chance = critChance(me[Crit], me[CritCh])
  return (
    <div>
      <GridyTwo>
        <OneAttrEditable numStyle={atype} aKey={Stat} name={스탯} />
        <OneAttrEditable numStyle={atype} aKey={StatInc} name="증가" percent signed />
      </GridyTwo>
      <div className="Result">
        <div className="KeyName">{스탯}</div>
        <Num className={"AttrValue "+atype} value={stat} separated />
      </div>
      <GridyTwo>
        <OneAttrEditable numStyle={atype} aKey={Atk} name={타입[0]+"공"} />
        <OneAttrEditable numStyle={atype} aKey={AtkInc} name="증가" percent signed />
      </GridyTwo>
      <div className="Result">
        <div className="KeyName">공격력</div>
        <Num className={"AttrValue "+atype} value={atk} separated />
      </div>
      <GridyTwo>
        <OneAttrEditable numStyle={atype} aKey={Crit} name={타입[0]+"크"} />
        <OneAttrEditable numStyle={atype} aKey={CritCh} name="확률" percent signed />
      </GridyTwo>
      <div className="Result">
        <div className="KeyName">크리티컬 확률</div>
        <Num className={"AttrValue "+atype} value={chance * 100} percented percision={2} />
      </div>
    </div>
  )
}


const SkillIncValues = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
`

function SkillInc() {
  const { sk_inc } = useAppSelector(selectCalibrate)
  const dispatch = useAppDispatch()
  return (
    <div className="SkillInc AttrItem FormDF">
      <span className="KeyName">
        스증(장비)
        <button onClick={() => dispatch(AddMyCaliSkillInc())}>
          <PlusCircle width={16} height={16} />
        </button>
      </span>
      <SkillIncValues>
        {sk_inc.map((v, i) => {
          return <DisposableInput key={i} index={i} value={v}
            update={nv => dispatch(SetMyCaliSkillInc([i, nv]))}
            del={() => dispatch(DeleteMyCaliSkillInc(i))}
          />
        })}
      </SkillIncValues>
    </div>
  )
}

export function EditEltype() {
  const dispatch = useAppDispatch()
  const { eltype: calibrateEltypes } = useAppSelector(selectCalibrate)
  return  (
  <CheckboxGroup name="공격속성" 
    labels={["화", "수", "명", "암"]}
    values={["Fire", "Ice", "Light", "Dark"]}
    value={calibrateEltypes} dispatcher={(el, on) => dispatch(SetMyCaliEltype([el, on]))}
  />
  )
}

export function MyStat() {
  const [excludeCond, setExcludeCond] = useState(false)
  const me = excludeCond? useAppSelector(selectMyAttrTown) : useAppSelector(selectMyAttr)

  const eltype = useAppSelector(selectMyFinalEltype)
  const eltypeExpr = eltype.length? `${eltype.map(e => Elemental[e].속성).join("+")}` : "(속성없음)"

  return (
    <MyAttrsContext.Provider value={me} >
    <div className="MyStat">
      <header>
        <h3>스탯</h3>
      </header>
      <div className="InputArea">
        <LabeledSwitch label="마을스탯 보기" checked={excludeCond} onChange={setExcludeCond} />
          <StatAtkCrit />
          <Gridy columns={2} colSize="1fr">
          <OneAttrEditable aKey="cdmg_inc" name="크뎀증" percent signed />
          <OneAttrEditable aKey="catk_inc" name="크공증" percent signed />
          <OneAttrEditable aKey="dmg_inc" name="뎀증" percent signed />
          <OneAttrEditable aKey="dmg_add" name="추뎀" percent signed />
          <OneAttrEditable aKey="sk_inc_sum" name={<>스증<br/>(패시브)</>} percent signed />
          </Gridy>
          <SkillInc />
        <div className="Result">
          <div className="KeyName">스킬 공격력 증가</div>
          <Num className="AttrValue" value={add(me["sk_inc"], me["sk_inc_sum"])} signed percented />
        </div>
        <EditEltype />
        <GridyTwo>
          <OneAttrEditable numStyle="el_fire" aKey="el_fire" name="화속강" signed />
          <OneAttrEditable numStyle="el_fire" aKey="eldmg_fire" name="화속추" percent signed />
          <OneAttrEditable numStyle="el_ice"  aKey="el_ice"  name="수속강" signed />
          <OneAttrEditable numStyle="el_ice"  aKey="eldmg_ice"  name="수속추" percent signed />
          <OneAttrEditable numStyle="el_lght" aKey="el_lght" name="명속강" signed />
          <OneAttrEditable numStyle="el_lght" aKey="eldmg_lght" name="명속추" percent signed />
          <OneAttrEditable numStyle="el_dark" aKey="el_dark" name="암속강" signed />
          <OneAttrEditable numStyle="el_dark" aKey="eldmg_dark" name="암속추" percent signed />
        </GridyTwo>
        <div className="Result">
          <div className="KeyName">공격속성</div>
          <div className="AttrValue">
            {eltypeExpr}
          </div>
        </div>
        <Gridy columns={2} colSize="1fr">
          <OneAttrEditable aKey="target_def" name="적방어력" signed />
          <OneAttrEditable aKey="DefBreak" name="퍼센트방깎" percent />
        </Gridy>
      </div>
    </div>
    </MyAttrsContext.Provider>
  )
}
