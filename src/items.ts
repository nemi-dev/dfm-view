import _items from "../data/items.json"
import _isets from "../data/itemsets.json"
import _armorbases from "./armorbase.json"

import memoizee from "memoizee"
import { atx, AtypeAttrKey, combine, repeatAttr, scalarProduct } from "./attrs"

export const weaponType: readonly Itype[] = Object.freeze([
  "소검","도","둔기","대검","광검",
  "너클","건틀릿","클로","권투글러브","통파",
  "리볼버","자동권총","머스켓","핸드캐넌","보우건",
  "창","봉","로드","스탭","빗자루",
  "십자가","염주","토템","낫","배틀액스",
  "락소드","윙블레이드"
]) 
export const armorParts: readonly ArmorPart[] = Object.freeze(["상의", "하의", "머리어깨", "벨트", "신발"])
export const accessParts: readonly AccessPart[] = Object.freeze(["팔찌", "목걸이", "반지"])

/** 강화/칼레이도박스 가능한 아이템 부위 */
export const equipParts: readonly EquipPart[] = Object.freeze(["무기", ...armorParts, ...accessParts, "보조장비"])
export const singleItemParts: readonly SingleItemPart[] = Object.freeze([...equipParts,  "칭호", "오라", "무기아바타", "봉인석", "크리쳐",])
export const wholeParts: readonly WholePart[] = Object.freeze([...equipParts, "칭호", "오라", "무기아바타", "봉인석", "정수", "크리쳐", "아티팩트"])

/** 단 한 종류의 엠블렘만 넣을 수 있는 부위 모음 */
export const oneEmblemParts: readonly EquipPart[] = Object.freeze([...armorParts, ...accessParts])

/** 카드/엠블렘을 넣을 수 있는 부위 */
export const cardableParts: readonly CardablePart[] = Object.freeze([...equipParts, "칭호"])

/** 마법봉인이 있는 부위 */
export const magicPropsParts: readonly MagicPropsPart[] = Object.freeze([...equipParts, "봉인석"])

/** 이 아이템 타입은 무기인가? */
export const isWeapon = (itype: Itype | "무기") => (itype === "무기" || weaponType.includes(itype))

/** `key`가 방어구 부위인가? */
export const isArmor = (key: WholePart): key is ArmorPart => armorParts.includes(key as ArmorPart)

/** `key`가 악세서리 부위인가? */
export const isAccess = (key: WholePart): key is AccessPart => accessParts.includes(key as AccessPart)

export const isEquip = (p: WholePart): p is EquipPart => equipParts.includes(p as any)

/** p가 카드/엠블렘 장착 가능 부위인가? */
export const isCardable = (p: WholePart): p is CardablePart => cardableParts.includes(p as any)


/** 주어진 부위의 "상위 종류"를 얻는다. (ex. "방어구", "악세서리", "무기", "봉인석") */
export function getSupertype(part: EquipPart | "봉인석") {
  if (isArmor(part as EquipPart)) return "방어구"
  if (isAccess(part as EquipPart)) return "악세서리"
  return part as "무기" | "봉인석"
}

/** 이 아이템을 어디에 장착할 수 있는지 판단한다. */
function getCato(s: Itype): WholePart | "카드" | null {
  if (wholeParts.includes(s as WholePart)) return s as WholePart
  if (s === "카드") return "카드"
  if (isWeapon(s)) return "무기"
  return null
}



const items = _items as DFItem[]
const isets = _isets as unknown as DFISet[]
const armorbases = _armorbases as DFItem[]

type PartIndex = { [k in WholePart | "카드"]: DFItem[] }

const _items_index_Name: Record<string, DFItem> = {}
const _items_index_ID: Record<number, DFItem> = {}
const _items_index_Part_or_Card = (()=>{
  const x = {} as PartIndex
  ([...wholeParts, "카드"] as (WholePart | "카드")[]).forEach((p) => x[p] = [])
  return x
})()

const _item_name_to_id: Record<string, number> = {}
const _item_id_to_name: Record<number, string> = {}


const isetChildren: Record<string, string[]> = {}

/** `isetChildren`에 `item`을 `setOf`의 세트 구성 아이템으로 등록한다. */
function assignIset(item: DFItem, setOf: string | string[]): void {
  const { name } = item;
  if (setOf instanceof Array) return setOf.forEach(s => assignIset(item, s))
  if (!(setOf in isetChildren)) isetChildren[setOf] = []
  isetChildren[setOf].push(name)
}

for (const item of items) {  
  _items_index_Name[item.name] = item

  if (item.id != null) {
    _items_index_ID[item.id] = item
    _item_name_to_id[item.name] = item.id
    _item_id_to_name[item.id] = item.name
  }

  const part = getCato(item.itype)
  if (part) _items_index_Part_or_Card[part].push(item)
  if (item.setOf) assignIset(item, item.setOf)
}

