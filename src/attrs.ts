import memoizee from "memoizee"
import { percent_inc_mul, add, combineArray } from "./utils"


/** 단 하나의 옵션을 가진 효과를 만든다. */
export const at1 = memoizee((key: keyof BaseAttrs, value: number): BaseAttrs => ({ [key]: value }), { primitive: true })

/** "힘/지능" "물/마공" "물/마크" "모든속성" 등 같이 올라가는 스탯을 만든다. */
export function explode(val: number, is: "stat" | "atk" | "el_all"): BaseAttrs {
  switch(is) {
    case "stat": return { strn: val, intl: val, vit: val, psi: val }
    case "atk": return { atk_ph: val, atk_mg: val }
    case "el_all": return { el_fire: val, el_ice: val, el_lght: val, el_dark: val }
  }
}

type MyAttrKey = {
  "Physc": {
    "Stat": "strn",
    "Atk" : "atk_ph",
    "Crit": "crit_ph",
    "CritCh": "crit_ph_pct",
    "스탯": "힘",
    "타입": "물리"
  },
  "Magic": {
    "Stat": "intl",
    "Atk" : "atk_mg",
    "Crit": "crit_mg",
    "CritCh": "crit_mg_pct",
    "스탯": "지능",
    "타입": "마법"
  }
}

export const MyAttrKey: MyAttrKey = {
  "Physc": {
    "Stat": "strn",
    "Atk" : "atk_ph",
    "Crit": "crit_ph",
    "CritCh": "crit_ph_pct",
    "스탯": "힘",
    "타입": "물리"
  },
  "Magic": {
    "Stat": "intl",
    "Atk" : "atk_mg",
    "Crit": "crit_mg",
    "CritCh": "crit_mg_pct",
    "스탯": "지능",
    "타입": "마법"
  }
}


