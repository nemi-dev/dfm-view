import _items from "../data/items.json"
import _isets from "../data/itemsets.json"
import _armorbases from "../data/armorbase.json"

import memoizee from "memoizee"
import { explode } from "./utils"

export const weaponType = [
  "소검","도","둔기","대검","광검","너클","건틀릿","클로","권투글러브","통파","리볼버","자동권총","머스켓","핸드캐넌","보우건","창","봉","로드","스탭","빗자루","십자가","염주","토템","낫","배틀액스","락소드","윙블레이드"
]
export const equipParts: EquipPart[] = ["무기", "상의", "하의", "머리어깨", "벨트", "신발", "팔찌", "목걸이", "반지", "보조장비"]
export const armorParts: ArmorPart[] = ["상의", "하의", "머리어깨", "벨트", "신발"]
export const wholeParts: WholePart[] = [...equipParts, "칭호", "오라", "무기아바타", "봉인석", "정수"]

export function isWeapon(itype: string): boolean {
  return (itype === "무기" || weaponType.includes(itype as Itype))
}

/** `key`가 방어구 부위인가? */
export const isArmorPart = (key: EquipPart): key is ArmorPart => armorParts.includes(key as ArmorPart)

/** `key`가 악세서리 부위인가? */
export const isAccessPart = (key: EquipPart): key is "팔찌" | "목걸이" | "반지" => key === "팔찌" || key === "목걸이" || key === "반지"

const _itype_is_equipPart: (Itype | EquipPart)[] = ["상의", "하의", "머리어깨", "벨트", "신발", "팔찌", "목걸이", "반지", "보조장비", "무기아바타", "오라", "칭호", "봉인석", "정수"]

function _part(s: Itype): WholePart {
  if (_itype_is_equipPart.includes(s)) return s as WholePart
  if (isWeapon(s)) return "무기"
  return null
}

const items = _items as Attrs[]
const isets = _isets as ISet[]
const armorbases = _armorbases as Attrs[]

const cards: Card[] = []

type PartIndex = {
  [k in WholePart]: Attrs[]
}

const _items_index_Name: Record<string, Attrs> = {}
const _items_index_Part = (()=>{
  const x = {} as PartIndex
  wholeParts.forEach(p => x[p] = [])
  return x
})()

const isetChildren: Record<string, string[]> = {}

/** `isetChildren`에 `item`을 `setOf`의 세트 구성 아이템으로 등록한다. */
function assignIset(item: Attrs, setOf: string | string[]) {
  const { name } = item;
  if (setOf instanceof Array) return setOf.forEach(s => assignIset(item, s))
  if (!(setOf in isetChildren)) isetChildren[setOf] = []
  isetChildren[setOf].push(name)

}


for (const item of items) {
  _items_index_Name[item.name] = item

  const part = _part(item.itype)
  if (part) _items_index_Part[part].push(item)

  if (item.itype === "카드") cards.push(item as Card)

  if (item.setOf) assignIset(item, item.setOf)
}

const ISetsNameMap: Record<string, ISet> = {}



for (const iset of isets) {
  ISetsNameMap[iset.name] = iset
  iset.children = isetChildren[iset.name]
}










/** "방어구 재질"을 얻는다. */
export const getArmorBase = memoizee(
  function _getArmorBase(level: number, rarity: Rarity, material: ArmorMaterial, part: ArmorPart): Attrs {
    const find = armorbases.find(attr => {
      return attr.level == level
      && attr.rarity == rarity
      && attr.material == material
      && attr.itype == part
    })
    if (!find) throw new Error("적절한 방어구 재질을 찾을 수 없습니다!")
    return find
  },
{ primitive: true })

/**
 * "상의" | "하의" | "머리어깨" | "벨트" | "신발"은 "방어구"이다.  
 * "팔찌" | "목걸이" | "반지"는 "악세서리"이다.  
 * "무기"는 "무기"이다.  
 * "보조장비"는 "보조장비"이다.  
 * "봉인석"은 "봉인석"이다.  
 */
export function getPartCat(part: EquipPart | "봉인석") {
  if (isArmorPart(part as EquipPart)) return "방어구"
  if (isAccessPart(part as EquipPart)) return "악세서리"
  return part
}


/**
 * 이름으로 아이템을 얻는다.  
 * 무기, 방어구, 악세서리, 보조장비, 카드, 칭호, 오라, 무기아바타, 봉인석, 정수를 얻을 수 있다.  
 * 엠블렘은 얻을 수 없다.
 */
export const getItem = (name: string) => _items_index_Name[name]

/** 부위별 장비 모음을 얻는다. */
export const getItemsByPart = (part: WholePart) => _items_index_Part[part]

/** 세트를 구성하는 아이템을 얻는다. */
export const getEquipsOfISet = memoizee(
  function _getEquipsOfISet (isetname: string) {
    if (!isetname || !(isetname in isetChildren)) return []
    const itemNames = isetChildren[isetname]
    return itemNames.map(name => getItem(name))
  }
, { primitive: true })

