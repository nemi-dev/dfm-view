import { attrDefs } from "../attrs"
import { calcAtk, calcStat, criticalChance } from "../damage"
import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { AddSkillInc, CalibrateInitType, RemoveSkillInc, SetBasicAttr, SetEltype, SetSkillInc } from "../feats/slices/calibrateSlice"
import { DeleteSwitch } from "../feats/slices/equipSlice"
import { selectMe, selectMeWithoutCalibrate, selectMyFinalEltype } from "../selectors"
import { beautyNumber } from "../utils"
import { CheckboxGroup, DisposableInput, Gridy, LabeledInput, NumberInput, Percent, RadioGroup } from "./CommonUI"

import styled from 'styled-components'
import { VerboseResult } from "./AttrsView"
import { SetAchieveLevel, SetAtype, SetLevel, set_atk_fixed } from "../feats/slice"


interface SwitchNotificationProps {
  what: "branches" | "gives" | "exclusives"
  switchKey: string
  value?: string
}


function SwitchNotification({ what, switchKey, value }: SwitchNotificationProps) {
  const chop = switchKey.split("::")
  const dispatch = useAppDispatch()
  return (
    <div className="SwitchNotification">
      ⚠️ [{chop[0]}]의 "{chop[1]}" 옵션이 { value? `"${value}"로 되어 있습니다.` : "켜진 상태입니다."}
      <button onClick={() => dispatch(DeleteSwitch([what, switchKey]))}>끄기</button>
    </div>
  )
}

function SwitchGroup() {
  const { branches, gives, exclusives } = useAppSelector(state => state.Switch)
  return (
  <div>
    {Object.keys(branches).sort().map(k => (
      branches[k]? <SwitchNotification key={k} what="branches" switchKey={k} /> : null
    ))}
    {Object.keys(gives).sort().map(k => (
      gives[k]? <SwitchNotification key={k} what="gives" switchKey={k} /> : null
    ))}
    {Object.keys(exclusives).sort().map(k => (
      exclusives[k]? <SwitchNotification key={k} what="exclusives" switchKey={k} value={exclusives[k]} /> : null
    ))}
  </div>
  )
}



type NumberCalibrate = Omit<CalibrateInitType, "eltype" | "sk_inc">

type OneAttrTripletProps = {
  className?: string
  name?: string | JSX.Element
  aKey: any
  percent?: boolean
  signed?: boolean
}

function OneAttrTriplet({ className = "", name, aKey, percent = false, signed = false }: OneAttrTripletProps) {
  const cattr = useAppSelector(state => state.Calibrate)
  const me = useAppSelector(selectMe)
  const cValue = percent? <Percent value={me[aKey]} signed={signed} /> : beautyNumber(me[aKey] as number)
  const dispatch = useAppDispatch()
  return (
    <div className={"AttrOne " + (percent? "Percented " : "") +  className}>
      {name? <div className="AttrName">{name}</div>: null}
      <div className="AttrValue">{cValue}</div>
      <NumberInput value={cattr[aKey]} onChange={v => dispatch(SetBasicAttr([aKey, v]))} />
    </div>
  )
}

const GridyTwo = styled.div`
  display: grid;
  grid-template-columns: 5fr 3fr;
  gap: 2px;
`

