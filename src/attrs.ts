import memoizee from "memoizee"
import { compound, add, add_object, mul_object, anyOf } from "./utils"
import { Elemental } from "./constants"



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
 * 주어진 조건부 노드를 효과로 실체화한다.  
 * 아이템 옵션에 "최대 x중첩"이 없거나, `k` === 1이면 노드를 그대로 돌려받는다.
  */
export function createCondyceAttr(parentName: string, node: ConditionalNode, repeat: number = 1): AttrSource {
  if (node?.maxRepeat == null || repeat === 1) return {
    name: `${parentName}::${node.pick ?? "던전에서"}`,
    attrs: { ...node.attrs }
  }
  repeat = Math.min(node.maxRepeat, repeat)
  return {
    name: `${parentName}::${node.pick ?? "던전에서"}`,
    attrs: scalarProduct(node.attrs, repeat)
  }
}


const reduce_eltype = (p: Eltype[], n: Eltype[]) => {
  const v = [...p]
  for (const i of n) {
    if (!p.includes(i)) v.push(i)
  }
  return v
}

const concat = <T>(p: T[], n: T[]) => {
  return p.concat(n)
}


export type AttrExpressionType = 
"Flat" | "Percent" | "MapFlat" | "MapPercent" | "DearEltype" | "DualTrigger" | "DoT" | "Recool" | "Superarmor"

export interface AttrDef {
  key: keyof BaseAttrs
  name: string,
  reducer: (a: any, b: any) => any
  expression: AttrExpressionType
}

const _attrDefs: { [k in keyof BaseAttrs]: AttrDef } = {}

function a<K extends keyof BaseAttrs>(key: K, name: string, reducer: (a: BaseAttrs[K], b: BaseAttrs[K]) => BaseAttrs[K], expression: AttrExpressionType) {
  const _a = { key, name, reducer, expression }
  _attrDefs[key] = _a
  return _a
}

const attrDefsArray = [

  a("atk_ph", "물리 공격력", add, "Flat"),
  a("atk_mg", "마법 공격력", add, "Flat"),
  a("atk_ph_inc", "물리 공격력 증가", add, "Percent"),
  a("atk_mg_inc", "마법 공격력 증가", add, "Percent"),
  a("def_ph", "물리 방어력", add, "Flat"),
  a("def_mg", "마법 방어력", add, "Flat"),
  a("def_ph_pct", "물리 방어력 증가", add, "Percent"),
  a("def_mg_pct", "마법 방어력 증가", add, "Percent"),

  a("strn", "힘", add, "Flat"),
  a("intl", "지능", add, "Flat"),
  a("vit", "체력", add, "Flat"),
  a("psi", "정신력", add, "Flat"),
  a("hpmax", "HP MAX", add, "Flat"),
  a("mpmax", "MP MAX", add, "Flat"),
  a("str_inc", "힘 증가", add, "Percent"),
  a("int_inc", "지능 증가", add, "Percent"),

  a("speed_atk", "공격속도", add, "Percent"),
  a("speed_cast", "캐스팅속도", add, "Percent"),
  a("speed_move", "이동속도", add, "Percent"),

  a("crit_ph", "물리 크리티컬", add, "Flat"),
  a("crit_mg", "마법 크리티컬", add, "Flat"),
  a("crit_ph_pct", "물리 크리티컬 확률 증가", add, "Percent"),
  a("crit_mg_pct", "마법 크리티컬 확률 증가", add, "Percent"),
  a("Accu", "적중", add, "Flat"),
  a("AccuPct", "적중 확률 증가", add, "Percent"),
  a("Evd", "회피", add, "Flat"),
  a("EvPct", "회피 확률 증가", add, "Percent"),

  a("eltype", "공격속성", reduce_eltype, "DearEltype"),
  a("el_fire", "화속성 강화", add, "Flat"),
  a("el_ice", "수속성 강화", add, "Flat"),
  a("el_lght", "명속성 강화", add, "Flat"),
  a("el_dark", "암속성 강화", add, "Flat"),
  a("DualTrigger", "듀얼 트리거", anyOf, "DualTrigger"),
  a("res_fire", "화속성 저항", add, "Flat"),
  a("res_ice",  "수속성 저항", add, "Flat"),
  a("res_lght", "명속성 저항", add, "Flat"),
  a("res_dark", "암속성 저항", add, "Flat"),

  a("dmg_inc", "데미지 증가", add, "Percent"),
  a("cdmg_inc", "크리티컬 데미지 증가", add, "Percent"),
  a("catk_inc", "크리티컬 공격력 증가", add, "Percent"),
  a("dmg_add", "추가 데미지", add, "Percent"),

  a("eldmg_fire", "화속성 추가 데미지", add, "Percent"),
  a("eldmg_ice", "수속성 추가 데미지", add, "Percent"),
  a("eldmg_lght", "명속성 추가 데미지", add, "Percent"),
  a("eldmg_dark", "암속성 추가 데미지", add, "Percent"),
  a("AddMaxEldmg", "속성 추가 데미지 (내 최대속성)", add, "Percent"),

  a("target_def", "적 방어력", add, "Flat"),
  a("target_res", "적 모든속성 저항", add, "Flat"),
  a("DefBreak", "적 방어력 감소", add, "Percent"),
  a("TargetResDark", "적 암속성 저항 감소", add, "Flat"),

  a("dot", "상변데미지", concat, "DoT"),
  a("sdinc_elect", "감전 데미지 증가", add, "Percent"),
  a("sdinc_toxic", "중독 데미지 증가", add, "Percent"),
  a("sdinc_bleed", "출혈 데미지 증가", add, "Percent"),
  a("sdinc_ignite", "화상 데미지 증가", add, "Percent"),

  a("sk_inc", "스킬 공격력 증가", compound, "Percent"),
  a("sk_inc_sum", "스킬 공격력 증가(단리합)", add, "Percent"),
  a("sk_lv", "스킬 레벨 증가", add_object, "MapFlat"),
  a("tp_lv", "스킬 TP레벨 증가", add_object, "MapFlat"),
  a("sk_val", "스킬 공격력 증가", mul_object, "MapPercent"),
  a("skb_add", "버프 수치 증가", add_object, "MapFlat"),
  a("sk_hit", "타격 횟수 증가", add_object, "MapFlat"),
  a("sk_dur", "스킬 지속시간 증가", add_object, "MapFlat"),
  a("sk_cool", "스킬 쿨타임 감소", add_object, "MapPercent"),
  a("sk_cool_sec", "스킬 쿨타임 감소 (초)", add_object, "MapFlat"),
  a("sk_chargeup_add", "스킬 충전시 배율 추가", add_object, "MapPercent"),

  a("moreMP", "스킬 MP 소모량", add_object, "MapPercent"),
  a("consumeMP", "스킬 사용시 MP 소모", add_object, "MapPercent"),

  a("Recool", "쿨타임 초기화", concat, "Recool"),

  a("Enlight", "암흑의 시야 페널티 감소", Math.max, "Percent"),
  a("Superarmor", "슈퍼아머", concat, "Superarmor"),

  a("Walk", "마을 이동속도 증가", add, "Percent")

]

