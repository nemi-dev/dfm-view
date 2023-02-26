import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { selectMe } from '../selectors'
import { beautyNumber } from '../utils'
import { criticize } from '../damage'
import { SetSkillAtype, SetSkillFixValue, SetSkillInputName, SetSkillUsesSkillInc, SetSkillValue } from '../feats/slices/skillInputSlice'
import { LabeledInput } from './CommonUI'
import { selectMyFinalEltype, getDamage, VerboseResult } from './VerboseAttrsView'


interface SkillInputOneProps extends SkillSpec {
  index: number
}
function SkillInputOne({ index, value, fixed, useSkillInc, atype, name }: SkillInputOneProps) {
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
      <span className="SkillIsPhysc">
        <input type="radio" name={`skill${index}-${name}-Atype`} id={`skill${index}-${name}-Physc`} checked={atype === "Physc"}
          onChange={() => dispatch(SetSkillAtype([index, "Physc"]))} />
        <label htmlFor={`skill${index}-${name}-Physc`}>물리 공격</label>
      </span>
      <span className="SkillIsMagic">
        <input type="radio" name={`skill${index}-${name}-Atype`} id={`skill${index}-${name}-Magic`} checked={atype === "Magic"}
          onChange={() => dispatch(SetSkillAtype([index, "Magic"]))} />
        <label htmlFor={`skill${index}-${name}-Magic`}>마법 공격</label>
      </span>
    </div>
  )
}
export function SkillTestSet() {
  const cases = useAppSelector(state => state.SkillInput.cases)
  return (
    <div>
      <h3>스킬</h3>
      <div className="SkillTestSet">
      {cases.map((a, index) => (
        <div key={index} className="SkillInputAndOutputRow">
          <SkillInputOne index={index} {...a} />
          <SkillDamageOutput name="데미지" skillSpec={a} withCrit={false} />
          <SkillDamageOutput name="크리티컬 데미지" skillSpec={a} withCrit={true} />
        </div>
      ))}
      </div>
    </div>
    
  )
}
interface SkillOutputOneProps {
  name: string
  skillSpec: SkillSpec
  withCrit: boolean
}
function SkillDamageOutput({ name, skillSpec, withCrit }: SkillOutputOneProps) {

  const attrs = useAppSelector(selectMe)
  const atkFix = useAppSelector(state => state.Profile.atk_fixed)
  const [eltype, el, eldmg] = useAppSelector(selectMyFinalEltype)

  const v = getDamage(attrs, atkFix, el, eldmg, skillSpec)
  const d = withCrit ? criticize(v, attrs["cdmg_inc"]) : v

  return (
    <VerboseResult className={"SkillDamageOutputOne Vertical " + skillSpec.atype} name={name} value={beautyNumber(d)} />
  )
}