function StatAtkCrit({ atype, className = "" }: { atype: "Physc" | "Magic", className? : string }) {
  const me = useAppSelector(selectMe)
  const at_keys: (keyof NumberCalibrate)[] = atype === "Physc"?
  ["strn", "str_inc", "atk_ph", "atk_ph_inc", "crit_ph", "crit_ph_pct"]
  : ["intl", "int_inc", "atk_mg", "atk_mg_inc", "crit_mg", "crit_mg_pct"]
  const
    [key_stat, key_stat_inc, key_atk, key_atk_inc, key_crit, key_crit_pct] = at_keys,
    [name_stat,, name_atk, ,name_crit] = at_keys.map(k => attrDefs[k].name)
  const chance = criticalChance(me[key_crit], me[key_crit_pct])
  return (
    <div className={"StatAtkCrit "+atype+" "+className} >
      <GridyTwo>
        <OneAttrTriplet aKey={key_stat} name={name_stat} />
        <OneAttrTriplet aKey={key_stat_inc} name="증가" percent signed />
      </GridyTwo>
      <div className="Result">
        <div className="AttrName">(마을) {name_stat}</div>
        <div className="AttrValue">{beautyNumber(calcStat(me[key_stat], me[key_stat_inc]))}</div>
      </div>
      <GridyTwo>
        <OneAttrTriplet aKey={key_atk} name={name_atk[0]+"공"} />
        <OneAttrTriplet aKey={key_atk_inc} name="증가" percent signed />
      </GridyTwo>
      <div className="Result">
        <div className="AttrName">(마을) {name_atk}</div>
        <div className="AttrValue">{beautyNumber(calcAtk(me[key_atk], me[key_atk_inc], me[key_stat], me[key_stat_inc]))}</div>
      </div>
      <GridyTwo>
        <OneAttrTriplet aKey={key_crit} name={name_crit[0]+"크"} />
        <OneAttrTriplet aKey={key_crit_pct} name="확률" percent signed />
      </GridyTwo>
      <div className="Result">
        <div className="AttrName">크리티컬 확률</div>
        <div className="AttrValue"><Percent value={chance * 100} /></div>
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
  const cattr = useAppSelector(state => state.Calibrate)
  const dispatch = useAppDispatch()
  return (
    <div className="SkillInc AttrOne">
      <span className="AttrName">스증(장비)<button onClick={() => dispatch(AddSkillInc())}>+</button></span>
      <SkillIncValues>
        {cattr.sk_inc.map((v, i) => {
          return <DisposableInput key={i} index={i} value={v}
            update={nv => dispatch(SetSkillInc([i, nv]))}
            del={() => dispatch(RemoveSkillInc(i))}
          />
        })}
      </SkillIncValues>
    </div>
  )
}

const FieldArray = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export function MyStat() {
  const me = useAppSelector(selectMe)
  const atype = useAppSelector(state => state.Profile.atype)
  const calibrateEltypes = useAppSelector(state => state.Calibrate.eltype)
  const [eltype, el, eldmg] = useAppSelector(selectMyFinalEltype)
  const dispatch = useAppDispatch()

  const
    my_level = useAppSelector(state => state.Profile.level),
    AchieveLevel = useAppSelector(state => state.Profile.achieveLevel),
    atk_fixed = useAppSelector(state => state.Profile.atk_fixed)
  return (
    <div className="MyStat">
      <header>
        <h3>스탯</h3>
        <div>스탯이 실제와 다르면 조정할 수 있습니다.</div>
      </header>
      <SwitchGroup />
      <div className="InputArea">
        <GridyTwo>
          <LabeledInput label="캐릭터 레벨" value={my_level} onChange={v => dispatch(SetLevel(v))} />
          <LabeledInput label="업적 레벨" value={AchieveLevel} onChange={v => dispatch(SetAchieveLevel(v))} />
          <LabeledInput label="독립 공격력" value={atk_fixed} onChange={v => dispatch(set_atk_fixed(v))} />
        </GridyTwo>
          <RadioGroup name="공격타입" className="AtypeSelector"
            labels={["물리", "마법"]}
            values={["Physc", "Magic"]}
            value={atype}
            dispatcher={v => dispatch(SetAtype(v))}
          />
          <CheckboxGroup name="공격속성" values={["화", "수", "명", "암"]} value={calibrateEltypes} dispatcher={(el, on) => dispatch(SetEltype([el, on]))} />
          <StatAtkCrit atype={atype} />
          <Gridy columns={2} colSize="1fr">
          <OneAttrTriplet aKey="cdmg_inc" name="크뎀증" percent signed />
          <OneAttrTriplet aKey="dmg_inc" name="뎀증" percent signed />
          <OneAttrTriplet aKey="dmg_add" name="추뎀" percent signed />
          <OneAttrTriplet aKey="sk_inc_sum" name={<>스증<br/>(패시브)</>} percent signed />
          </Gridy>
          <SkillInc />
        <VerboseResult name="스킬공격력" value={<Percent value={me["sk_inc"] + me["sk_inc_sum"]} signed />} />
        <GridyTwo>
          <OneAttrTriplet className="el_fire" aKey="el_fire" name="화속강" />
          <OneAttrTriplet className="el_fire" aKey="eldmg_fire" name="화속추" percent signed />
          <OneAttrTriplet className="el_ice"  aKey="el_ice"  name="수속강" />
          <OneAttrTriplet className="el_ice"  aKey="eldmg_ice"  name="수속추" percent signed />
          <OneAttrTriplet className="el_lght" aKey="el_lght" name="명속강" />
          <OneAttrTriplet className="el_lght" aKey="eldmg_lght" name="명속추" percent signed />
          <OneAttrTriplet className="el_dark" aKey="el_dark" name="암속강" />
          <OneAttrTriplet className="el_dark" aKey="eldmg_dark" name="암속추" percent signed />
        </GridyTwo>
        <VerboseResult name="공격속성" value={eltype? `${eltype}` : "(속성없음)"} />
      </div>
    </div>
  )
}
