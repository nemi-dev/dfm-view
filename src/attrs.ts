import memoizee from "memoizee"
import { percent_inc_mul, add, combineArray, add_object, mul_object } from "./utils"

export const AtypeAttrKey = {
  "Physc": {
    "Stat": "strn",
    "StatInc": "str_inc",
    "Atk" : "atk_ph",
    "AtkInc": "atk_ph_inc",
    "Crit": "crit_ph",
    "CritCh": "crit_ph_pct",
    "스탯": "힘",
    "타입": "물리",
  },
  "Magic": {
    "Stat": "intl",
    "StatInc": "int_inc",
    "Atk" : "atk_mg",
    "AtkInc": "atk_mg_inc",
    "Crit": "crit_mg",
    "CritCh": "crit_mg_pct",
    "스탯": "지능",
    "타입": "마법"
  }
} as const

export const Elemental = {
  "Fire" : {
    "el": "el_fire",
    "eldmg": "eldmg_fire",
    "속성": "화"
  },
  "Ice": {
    "el": "el_ice",
    "eldmg": "eldmg_ice",
    "속성": "수"
  },
  "Light": {
    "el": "el_lght",
    "eldmg": "eldmg_lght",
    "속성": "명"
  },
  "Dark": {
    "el": "el_dark",
    "eldmg": "eldmg_dark",
    "속성": "암"
  }
} as const


/** 단 하나의 옵션을 가진 효과를 만든다. */
export const at1 = memoizee((key: keyof BaseAttrs, value: number): BaseAttrs => ({ [key]: value }), { primitive: true })

/** "힘/지능" "물/마공" "물/마크" "모든속성" 등 같이 올라가는 스탯을 만든다. */
export const atx = memoizee(
function atx(is: "Stat" | "Atk" | "Crit" | "El", val: number): BaseAttrs {
  switch(is) {
    case "Stat": return { strn: val, intl: val, vit: val, psi: val }
    case "Atk": return { atk_ph: val, atk_mg: val }
    case "Crit": return { crit_ph: val, crit_mg: val }
    case "El": return { el_fire: val, el_ice: val, el_lght: val, el_dark: val }
  }
}, { primitive: true} )

/** 중첩될 때 합연산되는 어떤 효과를 k배한다. "스킬 공격력 증가"는 사라지지만, 아직 스증이 "최대 x회 중첩"되는 아이템은 없다.  */
export function scalarProduct(attr: BaseAttrs, k: number) {
  const copy: BaseAttrs = { }
  for (const key in attr) {
    if (attrDefs[key as keyof BaseAttrs]?.reducer === add)
    copy[key] = attr[key] * k
  }
  return copy
}

const reduce_eltype = (p: Eltype | Eltype[], n: Eltype | Eltype[]) => {
  if (p == null) return n
  if (typeof p === "string") {
    if (typeof n === "string") {
      if (p === n) return p
      else return [p, n]
    } else {
      if (n.includes(p)) return n
      else return [...n, p]
    }
  } else {
    if (typeof n === "string") {
      if (p.includes(n)) return p
      else return [...p, n]
    } else {
      const v = [...p]
      for (const i of n) {
        if (!p.includes(i)) v.push(i)
      }
      return v
    }
  }
}


const reducers: Partial<Record<keyof BaseAttrs, (p, n)=>any>> = {}


export type AttrExpressionType = 
"Scalar" | "Percent" | "ComplexScalar" | "ComplexPercent" | "DearEltype" | "Misc"

interface AttrDef {
  key: keyof BaseAttrs
  name: string,
  reducer: (a: any, b: any) => any
  expression: AttrExpressionType
}

export const attrDefs : { [k in keyof BaseAttrs]: AttrDef } & { array?: AttrDef[] } = {}

function defineAttr(key: keyof BaseAttrs, name: string, reducer: (a: any, b: any) => any, expression: AttrExpressionType) {
  const _a = { key, name, reducer, expression }
  attrDefs[key] = _a
  reducers[key] = reducer
  return _a
}