/** 아이템 이름에서 세트 개수를 얻는다. */
export function countISetsFrom(...names: string[]) {
  const counts: Record<string, number> = {}
  for (const name of names) {
    if (!name) continue
    if (name === "all") {
      for (const key in counts) counts[key]++
      continue
    }
    const s = getItem(name)?.setOf
    if (!s) continue
    if (typeof s === "string") {
      if (!counts[s]) counts[s] = 0
      counts[s]++
    } else {
      for (const k of s) {
        if (!counts[k]) counts[k] = 0
        counts[k]++
      }
    }
  }
  return counts
}

/**
 * 아이템 갯수로부터 활성화되는 세트들을 얻는다.
 * 
 * { "<세트 이름>[<옵션 활성화에 필요했던 세트 수>]" : 세트 옵션 } 형식으로 얻는다.
 */
export function getActiveISetAttrs(counts: Record<string, number>) {
  const iset_info: Record<string, Attrs> = {}
  for (const iset_name in counts) {
    const count = counts[iset_name];
    const iset = ISetsNameMap[iset_name]
    for (let c = count; c > 0; c--) {
      if (iset[c]) {
        iset_info[`${iset.name}[${c}]`] = iset[c]
      }
    }
  }
  return iset_info
}


/** 주어진 부위의 장비에 바를 수 있는 카드(+보주) 목록을 얻는다. */
export const getCardsForPart = memoizee(
  function _getCardsForPart(part: EquipPart | "칭호") {
    return cards.filter(card => card.part.includes(part))
  },
{ primitive: true })



/** 주어진 아이템에서 "내가 체크한" branch 조건부 옵션들을 배열로 얻는다. */
export function getActiveBranch(item: Attrs, activeKeys: Record<string, boolean>): BaseAttrs[] {
  if (!(item?.branch)) return []
  const { name, branch } = item
  return branch.filter(child => activeKeys[`${name}::${child.when}`])
}

/** "내가 체크한" give_us 조건부 옵션이 이 아이템의 give_us를 발동시킨다면 그 give_us를 얻는다. */
export function isActiveGives(item: Attrs, activeKeys: Record<string, boolean>): BaseAttrs {
  if (!(item?.give_us)) return null
  const { name, give_us } = item
  const key = `${name}::${give_us.when ?? "default"}`
  if (activeKeys[key]) return give_us
  return null
}

function activeKey(item: Attrs, e: ExclusiveGroup) {
  return `${item.name}::${e.name}`
}

export function getActiveExclusive(item: Attrs, activeKeys: Record<string, string>) {
  if (!(item?.exclusive)) return []
  /*
  Exclusive 목록은 ExclusiveGroup(또는 ExclusiveGroup)들로 되어 있다.
  ExclusiveGroup은 자신만의 키를 가지는데, 그 키가 사용자가 활성화한 키 목록 중에 있는 것만을 고른다.

  활성화된 키는 그 ExclusiveGroup의 자식 중 하나의 이름을 값으로 가진다.
  그 단 하나의 자식만의 옵션이 활성화된다.

  ex)
  {
    name = 새벽에 기도하는 칠흑의 예언자 세트
    exclusive = [
      {
        <type ExclusivevGroup>
        name = 예언자 카드
        <id = "새벽에 기도하는 칠흑의 예언자 세트::예언자 카드">

        children = [
          {
            name = 광대
            ...attrs
          }
          {
            name = 여제
            ...attrs
          }
          {
            name = 황제
            ...attrs
          }
        ]
      }
      {
        <type ExclusivevGroup>
        name = 자연의 변덕
        <id = "새벽에 기도하는 칠흑의 예언자 세트::자연의 변덕">

        children = [
          {
            name = 화속성
            ...attrs
          }
          {
            name = 수속성
            ...attrs
          }
          {
            name = 명속성
            ...attrs
          }
          {
            name = 암속성
            ...attrs
          }
        ]
      }
    ]
  }
  */

  return item.exclusive
  .filter(e => activeKeys[activeKey(item, e)])
  .map(e => e.children.find(a => a.name === activeKeys[activeKey(item, e)]))
}




const blessings: [string, number, Rarity, number][] = [
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
]

/** 성안의 봉인에서 활성화된 가호를 얻는다. */
export function getBlessing(...items: Attrs[]) {
  const countMap: Record<Rarity, number> = {
    Common: 0, Uncommon: 0, Rare: 0, Unique: 0, Epic: 0
  }
  items.forEach(a => countMap[a.rarity]++)
  const [name, value, rarity, count] = blessings.find(([, , rarity, minCount]) => countMap[rarity] >= minCount)
  return {
    name: `${name} (${rarity} ${count}개 이상 장착)`,
    ...explode(value, "stat")
  } as BaseAttrs
}
