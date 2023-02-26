import { useAppSelector } from '../feats/hooks'
import { selectMe } from '../selectors'
import { attrDefsMap, elMap, elMap2, whatElType } from '../attrs'
import { beautyNumber, percentee, signed } from '../utils'
import { calcAtk, calcDamageNoDef, calcStat, criticalChance, criticize } from '../damage'
import { createSelector } from '@reduxjs/toolkit'

function getPhysicalDamage(attrs: Attrs, atkFix: number, el: number, eldmg:number, skillValue: number, skillFixed: number) {
  return calcDamageNoDef(attrs["strn"], attrs["str_inc"], skillValue, skillFixed, attrs["atk_ph"], attrs["atk_ph_inc"], atkFix, attrs["dmg_inc"], attrs["dmg_add"], el, eldmg)
}

function getMagicalDamage(attrs: Attrs, atkFix: number, el: number, eldmg:number, skillValue: number, skillFixed: number) {
  return calcDamageNoDef(attrs["intl"], attrs["int_inc"], skillValue, skillFixed, attrs["atk_mg"], attrs["atk_mg_inc"], atkFix, attrs["dmg_inc"], attrs["dmg_add"], el, eldmg)
}

export function getDamage(attrs: Attrs, atkFix: number, el: number, eldmg: number, { value, fixed, atype, useSkillInc }: SkillSpec) {
  let a = (atype === "Physc")?
    getPhysicalDamage(attrs, atkFix, el, eldmg, value, fixed)
  : getMagicalDamage(attrs, atkFix, el, eldmg, value, fixed)
  if (useSkillInc) a *= 1 + (attrs["sk_inc"] + attrs["sk_inc_sum"]) / 100
  return a
}


export const selectMyFinalEltype = createSelector(
  selectMe,
  attrs => {
    const eltype = whatElType(attrs, attrs.eltype)
    if (!eltype) return [null, 0, 0]
    const el_attrKey = elMap2[eltype]
    const eldmg_attrKey = el_attrKey.replace("el_", "eldmg_")
    const el = attrs[el_attrKey]
    const eldmg = attrs[eldmg_attrKey] ?? 0
    return [eltype, el, eldmg]
  }
)

interface VerboseOneAttrViewProps {
  attrKey: keyof BaseAttrs
  className?: string
}

function VerboseOneAttrView({ attrKey, className = "" }: VerboseOneAttrViewProps) {
  const name = attrDefsMap[attrKey].name
  const suffix = attrDefsMap[attrKey].expression === "Percent" ? "%" : ""
  const attrs = useAppSelector(selectMe)
  const value = attrs[attrKey] as number
  return (
    <div className={"AttrOne " + attrKey}>
      <div className="AttrName">{name}</div>
      <div className={"AttrValue " + className}>{signed(value)}{suffix}</div>
    </div>
  )
}

interface VerboseResultProps {
  name: string
  value: number | string
  className?: string
}

export function VerboseResult({ name, value = 0, className = ""}: VerboseResultProps) {
  return (
  <span className={"Result " + className}>
    <div className="AttrName">{name}</div>
    <div className={"AttrValue " + className}>
      {value}
    </div>
  </span>
  )
}


