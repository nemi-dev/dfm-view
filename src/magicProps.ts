import memoizee from "memoizee"
import magicProps from "./magicProps.json"
import { getPartCat } from "./items"

const at1 = memoizee((key: keyof BaseAttrs, value: number): BaseAttrs => ({ [key]: value }), { primitive: true })
interface MagicPropsMint {
  order: MagicPropsCareAbout[]
  cycle: Partial<Record<MagicPropsCareAbout, MagicPropsCareAbout>>
  attrSet: Partial<Record<MagicPropsCareAbout, BaseAttrs>>
}

const magicPropsPicker = (() => {
  const z: { [key: string]: MagicPropsMint; } = {}
  for (const magicPropsKey in magicProps) {
    const array: [MagicPropsCareAbout, number][] = magicProps[magicPropsKey]
    const order: MagicPropsCareAbout[] = []
    const cycle: Partial<Record<MagicPropsCareAbout, MagicPropsCareAbout>> = {}
    const attrSet: Partial<Record<MagicPropsCareAbout, BaseAttrs>> = {}
    array.forEach(([attrKey, value], index) => {
      order.push(attrKey)
      cycle[attrKey] = array[(index + 1) % array.length][0]
      attrSet[attrKey] = at1(attrKey, value)
    })
    z[magicPropsKey] = { order, cycle, attrSet }
  }
  return z
})()



/** 주어진 스펙의 장비에 대해 뜰 수 있는 모든 마법봉인 옵션을 얻는다. */
export function getAvailableMagicPropsForEquip(part: EquipPart | "봉인석", level: number, rarity: Rarity, prime: boolean = false) {
  const partCat = getPartCat(part)
  const findPrime = rarity === "Epic" && prime ? "-고유" : ""
  let key = `${level}/${rarity}/${partCat}${findPrime}`
  if (!(key in magicPropsPicker))
    throw new Error("이런! 개발자가 아직 해당 장비 베이스의 마법봉인 카테고리를 안 만들었네요!")

  return magicPropsPicker[key]
}

/** `getAvailableMagicPropsForEquip`으로 찾은 컬렉션에서 마법봉인 옵션 하나를 선택한다. */
export function findMagicPropsAttrs(name: MagicPropsCareAbout, mint: MagicPropsMint) {
  return mint.attrSet[name]
}

export function getMagicPropsAttrs(name: MagicPropsCareAbout, part: EquipPart | "봉인석", level: number, rarity: Rarity, prime: boolean = false) {
  return findMagicPropsAttrs(name, getAvailableMagicPropsForEquip(part, level, rarity, prime))
}
