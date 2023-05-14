import { AtypeAttrKey, Elemental } from "./constants";
import { add } from "./utils";

/** "스탯 증가"가 적용된 스탯 */
export function StatOut(스탯: number = 0, 스탯_퍼센트_증가: number = 0) {
  return 스탯 * (1 + 스탯_퍼센트_증가 / 100);
}

/** 공격력 계산 시, 같이 곱해지는 값 */
function StatFt(스탯: number, 스탯_퍼센트_증가: number = 0) {
  return (StatOut(스탯, 스탯_퍼센트_증가) / 250 + 1)
}

/** "스탯증가" 및 "공격력증가"가 적용된 공격력 */
export function AtkOut(공격력: number, 공격력_증가: number, 스탯: number, 스탯_퍼센트_증가: number = 0) {
  return StatFt(스탯, 스탯_퍼센트_증가) * (공격력 * (1 + 공격력_증가 / 100));
}

/** "스탯증가"가 적용된 독립공격력 */
export function AtkFixedOut(독립공격력: number, 스탯: number, 스탯_퍼센트_증가: number = 0) {
  return StatFt(스탯, 스탯_퍼센트_증가) * 독립공격력 / 100
}

/** 데미지 계산 시 곱해지는 속성강화 계수 */
function ElFact(속성강화: number) {
  return (1.05 + 0.0045 * 속성강화)
}

/** (어느 한 속성에 대해) 속성 추가 데미지 계수 */
export function EldmgFt(속성강화: number = 0, 속성_추가데미지: number = 0) {
  return 속성_추가데미지 / 100 * ElFact(속성강화)
}

/** 방깎적용된 적 방어력을 계산한다. */
export function getRealdef(적_방어력: number, targetDef: number, defBreak: number) {
  return (적_방어력 * (1 - defBreak / 100)) + targetDef
}

/** 방어율 (실제 상대가 받을 데미지는 (내 데미지) * (1 - 방어율)이 된다.)  */
export function defRate(내_레벨 : number, 상대_방어 : number) {
  return 상대_방어 / (200 * 내_레벨 + 상대_방어)
}

/** 스킬 및 크리티컬 여부에 상관없이 내 공격력 또는 내 독립공격력에 곱해질 수치  
 * (데미지증가, 속성데미지, 추가데미지, 속성추가데미지) */
function incFt(
  데미지_증가: number,
  추가_데미지: number,
  내_속성강화: number, 
  [화속성강화, 수속성강화, 명속성강화, 암속성강화]: number[],
  [화속성추가, 수속성추가, 명속성추가, 암속성추가]: number[],
) {
  return (
    (1 + 데미지_증가 / 100)
    * ElFact(내_속성강화)
    * (
      1
        + 추가_데미지 / 100
        + EldmgFt(화속성강화, 화속성추가)
        + EldmgFt(수속성강화, 수속성추가)
        + EldmgFt(명속성강화, 명속성추가)
        + EldmgFt(암속성강화, 암속성추가)
      )
  )
}

/** 스탯, 스탯증가, 공격력, 공격력증가, 데미지증가, 추가데미지, 속성강화, 속성추뎀이 적용된 데미지  
 * (방어력, 크리티컬, 스킬증가가 빠짐) */
export function dmg(
  스킬_계수: number, 스킬_고정값: number,
  스탯: number, 스탯_퍼센트_증가: number,
  공격력: number, 공격력_증가: number, 독립공격력: number,
  데미지_증가: number,
  추가_데미지: number,
  내_속성강화: number, 
  속성강화들: number[],
  속성추가데미지들: number[],
  ) {
  return  (
    AtkOut(공격력, 공격력_증가, 스탯, 스탯_퍼센트_증가) * 스킬_계수 / 100
      + AtkFixedOut(독립공격력, 스탯, 스탯_퍼센트_증가) * 스킬_고정값 
    )
    * incFt(데미지_증가, 추가_데미지, 내_속성강화, 속성강화들, 속성추가데미지들)
}

/**크리티컬 + 스킬공격력 증가 + 적 방어력을 제외한 내 퍼센트 물리/마법 데미지 */
export function plainDmg(
  스탯: number, 스탯_퍼센트_증가: number,
  공격력: number, 공격력_증가: number,
  데미지_증가: number,
  추가_데미지: number,
  내_속성강화: number, 
  속성강화들: number[],
  속성추가데미지들: number[],
) {
  return AtkOut(공격력, 공격력_증가, 스탯, 스탯_퍼센트_증가) * incFt(데미지_증가, 추가_데미지, 내_속성강화, 속성강화들, 속성추가데미지들)
}