export function VerboseAttrsView() {
  const attrs = useAppSelector(selectMe)
  const atkFix = useAppSelector(state => state.Profile.atk_fixed)
  const [eltype, el, eldmg] = useAppSelector(selectMyFinalEltype)

  const predictPhysc = getPhysicalDamage(attrs, atkFix, el, eldmg, 100, 0)
  const predictMagic = getMagicalDamage(attrs, atkFix, el, eldmg, 100, 0)
  
  const prePhyscCrit = criticize(predictPhysc, attrs["cdmg_inc"])
  const preMagicCrit = criticize(predictMagic, attrs["cdmg_inc"])

  const critChancePhysc = criticalChance(attrs["crit_ph"], attrs["crit_ph_pct"])
  const critChanceMagic = criticalChance(attrs["crit_mg"], attrs["crit_mg_pct"])

  const PhyscMean = critChancePhysc * prePhyscCrit + (1 - critChancePhysc) * predictPhysc
  const MagicMean = critChanceMagic * preMagicCrit + (1 - critChanceMagic) * predictMagic

  return (
    <div className="VerboseAttrsView">
      <h2>스탯 및 효과</h2>
      <div className="Quadplex">
        <VerboseOneAttrView className="Physc" attrKey="strn" />
        <VerboseOneAttrView className="Physc" attrKey="str_inc" />
        <VerboseOneAttrView className="Magic" attrKey="intl" />
        <VerboseOneAttrView className="Magic" attrKey="int_inc" />
      </div>
      <div className="Duplex">
      <VerboseResult name="힘" className="Physc"
          value={beautyNumber(calcStat(attrs["strn"], attrs["str_inc"]))} 
        />
      <VerboseResult name="지능" className="Magic"
        value={beautyNumber(calcStat(attrs["intl"], attrs["int_inc"]))}
      />
      </div>
      <div className="Quadplex">
        <VerboseOneAttrView className="Physc" attrKey="atk_ph" />
        <VerboseOneAttrView className="Physc" attrKey="atk_ph_inc" />
        <VerboseOneAttrView className="Magic" attrKey="atk_mg" />
        <VerboseOneAttrView className="Magic" attrKey="atk_mg_inc" />
      </div>
      <div className="Duplex">
      <VerboseResult name="물리 공격력" className="Physc"
          value={beautyNumber(calcAtk(attrs["atk_ph"], attrs["atk_ph_inc"], attrs["strn"], attrs["str_inc"]))}
        />
      <VerboseResult name="마법 공격력" className="Magic"
        value={beautyNumber(calcAtk(attrs["atk_mg"], attrs["atk_mg_inc"], attrs["intl"], attrs["int_inc"]))}
      />
      </div>
      <div className="Duplex">
        <VerboseOneAttrView attrKey="dmg_inc" />
        <VerboseOneAttrView attrKey="dmg_add" />
      </div>
      <div className="Quadplex">
        <VerboseOneAttrView attrKey="el_fire" />
        <VerboseOneAttrView attrKey="el_ice" />
        <VerboseOneAttrView attrKey="el_lght" />
        <VerboseOneAttrView attrKey="el_dark" />
        <VerboseOneAttrView attrKey="eldmg_fire" />
        <VerboseOneAttrView attrKey="eldmg_ice" />
        <VerboseOneAttrView attrKey="eldmg_lght" />
        <VerboseOneAttrView attrKey="eldmg_dark" />
      </div>
        {eltype? <VerboseResult name="" value={`${eltype}공격속성`} /> : null}
      <div>
        <div className="Duplex">
        <VerboseResult name="예상 물리 데미지" className="Physc Vertical"
        value={beautyNumber(predictPhysc)} />
        <VerboseResult name="예상 마법 데미지" className="Magic Vertical"
        value={beautyNumber(predictMagic)} />  
        </div>
      </div>
      <VerboseOneAttrView attrKey="cdmg_inc" />
      <div className="Duplex">
        <VerboseResult name="예상 물리 데미지 (크리티컬 적용)" className="Physc Vertical" value={beautyNumber(prePhyscCrit)} />
        <VerboseResult name="예상 마법 데미지 (크리티컬 적용)" className="Magic Vertical" value={beautyNumber(preMagicCrit)} />
      </div>
      <div className="Quadplex">
        <VerboseOneAttrView attrKey="crit_ph" className="Physc" />
        <VerboseOneAttrView attrKey="crit_ph_pct" className="Physc" />
        <VerboseOneAttrView attrKey="crit_mg" className="Magic" />
        <VerboseOneAttrView attrKey="crit_mg_pct" className="Magic" />
      </div>
      <div className="Duplex">
        <VerboseResult name="물리 크리티컬 확률" className="Physc" value={percentee(critChancePhysc)} />
        <VerboseResult name="마법 크리티컬 확률" className="Magic" value={percentee(critChanceMagic)} />
        <VerboseResult name="평균 물리 데미지" className="Physc" value={beautyNumber(PhyscMean)} />
        <VerboseResult name="평균 마법 데미지" className="Magic" value={beautyNumber(MagicMean)} />
        <VerboseOneAttrView attrKey="sk_inc" />
        <VerboseOneAttrView attrKey="sk_inc_sum" />
      </div>
      <VerboseResult name="스킬 공격력 증가 합" value={signed(attrs["sk_inc"] + attrs["sk_inc_sum"]) + "%"} />
    </div>
  )
}