export const attrDefs = {
  ..._attrDefs,
  array: attrDefsArray
}

/** 
 * 두 개 이상의 옵션을 결합한다.  
 * **절대!!! 절대로!! 2개 이상의 "아이템" 옵션을 결합할 때는 쓰지 말것!!!!!!**
 */
export function combine(...attrsList: (BaseAttrs | null | undefined)[]) {
  const prev: BaseAttrs = {}

  for (const attrs of attrsList) {
    if (attrs == null) continue
    for (const key in attrs) {
      // @ts-ignore
      const attrDef: AttrDef = attrDefs[key]
      if (!attrDef) continue
      if (!(key in prev)) {
        // @ts-ignore
        prev[key] = attrs[key]
      } else {
        // @ts-ignore
        prev[key] = attrDef.reducer(prev[key], attrs[key])
      }
    }
  }
  return prev
}

/** 입력 옵션에 "듀얼 트리거"가 켜져있으면 화속강과 명속강을 더 큰쪽으로 같게 만든다. (이걸 쓰는 시점이 중요!!!) */
export function dualTrigger(attrs: BaseAttrs) {
  if (attrs["DualTrigger"]) {
    const max = Math.max(attrs["el_fire"] ?? 0, attrs["el_lght"] ?? 0)
    if (max > 0) return { ...attrs, ["el_fire"]: max, ["el_lght"]: max }
  }
  return attrs
}

/** 주어진 속성강화와 속성부여로부터, 최종적으로 적용되는 내 속성타입을 얻는다. */
export function whatElType(el: ElementalAttrs): Eltype[] {
  const activeTypes = el.eltype
  if (activeTypes == null || activeTypes.length == 0) return []
  const maxValue = Math.max(...activeTypes.map(eltype => el[Elemental[eltype].el] ?? 0))
  return activeTypes.filter(eltype => el[Elemental[eltype].el] == maxValue)
}


/** (속성부여에 상관없이) 속성강화가 가장 높은 속성에 대해, [속성강화 값, ...속성]을 얻는다. */
export function maxEl(el: ElementalAttrs): [number, ...Eltype[]] {
  const eltypes: Eltype[] = ["Fire", "Ice", "Light", "Dark"]
  const maxValue = Math.max(...eltypes.map(eltype => el[Elemental[eltype].el] ?? 0))
  if (maxValue == 0) return [0]
  const maxEls = eltypes.filter(eltype => el[Elemental[eltype].el] == maxValue)
  return [maxValue, ...maxEls]
}

/** 최대 속성강화 추가 데미지가 있으면 그걸 적용한다. */
export function applyAddMaxEldmg(attrs: BaseAttrs) {
  if (attrs["AddMaxEldmg"]) {
    const val = attrs["AddMaxEldmg"]
    const [max, ...eltypes] = maxEl(attrs)
    if (!max) return attrs
    const eltype = eltypes[0]
    const atomAttr: BaseAttrs = {
      [Elemental[eltype].eldmg] : val
    }
    const { AddMaxEldmg: _, ...at } = attrs
    return combine(at, atomAttr)
  }
  return attrs
}

