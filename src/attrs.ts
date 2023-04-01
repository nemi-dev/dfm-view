import memoizee from "memoizee"
import { percent_inc_mul, add, combineArray, add_object, mul_object, anyOf } from "./utils"

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
function atx(is: "StatAll" | "Stat" | "Atk" | "Crit" | "El", val: number): BaseAttrs {
  switch(is) {
    case "StatAll": return { strn: val, intl: val, vit: val, psi: val }
    case "Stat": return { strn: val, intl: val }
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
    // @ts-ignore
    copy[key] = attr[key] * k
  }
  return copy
}

/** 
 * 주어진 조건부 노드의 옵션만을 `k`배한다.  
 * 아이템 옵션에 "최대 x중첩"이 없거나, `k` === 1이면 노드를 그대로 돌려받는다.
  */
export function repeatAttr(node: ConditionalNode, k: number): ConditionalNode {
  if (node?.maxRepeat == null || k === 1) return node
  return { ...node, attrs: scalarProduct(node.attrs, k) }
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


const reducers: Partial<Record<keyof BaseAttrs, (p: any, n: any)=>any>> = {}


export type AttrExpressionType = 
"Flat" | "Percent" | "MapFlat" | "MapPercent" | "DearEltype" | "DualTrigger" | "Misc"

export interface AttrDef {
  key: keyof BaseAttrs
  name: string,
  reducer: (a: any, b: any) => any
  expression: AttrExpressionType
}

export const attrDefs : { [k in keyof BaseAttrs]: AttrDef } & { array: AttrDef[] } = {
  array: []
}

function defineAttr(key: keyof BaseAttrs, name: string, reducer: (a: any, b: any) => any, expression: AttrExpressionType) {
  const _a = { key, name, reducer, expression }
  attrDefs[key] = _a
  reducers[key] = reducer
  return _a
}


const attrDefsArray = [
  defineAttr("strn", "힘", add, "Flat"),
  defineAttr("intl", "지능", add, "Flat"),
  defineAttr("str_inc", "힘 증가", add, "Percent"),
  defineAttr("int_inc", "지능 증가", add, "Percent"),

  defineAttr("atk_ph", "물리 공격력", add, "Flat"),
  defineAttr("atk_mg", "마법 공격력", add, "Flat"),
  defineAttr("atk_ph_inc", "물리 공격력 증가", add, "Percent"),
  defineAttr("atk_mg_inc", "마법 공격력 증가", add, "Percent"),

  defineAttr("crit_ph", "물리 크리티컬", add, "Flat"),
  defineAttr("crit_mg", "마법 크리티컬", add, "Flat"),
  defineAttr("crit_ph_pct", "물리 크리티컬 확률 증가", add, "Percent"),
  defineAttr("crit_mg_pct", "마법 크리티컬 확률 증가", add, "Percent"),

  defineAttr("dmg_inc", "데미지 증가", add, "Percent"),
  defineAttr("cdmg_inc", "크리티컬 데미지 증가", add, "Percent"),
  defineAttr("catk_inc", "크리티컬 공격력 증가", add, "Percent"),
  defineAttr("dmg_add", "추가 데미지", add, "Percent"),

  defineAttr("eltype", "공격속성", reduce_eltype, "DearEltype"),
  defineAttr("el_fire", "화속성 강화", add, "Flat"),
  defineAttr("el_ice", "수속성 강화", add, "Flat"),
  defineAttr("el_lght", "명속성 강화", add, "Flat"),
  defineAttr("el_dark", "암속성 강화", add, "Flat"),
  defineAttr("eldmg_fire", "화속성 추가 데미지", add, "Percent"),
  defineAttr("eldmg_ice", "수속성 추가 데미지", add, "Percent"),
  defineAttr("eldmg_lght", "명속성 추가 데미지", add, "Percent"),
  defineAttr("eldmg_dark", "암속성 추가 데미지", add, "Percent"),
  defineAttr("DualTrigger", "듀얼 트리거", anyOf, "DualTrigger"),

  defineAttr("sk_inc", "스킬 공격력 증가", percent_inc_mul, "Percent"),
  defineAttr("sk_inc_sum", "스킬 공격력 증가(단리합)", add, "Percent"),
  defineAttr("sk_val", "스킬 공격력 증가", mul_object, "MapPercent"),
  defineAttr("skb_add", "버프 수치 증가", add_object, "MapFlat"),
  defineAttr("sk_hit", "타격 횟수 증가", add_object, "MapFlat"),
  defineAttr("sk_lv", "스킬 레벨 증가", add_object, "MapFlat"),
  defineAttr("sk_dur", "스킬 지속시간 증가", add_object, "MapFlat"),
  defineAttr("sk_cool", "스킬 쿨타임 감소", add_object, "MapPercent"),

  defineAttr("target_def", "적 방어력", add, "Flat"),
  defineAttr("target_res", "적 모든속성 저항", add, "Flat"),
  defineAttr("DefBreak", "적 방어력 감소", add, "Percent"),

  defineAttr("speed_atk", "공격속도", add, "Percent"),
  defineAttr("speed_cast", "캐스팅속도", add, "Percent"),
  defineAttr("speed_move", "이동속도", add, "Percent"),

  defineAttr("Accu", "적중", add, "Flat"),
  defineAttr("AccuPct", "적중 확률 증가", add, "Percent"),

  defineAttr("hpmax", "HP MAX", add, "Flat"),
  defineAttr("mpmax", "MP MAX", add, "Flat"),
  defineAttr("vit", "체력", add, "Flat"),
  defineAttr("psi", "정신력", add, "Flat"),

  defineAttr("def_ph", "물리 방어력", add, "Flat"),
  defineAttr("def_mg", "마법 방어력", add, "Flat"),
  defineAttr("def_ph_pct", "물리 방어력 증가", add, "Percent"),
  defineAttr("def_mg_pct", "마법 방어력 증가", add, "Percent"),
  
  defineAttr("res_fire", "화속성 저항", add, "Flat"),
  defineAttr("res_ice",  "수속성 저항", add, "Flat"),
  defineAttr("res_lght", "명속성 저항", add, "Flat"),
  defineAttr("res_dark", "암속성 저항", add, "Flat"),

  defineAttr("misc", "기타 관심없는 효과", combineArray, "Misc")
]

attrDefs.array = attrDefsArray

/** 
 * 두 개 이상의 옵션을 결합한다.  
 * **절대!!! 절대로!! 2개 이상의 "아이템" 옵션을 결합할 때는 쓰지 말것!!!!!!**
 */
export function combine(...attrsList: (BaseAttrs | null | undefined)[]) {
  const prev: BaseAttrs = {}

  for (const attrs of attrsList) {
    if (attrs == null) continue
    for (const key in attrs) {
      if (key === "DualTrigger") {
        prev[key] ||= attrs[key]
        continue
      }
      if (!(key in reducers)) continue
      if (!(key in prev)) {
        // @ts-ignore
        prev[key] = attrs[key]
      } else {
        // @ts-ignore
        prev[key] = reducers[key](prev[key], attrs[key])
      }
    }
  }
  return prev
}


/** 주어진 속성강화와 속성부여로부터, 최종적으로 적용되는 내 속성타입을 얻는다. */
export function whatElType(el: El): Eltype[] {
  const activeTypes = el.eltype
  if (activeTypes == null || activeTypes.length == 0) return []
  const maxValue = Math.max(...activeTypes.map(eltype => el[Elemental[eltype].el] ?? 0))
  return activeTypes.filter(eltype => el[Elemental[eltype].el] == maxValue)
}

/** 입력 옵션에 "듀얼 트리거"가 켜져있으면 화속강과 명속강을 더 큰쪽으로 같게 만든다. (이걸 쓰는 시점이 중요!!!) */
export function dualTrigger(attrs: BaseAttrs) {
  if (attrs["DualTrigger"]) {
    const max = Math.max(attrs["el_fire"] ?? 0, attrs["el_lght"] ?? 0)
    if (max > 0) return { ...attrs, ["el_fire"]: max, ["el_lght"]: max }
  }
  return attrs
}
