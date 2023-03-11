import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { selectMe, selectMyFinalEltype } from '../feats/selectors'
import { selectAtype } from "../feats/selector/selfSelectors"
import { beautyNumber } from '../utils'
import { criticalChance, criticize, getDamage } from '../damage'
import { SetSkillFixValue, SetSkillInputName, SetSkillUsesSkillInc, SetSkillValue } from '../feats/slices/skillInputSlice'
import { Checkie, LabeledInput } from "./widgets/Forms"
import { VerboseResult } from './widgets/AttrsView'
import { Elemental, MyAttrKey } from '../attrs'




interface SkillInputOneProps extends SkillOneAttackSpec {
  index: number
}

function SkillInputOne({ index, value, fixed, isSkill: useSkillInc, name }: SkillInputOneProps) {
  const dispatch = useAppDispatch()
  return (
    <div className="SkillInputOne">
      <input className="SkillName" type="text" value={name} onChange={ev => dispatch(SetSkillInputName([index, ev.target.value]))} />
      <LabeledInput label="계수(%)" value={value} onChange={v => dispatch(SetSkillValue([index, v]))} />
      <LabeledInput label="고정값" value={fixed} onChange={v => dispatch(SetSkillFixValue([index, v]))} />
      <Checkie className="SkillUsesInc" label="스증 적용" checked={useSkillInc} onChange={b => dispatch(SetSkillUsesSkillInc([index, b]))} />
    </div>
  )
}


interface SkillOutputOneProps {
  index: number
  SkillOneAttackSpec: SkillOneAttackSpec
}
function SkillTestOne({ index, SkillOneAttackSpec }: SkillOutputOneProps) {

  const atype = useAppSelector(selectAtype)

  const attrs = useAppSelector(selectMe)
  const atkFix = useAppSelector(state => state.Profile.atk_fixed)
  const me = useAppSelector(selectMe)
  const eltype = useAppSelector(selectMyFinalEltype)
  const el = me[Elemental[eltype[0]]?.el] ?? 0
  const eldmg = me[Elemental[eltype[0]]?.eldmg] ?? 0

  const withoutCrit = getDamage(atype, attrs, atkFix, el, eldmg, SkillOneAttackSpec)
  const withCrit = criticize(withoutCrit, attrs["cdmg_inc"])

  const { Crit, CritCh } = MyAttrKey[atype]
  const chance = criticalChance(attrs[Crit], attrs[CritCh])
  
  const mean = chance * withCrit + (1 - chance) * withoutCrit
  return (
    <div className="SkillTestOne">
      <SkillInputOne index={index} {...SkillOneAttackSpec} />
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
        <SkillTestOne key={index} index={index} SkillOneAttackSpec={a} />
      ))}
      </div>
    </div>
    
  )
}
