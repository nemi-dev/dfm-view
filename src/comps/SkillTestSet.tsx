import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { selectMe, selectMyFinalEltype } from '../selectors'
import { beautyNumber } from '../utils'
import { criticalChance, criticize } from '../damage'
import { SetSkillFixValue, SetSkillInputName, SetSkillUsesSkillInc, SetSkillValue } from '../feats/slices/skillInputSlice'
import { LabeledInput } from './CommonUI'
import { getDamage } from './VerboseAttrsView'
import { VerboseResult } from './AttrsView'


interface SkillInputOneProps extends SkillSpec {
  index: number
}
function SkillInputOne({ index, value, fixed, useSkillInc, name }: SkillInputOneProps) {
  const dispatch = useAppDispatch()
  return (
    <div className="SkillInputOne">
      <input className="SkillName" type="text" value={name} onChange={ev => dispatch(SetSkillInputName([index, ev.target.value]))} />
      <LabeledInput label="계수(%)" value={value} onChange={v => dispatch(SetSkillValue([index, v]))} />
      <LabeledInput label="고정값" value={fixed} onChange={v => dispatch(SetSkillFixValue([index, v]))} />
      <span className="SkillUsesInc">
        <input type="checkbox" id={`skill${index}-${name}`} checked={useSkillInc} onChange={ev => dispatch(SetSkillUsesSkillInc([index, ev.target.checked]))} />
        <label htmlFor={`skill${index}-${name}`}>스증 적용</label>
      </span>
    </div>
  )
}


interface SkillOutputOneProps {
  index: number
  skillSpec: SkillSpec
}
function SkillTestOne({ index, skillSpec }: SkillOutputOneProps) {

  const atype = useAppSelector(state => state.Profile.atype)

  const attrs = useAppSelector(selectMe)
  const atkFix = useAppSelector(state => state.Profile.atk_fixed)
  const [eltype, el, eldmg] = useAppSelector(selectMyFinalEltype)

  const withoutCrit = getDamage(atype, attrs, atkFix, el, eldmg, skillSpec)
  const withCrit = criticize(withoutCrit, attrs["cdmg_inc"])

  const critChancePhysc = criticalChance(attrs["crit_ph"], attrs["crit_ph_pct"])
  const critChanceMagic = criticalChance(attrs["crit_mg"], attrs["crit_mg_pct"])

  const chance = atype === "Physc"? critChancePhysc : critChanceMagic
  
  const mean = chance * withCrit + (1 - chance) * withoutCrit
  return (
    <div className="SkillTestOne">
      <SkillInputOne index={index} {...skillSpec} />
      <VerboseResult className={"Vertical " + atype} name={"데미지"} value={beautyNumber(withoutCrit)} />
      <VerboseResult className={"Vertical " + atype} name={"평균 데미지"} value={beautyNumber(mean)} />
      <VerboseResult className={"Vertical " + atype} name={"크리티컬 데미지"} value={beautyNumber(withCrit)} />
    </div>
  )
}

export function SkillTestSet() {
  const cases = useAppSelector(state => state.SkillInput.cases)
  return (
    <div style={{ position: "relative" }}>
      <h3>스킬</h3>
      <div className="SkillTestSet">
      {cases.map((a, index) => (
        <SkillTestOne key={index} index={index} skillSpec={a} />
      ))}
      </div>
    </div>
    
  )
}