const attrDefsArray = [
  defineAttr("strn", "힘", add, "Scalar"),
  defineAttr("intl", "지능", add, "Scalar"),
  defineAttr("str_inc", "힘 증가", add, "Percent"),
  defineAttr("int_inc", "지능 증가", add, "Percent"),

  defineAttr("atk_ph", "물리 공격력", add, "Scalar"),
  defineAttr("atk_mg", "마법 공격력", add, "Scalar"),
  defineAttr("atk_ph_inc", "물리 공격력 증가", add, "Percent"),
  defineAttr("atk_mg_inc", "마법 공격력 증가", add, "Percent"),

  defineAttr("crit_ph", "물리 크리티컬", add, "Scalar"),
  defineAttr("crit_mg", "마법 크리티컬", add, "Scalar"),
  defineAttr("crit_ph_pct", "물리 크리티컬 확률 증가", add, "Percent"),
  defineAttr("crit_mg_pct", "마법 크리티컬 확률 증가", add, "Percent"),

  defineAttr("dmg_inc", "데미지 증가", add, "Percent"),
  defineAttr("cdmg_inc", "크리티컬 데미지 증가", add, "Percent"),
  defineAttr("dmg_add", "추가 데미지", add, "Percent"),

  defineAttr("eltype", "공격속성", reduce_eltype, "DearEltype"),

  defineAttr("el_fire", "화속성 강화", add, "Scalar"),
  defineAttr("el_ice", "수속성 강화", add, "Scalar"),
  defineAttr("el_lght", "명속성 강화", add, "Scalar"),
  defineAttr("el_dark", "암속성 강화", add, "Scalar"),

  defineAttr("eldmg_fire", "화속성 추가 데미지", add, "Percent"),
  defineAttr("eldmg_ice", "수속성 추가 데미지", add, "Percent"),
  defineAttr("eldmg_lght", "명속성 추가 데미지", add, "Percent"),
  defineAttr("eldmg_dark", "암속성 추가 데미지", add, "Percent"),

  defineAttr("sk_inc", "스킬 공격력 증가", percent_inc_mul, "Percent"),
  defineAttr("sk_inc_sum", "스킬 공격력 증가(단리합)", add, "Percent"),
  defineAttr("sk_val", "스킬 공격력 증가", mul_object, "ComplexPercent"),
  defineAttr("sk_lv", "스킬 레벨 증가", add_object, "ComplexScalar"),
  defineAttr("sk_cool", "스킬 쿨타임 감소", add_object, "ComplexPercent"),

  defineAttr("target_def", "적 방어력", add, "Scalar"),
  defineAttr("target_res", "적 모든속성 저항", add, "Scalar"),

  defineAttr("speed_atk", "공격속도", add, "Percent"),
  defineAttr("speed_cast", "캐스팅속도", add, "Percent"),
  defineAttr("speed_move", "이동속도", add, "Percent"),

  defineAttr("Accu", "적중", add, "Scalar"),
  defineAttr("AccuPct", "적중 확률 증가", add, "Percent"),

  defineAttr("hpmax", "HP MAX", add, "Scalar"),
  defineAttr("mpmax", "MP MAX", add, "Scalar"),
  defineAttr("vit", "체력", add, "Scalar"),
  defineAttr("psi", "정신력", add, "Scalar"),

  defineAttr("def_ph", "물리 방어력", add, "Scalar"),
  defineAttr("def_mg", "마법 방어력", add, "Scalar"),
  defineAttr("def_ph_pct", "물리 방어력 증가", add, "Percent"),
  defineAttr("def_mg_pct", "마법 방어력 증가", add, "Percent"),
  
  defineAttr("res_fire", "화속성 저항", add, "Scalar"),
  defineAttr("res_ice",  "수속성 저항", add, "Scalar"),
  defineAttr("res_lght", "명속성 저항", add, "Scalar"),
  defineAttr("res_dark", "암속성 저항", add, "Scalar"),

  defineAttr("misc", "기타 관심없는 효과", combineArray, "Misc")
]

attrDefs.array = attrDefsArray

export function combine(...attrsList: BaseAttrs[]) {
  const prev: BaseAttrs = {}

  for (const attrs of attrsList) {
    if (attrs == null) continue
    for (const key in attrs) {
      
      if (!(key in reducers)) continue
      if (!(key in prev)) {
        prev[key] = attrs[key]
      } else {
        prev[key] = reducers[key](prev[key], attrs[key])
      }
    }
  }
  return prev
}

type El_val = "el_fire" | "el_ice" | "el_lght" | "el_dark"

type El = Pick<BaseAttrs, El_val>

export function whatElType(el: El, activeTypes: Eltype | Eltype[]): Eltype[] {
  if (activeTypes == null) return []
  if (typeof activeTypes === "string") return [activeTypes]
  const maxValue = Math.max(...activeTypes.map(eltype => el[Elemental[eltype].el]))
  return activeTypes.filter(eltype => el[Elemental[eltype].el] == maxValue)
}
