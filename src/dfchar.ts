import { atx, combine } from './attrs'
import { whois } from './dfclass'
import { getEmblem } from './emblem'
import {
    getArmor, getItem, getMaxEmblemCount, hasMagicProps, isArmor, isCardable, isEquip
} from './items'
import { getMagicPropsAttrs } from './magicProps'

export function getCurrentMainItem(dfchar: DFCharState, part: MainItemSelector) {
  if (typeof part === "string") {
    if (isArmor(part)) return getArmor(dfchar.items[part], dfchar.materials[part])
    else return getItem(dfchar.items[part])
  } else {
    const { part: _part, index } = part
    if (_part === "정수") return getItem(dfchar.items.정수[index])
    if (_part === "아티팩트") return getItem(dfchar.items.아티팩트[index])
  }
}

interface PartSourceSet {
  main: DFItem
  upgrade?: AttrSource
  card?: DFItem
  magicProps?: AttrSource
  emblems?: AttrSource[]
  spells?: DFItem[]
  artifacts?: DFItem[]
}

export function getPartSource(dfchar: DFCharState, part: SingleItemPart) {
  const main = getCurrentMainItem(dfchar, part)
  const partSource: PartSourceSet = {
    main
  }
  if (!main) return null
  const atype = whois(dfchar.dfclass).atype ?? "Physc"

  if (isEquip(part)) {
    const upgradeValue = dfchar.upgradeValues[part] ?? 0
    const upgrade = {
      name: `${part} 강화`,
      attrs: atx(part === "무기" ? "Atk" : "StatAll", upgradeValue)
    }
    partSource.upgrade = upgrade
  }

  if (isCardable(part)) {
    const cardKey = dfchar.cards[part] ?? null
    const card = getItem(cardKey)
    partSource.card = card

    const emblemSpecs = dfchar.emblems[part] ?? []
    const maxEmblemCount = getMaxEmblemCount(main)
    const emblems = emblemSpecs.slice(0, maxEmblemCount).map(getEmblem)
    partSource.emblems = emblems
  }

  if (hasMagicProps(part)) {
    const magicPropsNames = dfchar.magicProps[part]
    const { level, rarity } = main
    const magicPropArray = getMagicPropsAttrs(magicPropsNames, atype, level, rarity, part)
    const magicProps = {
      name: `${part} 마법봉인`,
      attrs: combine(...magicPropArray)
    }
    partSource.magicProps = magicProps
  }

  if (part === "봉인석") {
    const spells = dfchar.items.정수.map(getItem)
    partSource.spells = spells
  }

  if (part === "크리쳐") {
    const artifacts = Object.values(dfchar.items.아티팩트).map(getItem)
    partSource.artifacts = artifacts
  }

  return partSource
}
