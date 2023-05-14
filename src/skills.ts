import _skills from '../data/skills.json'
import _selfSkills from '../data/selfskills.json'

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

/** 변동 가능한 선형값에 레벨을 지정하여 실제값을 얻는다. */
export function applyLevel(s: SkillValue, level: number) {
  if (typeof s === "number") return s
  return s.base + s.inc * level
}

/** 스킬 공격 하나에 레벨을 지정하여 실제값을 얻는다. */
export function bindSkillAttack(at: UnboundOneAttack, level: number, hit?: number): RealOneAttack {
  const { atName, maxHit = 1, eltype } = at
  const value = applyLevel(at.value, level)
  const fixed = applyLevel(at.fixed ?? at.value, level)
  hit ??= maxHit
  hit = Math.min(maxHit, hit)
  return { atName, value, fixed, hit, eltype }
}

/** 공격스킬로부터 실제 공격들을 만들어낸다. */
export function bindSkill(sk: AttackSkill, level: number) {
  const attacks = sk.attacks
  return attacks.map(at => bindSkillAttack(at, level))
}
