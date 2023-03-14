import { AtypeAttrKey, Elemental } from "../attrs"
import { AtkOut, StatOut, criticalChance } from "../damage"
import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { AddSkillInc, RemoveSkillInc, SetBasicAttr, SetEltype, SetSkillInc } from "../feats/slices/calibrateSlice"
import { selectMe, selectMeNoCond, selectMyFinalEltype } from "../feats/selector/selectors"
import { selectClassAtype } from "../feats/selector/selfSelectors"
import { Gridy } from "./widgets/CommonUI"
import { Num } from "./widgets/NumberView"
import { CheckboxGroup, DisposableInput, LabeledNumberInput, NumberInput, RadioGroup, LabeledSwitch } from "./widgets/Forms"

import styled from 'styled-components'
import { SetAchieveLevel, SetAtype, SetLevel, set_atk_fixed } from "../feats/slices/slice"
import { createContext, useContext, useState } from "react"




interface OneAttrTripletProps {
  className?: string
  name?: string | JSX.Element
  aKey: keyof NumberCalibrate
  percent?: boolean
  signed?: boolean
}

const MyAttrsContext = createContext<BaseAttrs>({})


function OneAttrTriplet({ className = "", name, aKey, percent = false, signed = false }: OneAttrTripletProps) {
  const cattr = useAppSelector(state => state.My.Calibrate)
  const me = useContext(MyAttrsContext)
  const dispatch = useAppDispatch()
  return (
    <div className={"AttrOne " + (percent? "Percented " : "") +  className}>
      {name? <div className="AttrName">{name}</div>: null}
      <Num className="AttrValue" value={me[aKey]} signed={signed} percented={percent} />
      <NumberInput value={cattr[aKey]} onChange={v => dispatch(SetBasicAttr([aKey, v]))} />
    </div>
  )
}



const GridyTwo = styled.div`
  display: grid;
  grid-template-columns: 5fr 3fr;
  gap: 2px;
`

interface StatAtkCritProps {
  atype: "Physc" | "Magic"
  className?: string
}