const ISetsNameMap: Record<string, DFISet> = {}

for (const iset of isets) if (iset.name) ISetsNameMap[iset.name] = iset






/** "방어구 재질"을 얻는다. **얘는 AttrSource가 아니어야 한다** */
export const getArmorBase = memoizee(
  function getArmorBase(level: number, rarity: Rarity, material: ArmorMaterial, part: EquipPart): BaseAttrs {
    const find = armorbases.find(attr => {
      return attr.level == level
      && attr.rarity == rarity
      && attr.material == material
      && attr.itype == part
    })
    if (!find) return {}
    return find.attrs
  },
{ primitive: true })

/**
 * 무기, 방어구, 악세서리, 보조장비, 카드, 칭호, 오라, 무기아바타, 봉인석, 정수 아이템을 얻는다.  
 * 엠블렘은 얻을 수 없다.
 */
export const getItem = (name: string) => _items_index_Name[name]

/** 부위별 아이템 모음을 얻는다. */
export const getItemsByPart = (part: WholePart) => _items_index_Part_or_Card[part]


/** 아이템 이름을 ID로 바꾼다. */
export const itemNameToId = (name: string) => _item_name_to_id[name] ?? 0

/** 아이템 ID를 이름으로 바꾼다. */
export const itemIdToName = (id: number) => _item_id_to_name[id]


/** 
 * `name`이 방어구 아이템 이름인 것이 확실할 때, 실제 던파 방어구 아이템을 구현한다.  
 * 
 * @param mat "내가 설정한" 방어구 재질. (환영극단 2막, 루프트하펜 등 재질이 고정된 방어구는 이 재질을 씹는다.)
 */
export const getArmor: (name: string, mat: ArmorMaterial) => DFItem | undefined
= memoizee(
  function getArmor(name: string, myMaterial: ArmorMaterial) {
    const item = getItem(name)
    if (!item) return item
    const part = item.itype as ArmorPart
    const { level, rarity, material = myMaterial } = item
    const armorbase = getArmorBase(level, rarity, material, part)
    return { ...item, attrs: combine(item.attrs, armorbase)}
  }
)



/** 세트를 구성하는 아이템을 얻는다. */
export const getEquipsOfISet = memoizee(
  function _getEquipsOfISet (isetname: string) {
    if (!isetname || !(isetname in isetChildren)) return []
    const itemNames = isetChildren[isetname]
    return itemNames.map(name => getItem(name))
  }
, { primitive: true })

/** 아이템에서 세트 개수를 얻는다. */
function countISets(items: DFItem[]) {
  const counts: Record<string, number> = {}
  let bumpAll: number = 0
  for (const item of items) {
    if (!item) continue
    const s = item.setOf
    if (!s) continue
    if (s === "all") {
      bumpAll += 1
      continue
    }
    for (const k of s) {
      if (!counts[k]) counts[k] = 0
      counts[k]++
    }
  }
  if (bumpAll > 0) for (const key in counts) {
    counts[key] += bumpAll
  }
  return counts
}

/** 주어진 아이템들로부터 활성화되는 세트들을 얻는다. */
export function getActiveISets(...items: DFItem[]) {
  const counts = countISets(items)
  const iset_info: ComplexAttrSource[] = []
  for (const iset_name in counts) {
    const count = counts[iset_name];
    const iset = ISetsNameMap[iset_name]
    if (!iset) continue
    for (let c = count; c > 0; c--) {
      if (iset[c]) iset_info.push(iset[c])
      
    }
  }
  return iset_info
}

/** 주어진 부위의 장비에 바를 수 있는 카드(+보주) 목록을 얻는다. */
export const getCardsForPart = memoizee(
  function _getCardsForPart(part: CardablePart) {
    return _items_index_Part_or_Card["카드"].filter(card => card.part?.includes(part))
  },
{ primitive: true })








export function createCondyceKey2(sourceName: string, node: ConditionalNode) {
  return `${sourceName}::${node.when}`
}

/** 주어진 아이템 또는 아이템 세트에서 "내가 활성화한" branch/gives 조건부 옵션들을 실체화한다. **(중첩횟수 적용)** */
export function createActiveNode(attrSourceName: string, nodes: ConditionalNode[] | null | undefined, activeKeys: Record<string, OptionalChoiceType>) {
  // const d: ConditionalNode[] = []
  const d: AttrSource[] = []
  if (nodes)
  for (const child of nodes) {
    /* branch/gives에 "when"이 없다면 "던전 입장시"인 것으로 취급한다.
      "던전 입장시"와 "최대 x중첩"이 같이 있는 옵션은 아직 없으므로 한번만 적용한다. */
    if (!child.when) {
      d.push(child)
    } else {
      const activeKey = createCondyceKey2(attrSourceName, child)
      if (activeKey in activeKeys) {
        const maxRepeat = activeKeys[activeKey]
        if (maxRepeat > 0) d.push(repeatAttr(child, maxRepeat))
      }
    }
    
  }
  return d
}


