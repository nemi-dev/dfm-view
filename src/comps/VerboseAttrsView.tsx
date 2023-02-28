import { calcDamageNoDef } from '../damage'

function getPhysicalDamage(attrs: Attrs, atkFix: number, el: number, eldmg:number, skillValue: number, skillFixed: number) {
  return calcDamageNoDef(attrs["strn"], attrs["str_inc"], skillValue, skillFixed, attrs["atk_ph"], attrs["atk_ph_inc"], atkFix, attrs["dmg_inc"], attrs["dmg_add"], el, eldmg)
}

function getMagicalDamage(attrs: Attrs, atkFix: number, el: number, eldmg:number, skillValue: number, skillFixed: number) {
  return calcDamageNoDef(attrs["intl"], attrs["int_inc"], skillValue, skillFixed, attrs["atk_mg"], attrs["atk_mg_inc"], atkFix, attrs["dmg_inc"], attrs["dmg_add"], el, eldmg)
}

export function getDamage(atype: "Physc" | "Magic", attrs: Attrs, atkFix: number, el: number, eldmg: number, { value, fixed, useSkillInc }: SkillSpec) {
  let a = (atype === "Physc")?
    getPhysicalDamage(attrs, atkFix, el, eldmg, value, fixed)
  : getMagicalDamage(attrs, atkFix, el, eldmg, value, fixed)
  if (useSkillInc) a *= 1 + (attrs["sk_inc"] + attrs["sk_inc_sum"]) / 100
  return a
}




