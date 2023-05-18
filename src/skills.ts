import _skills from '../data/skills.json'
import _selfSkills from '../data/selfskills.json'
import { add, compound } from './utils'

export const skills = _skills as unknown as AttackSkill[]
export const selfSkills = _selfSkills as unknown as SelfSkill[]

/** 스킬명/스킬 ID로 공격스킬을 찾는다. */
export function getSkill(key: number | string) {
  if (typeof key === "string") return skills.find(sk => sk.name == key)
  return skills.find(sk => sk.id == key)
}

/** 스킬명/스킬ID로 패시브/버프 스킬을 찾는다. */
export function getSelfSkill(key: number | string) {
  if (typeof key === "string") return skills.find(sk => sk.name == key)
  return skills.find(sk => sk.id == key)
}

/** 지정된 내 레벨에서 가능한 최대 스킬 레벨을 얻는다. */
export function getMaxSkillLevelAt(sk: AttackSkill, chLevel: number, expert: boolean = true) {
  const divide = sk.level == 50 ? 5 : 2
  if (expert) return Math.max(Math.floor((chLevel - sk.level + 5) / divide) + 1, 0)
  return Math.max(Math.floor((chLevel - sk.level) / divide) + 1, 0)
}

/** 변동 가능한 선형값에 레벨을 지정하여 실제값을 얻는다. */
export function applyLevel(s: SkillValue, level: number) {
  if (typeof s === "number") return s
  return s.base + s.inc * level
}

/** 스킬 공격 하나에 레벨을 지정하여 실제값을 얻는다. */
function bindSkillAttack(
  skillName: string,
  attack: UnboundOneAttack,
  skLv: number,
  chargeup: number,
  variantKey: string | null | undefined,
  attrs: BaseAttrs = {}): RealOneAttack {

  const {
    sk_val = {},
    sk_hit = {}
  } = attrs

  const skKeyLookup = [skillName, `${skillName}[${attack.atName}]`]
  if (variantKey) skKeyLookup.push(
    `${skillName}(${variantKey})`,
    `${skillName}(${variantKey})[${attack.atName}]`
  )
  const skval_bonus = skKeyLookup.map(k => sk_val?.[k] ?? 0).reduce(compound, 0)
  const skval1 = 1 + skval_bonus / 100

  const skhit_bonus = skKeyLookup.map(k => sk_hit?.[k] ?? 0).reduce(add, 0)

  const { atName, maxHit = 1, eltype } = attack
  const value = applyLevel(attack.value, skLv) * chargeup * skval1
  const fixed = applyLevel(attack.fixed ?? attack.value, skLv) * chargeup * skval1
  const hit = maxHit + skhit_bonus
  return { atName, value, fixed, hit, eltype }
}

interface BindSkillOption {
  chargeup?: number
  variant?: string
}

/** 공격스킬로부터 실제 공격들을 만들어낸다. */
export function bindSkill(
  sk: AttackSkill,
  baseSkLv: number,
  attrs: BaseAttrs = {},
  { chargeup = 1, variant }: BindSkillOption = {}
  ) {
  const attacks = variant?
    sk.variant?.find(v => v.vaName == variant)?.attacks
    : sk.attacks
  const { sk_lv = {} } = attrs
  const sklvBonus = (sk_lv[sk.name] ?? 0)

  return attacks?.map(at => bindSkillAttack(sk.name, at, baseSkLv + sklvBonus, chargeup, variant, attrs)) ?? []
}