const reduce_eltype = (p: BaseAttrs["eltype"], n: BaseAttrs["eltype"]) => {
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


function add_object(p: Record<string, number>, b: Record<string, number>) {
  const prev: Record<string, number> = {...p}
  for (const key in b) {
    if (!(key in prev)) prev[key] = b[key]
    else prev[key] = prev[key] + b[key]
  }
  return prev
}

function mul_object(p: Record<string, number>, b: Record<string, number>) {
  const prev: Record<string, number> = {...p}
  for (const key in b) {
    if (!(key in prev)) prev[key] = b[key]
    else prev[key] = percent_inc_mul(prev[key], b[key])
  }
  return prev
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

function a(key: keyof BaseAttrs, name: string, reducer: (a: any, b: any) => any, expression: AttrExpressionType) {
  const _a = { key, name, reducer, expression }
  attrDefs[key] = _a
  reducers[key] = reducer
  return _a
}


const attrDefsArray = [
  a("strn", "힘", add, "Scalar"),
  a("intl", "지능", add, "Scalar"),
  a("str_inc", "힘 증가", add, "Percent"),
  a("int_inc", "지능 증가", add, "Percent"),

  a("atk_ph", "물리 공격력", add, "Scalar"),
  a("atk_mg", "마법 공격력", add, "Scalar"),
  a("atk_ph_inc", "물리 공격력 증가", add, "Percent"),
  a("atk_mg_inc", "마법 공격력 증가", add, "Percent"),

  a("crit_ph", "물리 크리티컬", add, "Scalar"),
  a("crit_mg", "마법 크리티컬", add, "Scalar"),
  a("crit_ph_pct", "물리 크리티컬 확률 증가", add, "Percent"),
  a("crit_mg_pct", "마법 크리티컬 확률 증가", add, "Percent"),

  a("dmg_inc", "데미지 증가", add, "Percent"),
  a("cdmg_inc", "크리티컬 데미지 증가", add, "Percent"),
  a("dmg_add", "추가 데미지", add, "Percent"),

  a("eltype", "공격속성", reduce_eltype, "DearEltype"),

  a("el_fire", "화속성 강화", add, "Scalar"),
  a("el_ice", "수속성 강화", add, "Scalar"),
  a("el_lght", "명속성 강화", add, "Scalar"),
  a("el_dark", "암속성 강화", add, "Scalar"),

  a("eldmg_fire", "화속성 추가 데미지", add, "Percent"),
  a("eldmg_ice", "수속성 추가 데미지", add, "Percent"),
  a("eldmg_lght", "명속성 추가 데미지", add, "Percent"),
  a("eldmg_dark", "암속성 추가 데미지", add, "Percent"),

  a("sk_inc", "스킬 공격력 증가", percent_inc_mul, "Percent"),
  a("sk_inc_sum", "스킬 공격력 증가(단리합)", add, "Percent"),
  a("sk_val", "스킬 공격력 증가", mul_object, "ComplexPercent"),
  a("sk_lv", "스킬 레벨 증가", add_object, "ComplexScalar"),
  a("sk_cool", "스킬 쿨타임 감소", add_object, "ComplexPercent"),

  a("target_def", "적 방어력", add, "Scalar"),
  a("target_res", "적 모든속성 저항", add, "Scalar"),

  a("speed_atk", "공격속도", add, "Percent"),
  a("speed_cast", "캐스팅속도", add, "Percent"),
  a("speed_move", "이동속도", add, "Percent"),

  a("Accu", "적중", add, "Scalar"),
  a("AccuPct", "적중 확률 증가", add, "Percent"),

  a("hpmax", "HP MAX", add, "Scalar"),
  a("mpmax", "MP MAX", add, "Scalar"),
  a("vit", "체력", add, "Scalar"),
  a("psi", "정신력", add, "Scalar"),

  a("def_ph", "물리 방어력", add, "Scalar"),
  a("def_mg", "마법 방어력", add, "Scalar"),
  a("def_ph_pct", "물리 방어력 증가", add, "Percent"),
  a("def_mg_pct", "마법 방어력 증가", add, "Percent"),
  
  a("res_fire", "화속성 저항", add, "Scalar"),
  a("res_ice",  "수속성 저항", add, "Scalar"),
  a("res_lght", "명속성 저항", add, "Scalar"),
  a("res_dark", "암속성 저항", add, "Scalar"),

  a("misc", "기타 관심없는 효과", combineArray, "Misc")
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


/** TODO: 아니 뭔 함수가 이따구냐 */
export function collectSpecial(...attrsList: Attrs[]) {
  const branches: Record<string, WhenCombinedAttrs[]> = {}
  const exclusives: Record<string, ExclusiveGroup[]> = {}
  const gives: Record<string, WhenCombinedAttrs> = {}

  for (const attrs of attrsList) {
    if (attrs.branch) branches[attrs.name] = attrs.branch
    if (attrs.exclusive) exclusives[attrs.name] = attrs.exclusive
    if (attrs.gives) gives[attrs.name] = attrs.gives
  }
  return { branches, exclusives, gives }
}


type El_val = "el_fire" | "el_ice" | "el_lght" | "el_dark"

export const elMap: Record<string, Eltype> = {
  "el_fire": "화",
  "el_ice" : "수",
  "el_lght": "명",
  "el_dark": "암"
}

export const elMap2 : Record<string, El_val> = {
  "화": "el_fire",
  "수": "el_ice" ,
  "명": "el_lght",
  "암": "el_dark"
}

type El = Pick<BaseAttrs, El_val>;

export function whatElType(el: El, activeTypes: BaseAttrs["eltype"]): Eltype {
  if (activeTypes == null) return null
  if (typeof activeTypes === "string") return activeTypes
  
  let maxValue = 0, maxEl: El_val = null
  for (const t of activeTypes) {
    const key = elMap2[t]
    const val = el[key];
    if (val > maxValue) [maxValue, maxEl] = [val, key]
  }
  
  return elMap[maxEl]
  
}
