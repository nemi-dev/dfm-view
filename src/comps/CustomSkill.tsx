import styled from 'styled-components'

import { AtypeAttrKey, Elemental } from '../constants'
import { critFt, dmg } from '../damage'
import { useAppDispatch, useAppSelector } from '../feats/hooks'
import {
    selectEnemyDefRate, selectEnemyElRes, selectMyAttr, selectMyCritChance,
} from '../feats/selector/selectors'
import { selectClassAtype } from '../feats/selector/selfSelectors'
import {
    SetSkillFixValue, SetSkillInputName, SetSkillMaxHit, SetSkillUsesSkillInc, SetSkillValue
} from '../feats/slices/customSkillSlice'
import { add } from '../utils'
import { LabeledNumberInput, LabeledSwitch } from './widgets/Forms'
import { Num } from './widgets/NumberView'
import { whatElType } from '../attrs'

/** (옵션버전) 스탯 + 스탯증가 + 공격력 + 공격력증가 + 데미지증가 + 추가데미지 + 속성강화 + 적 속성저항 + 속성추뎀 + 평타/스킬계수 + 스킬공격력 증가가 적용된 데미지  
 * (크리티컬 빼고 모든게 적용됨)
 * @param targetElRes **속성저항 감소가 적용된** 적의 모든 속성저항
 * @param defRate **방어력감소가 적용된** 적의 방어율
 * */
function getCustomSkillDamage(
  atype: Atype,
  attrs: BaseAttrs,
  atkFix: number,
  { value, fixed = value, isSkill = false, maxHit = 1 }: CustomSkillOneAttackSpec,
  targetElRes: number,
  defRate: number
) {
  const eltype = whatElType(attrs)
  const myEl = eltype.length > 0? (attrs[Elemental[eltype[0]].el] ?? 0) : 0
  const el = Math.max(myEl - targetElRes, 0)

  const { Stat, StatInc, Atk, AtkInc } = AtypeAttrKey[atype]
  const {
    [Stat]: stat = 0, [StatInc]: statInc = 0,
    [Atk]: atk = 0, [AtkInc]: atkInc = 0,
    el_fire = 0, eldmg_fire = 0,
    el_ice = 0,  eldmg_ice = 0,
    el_lght = 0, eldmg_lght = 0,
    el_dark = 0, eldmg_dark = 0
  } = attrs
  let a = dmg(
    value,
    fixed,
    stat,
    statInc,
    atk,
    atkInc,
    atkFix,
    attrs["dmg_inc"] ?? 0,
    attrs["dmg_add"] ?? 0,
    el,
    [el_fire, el_ice, el_lght, el_dark],
    [eldmg_fire, eldmg_ice, eldmg_lght, eldmg_dark]
  )
  if (isSkill) {
    a *= 1 + add(attrs["sk_inc"], attrs["sk_inc_sum"]) / 100
  }
  a *= maxHit * (1 - defRate)
  return a
}


const SkillOneAttackHeader = styled.div`
  grid-column: 1 / 3;
  display: flex;
  flex-direction: row;

  input[type=text] {
    flex-grow: 2;
  }
`

const SkillOneAttackLayout = styled.div`
  
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: auto;
  justify-items: stretch;
  gap: 2px;

`

interface SkillInputOneProps extends CustomSkillOneAttackSpec {
  index: number
  fixed?: number
}

function SkillOneAttack({ index, value, fixed = value, isSkill = false, maxHit = 1, name }: SkillInputOneProps) {
  const dispatch = useAppDispatch()
  return (
    <SkillOneAttackLayout className="SkillOneAttack">
      <SkillOneAttackHeader>
        <input className="SkillName" type="text" value={name} onChange={ev => dispatch(SetSkillInputName([index, ev.target.value]))} />
        <LabeledSwitch className="SkillUsesInc" label="스킬" checked={isSkill} onChange={b => dispatch(SetSkillUsesSkillInc([index, b]))} />
      </SkillOneAttackHeader>
      <LabeledNumberInput label="계수(%)" value={value} onChange={v => dispatch(SetSkillValue([index, v]))} />
      <LabeledNumberInput label="고정값" value={fixed} onChange={v => dispatch(SetSkillFixValue([index, v]))} />
      <LabeledNumberInput label="타격 횟수" value={maxHit} onChange={v => dispatch(SetSkillMaxHit([index, v]))} />
    </SkillOneAttackLayout>
  )
}


interface SkillOutputOneProps {
  index: number
  SkillOneAttackSpec: CustomSkillOneAttackSpec
}
function CustomSkillAttackOne({ index, SkillOneAttackSpec }: SkillOutputOneProps) {

  const atype = useAppSelector(selectClassAtype)
  const attrs = useAppSelector(selectMyAttr)
  const atkFix = useAppSelector(state => state.My.Self.atkFixed)
  const chance = useAppSelector(selectMyCritChance)

  const targetElRes = useAppSelector(selectEnemyElRes)
  const defRate = useAppSelector(selectEnemyDefRate)

  const damage = getCustomSkillDamage(
    atype, attrs, atkFix, SkillOneAttackSpec, targetElRes, defRate
  )

  const criticalDamage = damage * critFt(attrs["cdmg_inc"], attrs["catk_inc"])

  const mean = chance * criticalDamage + (1 - chance) * damage

  
  return (
    <div className="SkillTestOne">
      <SkillOneAttack index={index} {...SkillOneAttackSpec} />
      <div className={"Result " + atype}>
        <div className="KeyName">데미지</div>
        <Num className="AttrValue" value={damage} separated />
      </div>
      <div className={"Result " + atype}>
        <div className="KeyName">평균 데미지</div>
        <Num className="AttrValue" value={mean} separated />
      </div>
      <div className={"Result " + atype}>
        <div className="KeyName">크리티컬 데미지</div>
        <Num className="AttrValue" value={criticalDamage} separated />
      </div>
    </div>
  )
}

const CustonSkillStyle = styled.div`
  
  display: flex;
  flex-direction: column;
  gap: 2px;

  .Result {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    .AttrValue {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 999px) {
  .KeyName {
    font-size: 0.7rem;
  }
  .Result .AttrValue {
    font-size: 1rem;
  }
  
}
`

export function CustomSkillScreen() {
  const cases = useAppSelector(state => state.CustomSkill)
  
  return (
    <div>
      <header>
        <h3>스킬계수 직접 입력</h3>
      </header>
      <CustonSkillStyle>
      {cases.map((a, index) => (
        <CustomSkillAttackOne key={index} index={index} SkillOneAttackSpec={a} />
      ))}
      </CustonSkillStyle>
    </div>
    
  )
}