function StatAtkCrit({ atype, className = "" }: StatAtkCritProps) {
  const me = useContext(MyAttrsContext)
  const { Stat, StatInc, Atk, AtkInc, Crit, CritCh, 스탯, 타입 } = AtypeAttrKey[atype]
  const stat = StatOut(me[Stat], me[StatInc])
  const atk = AtkOut(me[Atk], me[AtkInc], me[Stat], me[StatInc])
  const chance = criticalChance(me[Crit], me[CritCh])
  return (
    <div className={atype+" "+className} >
      <GridyTwo>
        <OneAttrTriplet aKey={Stat} name={스탯} />
        <OneAttrTriplet aKey={StatInc} name="증가" percent signed />
      </GridyTwo>
      <div className="Result">
        <div className="AttrName">{스탯}</div>
        <Num className="AttrValue" value={stat} separated />
      </div>
      <GridyTwo>
        <OneAttrTriplet aKey={Atk} name={타입[0]+"공"} />
        <OneAttrTriplet aKey={AtkInc} name="증가" percent signed />
      </GridyTwo>
      <div className="Result">
        <div className="AttrName">{`${타입} 공격력`}</div>
        <Num className="AttrValue" value={atk} separated />
      </div>
      <GridyTwo>
        <OneAttrTriplet aKey={Crit} name={타입[0]+"크"} />
        <OneAttrTriplet aKey={CritCh} name="확률" percent signed />
      </GridyTwo>
      <div className="Result">
        <div className="AttrName">크리티컬 확률</div>
        <Num className="AttrValue" value={chance * 100} percented percision={2} />
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
  const sk_inc = useAppSelector(state => state.My.Calibrate.sk_inc)
  const dispatch = useAppDispatch()
  return (
    <div className="SkillInc AttrOne">
      <span className="AttrName">스증(장비)<button onClick={() => dispatch(AddSkillInc())}>+</button></span>
      <SkillIncValues>
        {sk_inc.map((v, i) => {
          return <DisposableInput key={i} index={i} value={v}
            update={nv => dispatch(SetSkillInc([i, nv]))}
            del={() => dispatch(RemoveSkillInc(i))}
          />
        })}
      </SkillIncValues>
    </div>
  )
}

export function MyStat() {
  const [excludeCond, setExcludeCond] = useState(false)
  const atype = useAppSelector(selectClassAtype)
  const me = excludeCond? useAppSelector(selectMeNoCond) : useAppSelector(selectMe)
  const calibrateEltypes = useAppSelector(state => state.My.Calibrate.eltype)

  const eltype = useAppSelector(selectMyFinalEltype)
  const eltypeExpr = eltype.length? `${eltype.map(e => Elemental[e].속성).join("+")}` : "(속성없음)"
  const dispatch = useAppDispatch()

  const
    my_level = useAppSelector(state => state.My.Self.level),
    AchieveLevel = useAppSelector(state => state.My.Self.achieveLevel),
    atk_fixed = useAppSelector(state => state.My.Self.atk_fixed)
  return (
    <MyAttrsContext.Provider value={me} >
    <div className="MyStat">
      <header>
        <h3>스탯</h3>
      </header>
      <div className="InputArea">
        <LabeledSwitch label="마을스탯 보기" checked={excludeCond} onChange={setExcludeCond} />
        <GridyTwo>
          <LabeledNumberInput label="캐릭터 레벨" value={my_level} onChange={v => dispatch(SetLevel(v))} />
          <LabeledNumberInput label="업적 레벨" value={AchieveLevel} onChange={v => dispatch(SetAchieveLevel(v))} />
          <LabeledNumberInput label="독립 공격력" value={atk_fixed} onChange={v => dispatch(set_atk_fixed(v))} />
        </GridyTwo>
          <RadioGroup name="공격타입" className="AtypeSelector"
            labels={["물리", "마법"]}
            values={["Physc", "Magic"]}
            value={atype}
            dispatcher={v => dispatch(SetAtype(v))}
          />
          <StatAtkCrit atype={atype} />
          <Gridy columns={2} colSize="1fr">
          <OneAttrTriplet aKey="cdmg_inc" name="크뎀증" percent signed />
          <OneAttrTriplet aKey="dmg_inc" name="뎀증" percent signed />
          <OneAttrTriplet aKey="dmg_add" name="추뎀" percent signed />
          <OneAttrTriplet aKey="sk_inc_sum" name={<>스증<br/>(패시브)</>} percent signed />
          </Gridy>
          <SkillInc />
        <div className="Result">
          <div className="AttrName">스킬 공격력 증가</div>
          <Num className="AttrValue" value={me["sk_inc"] + me["sk_inc_sum"]} signed percented />
        </div>
        <CheckboxGroup name="공격속성" 
          labels={["화", "수", "명", "암"]}
          values={["Fire", "Ice", "Light", "Dark"]}
          value={calibrateEltypes} dispatcher={(el, on) => dispatch(SetEltype([el, on]))}
        />
        <GridyTwo>
          <OneAttrTriplet className="el_fire" aKey="el_fire" name="화속강" signed />
          <OneAttrTriplet className="el_fire" aKey="eldmg_fire" name="화속추" percent signed />
          <OneAttrTriplet className="el_ice"  aKey="el_ice"  name="수속강" signed />
          <OneAttrTriplet className="el_ice"  aKey="eldmg_ice"  name="수속추" percent signed />
          <OneAttrTriplet className="el_lght" aKey="el_lght" name="명속강" signed />
          <OneAttrTriplet className="el_lght" aKey="eldmg_lght" name="명속추" percent signed />
          <OneAttrTriplet className="el_dark" aKey="el_dark" name="암속강" signed />
          <OneAttrTriplet className="el_dark" aKey="eldmg_dark" name="암속추" percent signed />
        </GridyTwo>
        <div className="Result">
          <div className="AttrName">공격속성</div>
          <div className="AttrValue">
            {eltypeExpr}
          </div>
        </div>
      </div>
    </div>
    </MyAttrsContext.Provider>
  )
}
