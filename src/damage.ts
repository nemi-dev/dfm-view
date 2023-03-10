export function calcStat(스탯: number, 스탯_퍼센트_증가: number = 0) {
  return 스탯 * (1 + 스탯_퍼센트_증가 / 100);
}

function statCoef(스탯: number, 스탯_퍼센트_증가: number = 0) {
  return (calcStat(스탯, 스탯_퍼센트_증가) / 250 + 1)
}

export function calcAtk(공격력: number, 공격력_증가: number, 스탯: number, 스탯_퍼센트_증가: number = 0) {
  return statCoef(스탯, 스탯_퍼센트_증가) * (공격력 * (1 + 공격력_증가 / 100));
}

export function calcAtkFixed(독립공격력: number, 스탯: number, 스탯_퍼센트_증가: number = 0) {
  return statCoef(스탯, 스탯_퍼센트_증가) * 독립공격력 / 100
}

export function getDefRate(내_레벨 : number, 상대_방어 : number) {
  return 상대_방어 / (200 * 내_레벨 + 상대_방어)
}

export function calcDamageNoDef(
  스탯: number, 스탯_퍼센트_증가: number,
  스킬_계수: number, 스킬_고정값: number,
  공격력: number, 공격력_증가: number, 독립공격력: number,
  데미지_증가: number,
  추가_데미지: number,
  속성강화: number, 속성_추가_데미지: number) {
  return  (
    calcAtk(공격력, 공격력_증가, 스탯, 스탯_퍼센트_증가) * 스킬_계수 / 100
      + calcAtkFixed(독립공격력, 스탯, 스탯_퍼센트_증가) * 스킬_고정값 
    )
    * (1 + 데미지_증가 / 100)
    * (1.05 + 0.0045 * 속성강화)
    * (1 + 추가_데미지 / 100
      + 속성_추가_데미지 / 100 * (1.05 + 0.0045 * 속성강화))
}

export function calcDamage(
  스탯: number, 스탯_퍼센트_증가: number,
  스킬_계수: number, 스킬_고정값: number,
  공격력: number, 공격력_증가: number, 독립공격력: number,
  데미지_증가: number,
  추가_데미지: number,
  속성강화: number, 속성_추가_데미지: number,
  방어율: number) {
  return calcDamageNoDef(스탯, 스탯_퍼센트_증가, 스킬_계수, 스킬_고정값, 공격력, 공격력_증가, 독립공격력, 데미지_증가, 추가_데미지, 속성강화, 속성_추가_데미지)
    * (1 - 방어율);
}

export function getSkillInc(스킬_공격력_증가_장비 : number[], 스킬_공격력_증가_패시브 : number[] = []) {
  let skill_inc_equips = 스킬_공격력_증가_장비.map(val => (val / 100 + 1)).reduce((p, c) => p * c, 1);
  let skill_inc_passives = 스킬_공격력_증가_패시브.map(val => (val / 100)).reduce((p, c) => p + c, 0);
  return skill_inc_equips + skill_inc_passives
}

export function criticize(val: number, cdmg_inc: number) {
  return val * (1.5 + cdmg_inc / 100)
}

export function criticalChance(crit: number, crit_pct: number) {
  return (3 + crit_pct) / 100 + crit / 2368
}


function getPhysicalDamage(attrs: BaseAttrs, atkFix: number, el: number, eldmg:number, skillValue: number, skillFixed: number) {
  return calcDamageNoDef(attrs["strn"], attrs["str_inc"], skillValue, skillFixed, attrs["atk_ph"], attrs["atk_ph_inc"], atkFix, attrs["dmg_inc"], attrs["dmg_add"], el, eldmg)
}

function getMagicalDamage(attrs: BaseAttrs, atkFix: number, el: number, eldmg:number, skillValue: number, skillFixed: number) {
  return calcDamageNoDef(attrs["intl"], attrs["int_inc"], skillValue, skillFixed, attrs["atk_mg"], attrs["atk_mg_inc"], atkFix, attrs["dmg_inc"], attrs["dmg_add"], el, eldmg)
}

/** @todo 위에꺼 전부 `MyAttrKeys` 써서 정리할것 */
export function getDamage(atype: "Physc" | "Magic", attrs: BaseAttrs, atkFix: number, el: number, eldmg: number, { value, fixed, isSkill }: SkillOneAttackSpec) {
  let a = (atype === "Physc")?
    getPhysicalDamage(attrs, atkFix, el, eldmg, value, fixed)
  : getMagicalDamage(attrs, atkFix, el, eldmg, value, fixed)
  if (isSkill) a *= 1 + (attrs["sk_inc"] + attrs["sk_inc_sum"]) / 100
  return a
}



