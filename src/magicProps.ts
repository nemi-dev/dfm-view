import magicProps from "./magicProps.json"
import { getSupertype } from "./items"
import { at1, MyAttrKey } from "./attrs"

interface MagicPropsMint {
  order: MagicPropsCareAbout[]
  cycle: Partial<Record<MagicPropsCareAbout, MagicPropsCareAbout>>
  attrSet: Partial<Record<MagicPropsCareAbout, number>>
}

const magicPropsPicker = (() => {
  const z: { [key: string]: MagicPropsMint } = {}
  for (const magicPropsKey in magicProps) {
    const array: [MagicPropsCareAbout, number][] = magicProps[magicPropsKey]
    const order: MagicPropsCareAbout[] = []
    const cycle: Partial<Record<MagicPropsCareAbout, MagicPropsCareAbout>> = {}
    const attrSet: Partial<Record<MagicPropsCareAbout, number>> = {}
    array.forEach(([attrKey, value], index) => {
      order.push(attrKey)
      cycle[attrKey] = array[(index + 1) % array.length][0]
      attrSet[attrKey] = value
    })
    z[magicPropsKey] = { order, cycle, attrSet }
  }
  return z
})()

export function getRealAttrKey(name: MagicPropsCareAbout, atype: Atype) {
  if (name === "Stat" || name === "Atk" || name === "Crit") return MyAttrKey[atype][name]
  return name
}

interface MagicPropsTargetId {
  level: number
  rarity: Rarity
  part: MagicPropsPart
  prime?: boolean
}

const targetKey = ({ level, rarity, part, prime = false }: MagicPropsTargetId) => {
  const partCat = getSupertype(part)
  const findPrime = rarity === "Epic" && prime ? "-고유" : ""
  return `${level}/${rarity}/${partCat}${findPrime}`
}

/** 주어진 스펙의 장비에 대해 뜰 수 있는 모든 마법봉인 옵션을 얻는다. */
function available(id: MagicPropsTargetId) {
  let key = targetKey(id)
  if (!(key in magicPropsPicker))
    throw new Error("이런! 개발자가 아직 해당 장비 베이스의 마법봉인 카테고리를 안 만들었네요!")

  return magicPropsPicker[key]
}

/** `available`로 찾은 컬렉션에서 마법봉인 옵션 하나를 만든다. */
function makeAttrs(name: MagicPropsCareAbout, atype: Atype, mint: MagicPropsMint,) {
  return at1(getRealAttrKey(name, atype), mint.attrSet[name])
}

/** 어떤 마법봉인 옵션을 클릭했을 때, 다음에 어떤 마법봉인으로 바꿀지 판단한다. */
export function nextMagicProps(part: MagicPropsPart, current: MagicPropsCareAbout, level: number, rarity: Rarity, prime: boolean) {
  const mint = available({ level, rarity, part, prime })
  return mint.cycle[current]
}

/** 현재 파트에 장착중인 아이템과 그에 설정된 마법봉인 종류(키워드)에 맞는 수치값만을 얻는다. */
export function getOneMagicPropValue(name: MagicPropsCareAbout, id: MagicPropsTargetId) {
  const mint = available(id)
  return mint.attrSet[name]
}

export function getMagicPropsAttrs(mp: MagicPropsCareAbout[], atype: Atype, level: number, rarity: Rarity, part: MagicPropsPart) {
  if (rarity === "Common" || rarity == "Uncommon") return []
  if (rarity === "Rare") mp = mp.slice(-1)
  else if (rarity === "Unique") mp = mp.slice(-2)
  if (mp.length == 3) {
    return mp.map((name, index) => makeAttrs(name, atype, available({ level, rarity, part, prime: index === 0 })))
  } else {
    const prime = false
    return mp.map(name => makeAttrs(name, atype, available({ level, rarity, part, prime })))
  }
}