function exclusiveKey(item: ComplexAttrSource, exclusiveSet: ExclusiveSet) {
  return `${item.name}::${exclusiveSet.name}`
}

export function createExclusiveKey2(itemName: string, exclusiveSet: ExclusiveSet) {
  return `${itemName}::${exclusiveSet.name}`
}

/** 주어진 아이템 또는 아이템 세트에서 "내가 체크한" Exclusive 조건부 옵션을 실체화한다. */
export function getActiveExclusive(item: ComplexAttrSource, activeKeys: Record<string, string>) {
  if (!(item.exclusive)) return []
  const d: AttrSource[] = []
  for (const exclusiveSet of item.exclusive) {
    const key = exclusiveKey(item, exclusiveSet)
    if (activeKeys[key]) {
      const { children } = exclusiveSet
      const found = children.find(exclusiveNode => exclusiveNode.name === activeKeys[key])
      if (found) d.push(found)
    }
  }
  return d
}


/**
 * 주어진 아이템에서 "내가 체크한" 조건부 노드들을 배열로 얻는다.
 * @param iii 아이템일 수도 있고, 세트일 수도 있다.
 */
export function createActiveCondyces(iii: ComplexAttrSource, { branches, gives, exclusives }: Choices) {
  if (!iii) return []
  return [
    ...createActiveNode(iii.name, iii.branch, branches),
    ...createActiveNode(iii.name, iii.gives, gives),
    ...getActiveExclusive(iii, exclusives)
  ]
}



const blessings = [
  ["미카엘의 가호", 45, "Epic", 5],
  ["우리엘의 가호", 40, "Epic", 4],
  ["라파엘의 가호", 35, "Epic", 3],
  ["샤피엘의 가호", 30, "Epic", 2],
  ["사리엘의 가호", 25, "Unique", 4],
  ["라구엘의 가호", 21, "Unique", 3],
  ["지브릴의 가호", 17, "Unique", 2],
  ["레미엘의 가호", 12, "Rare", 3],
  ["지천사의 가호", 9, "Rare", 2],
  ["치천사의 가호", 6, "Uncommon", 2],
] as const

const NoneBlessing: AttrSource = {
  name: "[성안의 봉인]가호 없음",
  attrs: {}
}

/** 성안의 봉인에서 활성화된 가호를 얻는다. */
export function getBlessing(rune: DFItem, ...spells: DFItem[]): AttrSource {
  if (!rune) return NoneBlessing
  const counts = [rune, ...spells].reduce((p, { rarity }) => (p[rarity] += 1, p),
  { Common: 0, Uncommon: 0, Rare: 0, Unique: 0, Epic: 0 })
  const blessing = blessings.find(([, , rarity, minCount]) => counts[rarity] >= minCount)
  if (!blessing) return NoneBlessing
  const [name, value, rarity, count] = blessing
  return {
    name: `${name} (${rarity} ${count}개 이상 장착)`,
    attrs: atx("StatAll", value)
  }
  
}

/** 내 공격타입에 맞는 봉인석/정수만 얻는다. */
export const getCracksOnly = memoizee(
function getCracksOnly(itype: "봉인석" | "정수", atype: Atype) {
  const attrKey = AtypeAttrKey[atype]["Stat"]
  return _items_index_Part_or_Card[itype].filter(item => item.attrs[attrKey])
}
, { primitive: true })


/** 아이템 목록에서 choice로 활성화되는 효과들을 각 아이템 뒤에 붙인다. */
export function Interpolate(sources: (AttrSource | ComplexAttrSource | null | undefined)[], choice: Choices): (AttrSource | ComplexAttrSource)[] {
  if (!sources) return []
  return sources.flatMap(s => {
    if (!s) return []
    if (("branch" in s) || ("gives" in s) || ("exclusive" in s)) {
      const cond = createActiveCondyces(s, choice)
      return [s, ...cond]
    }
    return [s]
  })
}


/** 
 * - 아이템 배열의 모든 옵션을 결합한다.
 * - Choice가 null도 undefined도 아니라면 아이템 배열에서 활성화되는 조건부 옵션까지 모두 선택한다.
 * 
 * 이게 진짜지 ㅋㅋㅋㅋ
 */
export function CombineItems(sources: (AttrSource | ComplexAttrSource | null | undefined)[], choice: Choices | null = null): BaseAttrs {
  if (!sources) return {}
  if (!choice) return combine(...sources.map(s => s?.attrs))
  return combine(...Interpolate(sources, choice).map(s => s?.attrs))
}