/** 크리티컬 + 스킬공격력 증가 + 적 방어력을 제외한 내 퍼센트 독립공격력 데미지 (고뎀) */
export function plainFixedDmg(
  스탯: number, 스탯_퍼센트_증가: number, 독립공격력: number,
  데미지_증가: number,
  추가_데미지: number,
  내_속성강화: number, 
  속성강화들: number[],
  속성추가데미지들: number[],
) {
  return AtkFixedOut(독립공격력, 스탯, 스탯_퍼센트_증가) * incFt(데미지_증가, 추가_데미지, 내_속성강화, 속성강화들, 속성추가데미지들)
}

/** 스킬 공격력 증가의 "퍼센트로 된 순수 증가치"만을 계산한다. */
export function getSkillInc(스킬공격력_증가_곱 : number[], 스킬공격력_증가_합 : number[] = []) {
  let skill_inc_sum = 스킬공격력_증가_곱.map(val => (val / 100 + 1)).reduce((p, c) => p * c, 1);
  let skill_inc_passives = 스킬공격력_증가_합.map(val => (val / 100)).reduce((p, c) => p + c, 0);
  return skill_inc_sum + skill_inc_passives
}

/** 크리티컬 계수 (크리티컬 적용 시 데미지에 곱해질 값) */
export function critFt(cdmg_inc: number = 0, catk_inc: number = 0) {
  return (1.5 * (1 + catk_inc / 100) + cdmg_inc / 100)
}

/** 크리티컬 확률을 구한다. */
export function critChance(crit: number = 0, crit_pct: number = 0) {
  return (3 + crit_pct) / 100 + crit / 2368
}

/** 독립공격력을 제외한 내 예상 데미지 (옵션버전) */
export function getPlainDamage(atype: Atype, eltypes: Eltype[] | null, attrs: BaseAttrs) {
  const el = (eltypes?.length > 0)? (attrs[Elemental[eltypes[0]].el] ?? 0) : 0
  const { Stat, StatInc, Atk, AtkInc } = AtypeAttrKey[atype]
  const {
    [Stat]: stat = 0, [StatInc]: statInc = 0,
    [Atk]: atk = 0, [AtkInc]: atkInc = 0,
    dmg_inc = 0, dmg_add = 0,
    el_fire = 0, eldmg_fire = 0,
    el_ice = 0,  eldmg_ice = 0,
    el_lght = 0, eldmg_lght = 0,
    el_dark = 0, eldmg_dark = 0
  } = attrs
  return plainDmg(
    stat,
    statInc,
    atk,
    atkInc,
    dmg_inc,
    dmg_add,
    el,
    [el_fire, el_ice, el_lght, el_dark],
    [eldmg_fire, eldmg_ice, eldmg_lght, eldmg_dark]
  )
}

/** 내가 엘레멘탈마스터/마도학자일 때, 강제로 4속성의 평균을 적용한 예상 마법 데미지 */
export function getElementalDamage(attrs: BaseAttrs) {
  const {
    intl = 0, int_inc = 0, atk_mg = 0, atk_mg_inc = 0,
    dmg_inc = 0, dmg_add = 0,
    el_fire = 0, eldmg_fire = 0,
    el_ice = 0,  eldmg_ice = 0,
    el_lght = 0, eldmg_lght = 0,
    el_dark = 0, eldmg_dark = 0
  } = attrs
  const el = (el_fire + el_ice + el_lght + el_dark) / 4
  return plainDmg(
    intl,
    int_inc,
    atk_mg,
    atk_mg_inc,
    dmg_inc,
    dmg_add,
    el,
    [el_fire, el_ice, el_lght, el_dark],
    [eldmg_fire, eldmg_ice, eldmg_lght, eldmg_dark]
  )
}

/** (옵션버전) 스탯 + 스탯증가 + 공격력 + 공격력증가 + 데미지증가 + 추가데미지 + 속성강화 + 속성추뎀 + 평타 또는 스킬 계수 + 스킬공격력 증가가 적용된 데미지  
 * (적 방어력, 크리티컬 빠짐. 하지만 적 속성저항은 입력값에 따라 달려있다.) */
export function getDamage(
  atype: Atype,
  el: number,
  attrs: BaseAttrs,
  atkFix: number,
  { value, fixed, isSkill = false, maxHit = 1 }: CustomSkillOneAttackSpec) {
  if (Number.isNaN(el) || (el == null)) el = 0
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
  a *= maxHit
  return a
}



