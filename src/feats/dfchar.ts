import { atx, combine } from '../attrs'
import { whois } from '../dfclass'
import { getEmblem } from '../emblem'
import {
    getArmor, getBlessing, getItem, getMaxEmblemCount, hasMagicProps, isArmor, isCardable, isEquip
} from '../items'
import { getMagicPropsAttrs } from '../magicProps'

/** 이 캐릭터의 크리쳐를 선택한다. 크리쳐의 성장 보너스가 스탯에 적용된다. */
export function getCreature(dfchar: DFChar) {
  const creature = getItem(dfchar.items.크리쳐)
  if (!creature) return null

  const stat = dfchar.creatureValues.Creature
  const statAttr = atx("StatAll", stat)
  const creatureWithstat: DFItem = {
    ...creature,
    attrs: combine(creature.attrs, statAttr)
  }
  return creatureWithstat
}

/** "메인 아이템"을 선택한다. 방어구는 재질 옵션이, 크리쳐는 성장 보너스가 적용된다. */
export function getCurrentMainItem(dfchar: DFChar, part: MainItemSelector) {
  if (part === "크리쳐") return getCreature(dfchar)
  if (typeof part === "string") {
    if (isArmor(part)) return getArmor(dfchar.items[part], dfchar.materials[part])
    else return getItem(dfchar.items[part])
  } else {
    const { part: _part, index } = part
    if (_part === "정수") return getItem(dfchar.items.정수[index])
    if (_part === "아티팩트") return getItem(dfchar.items.아티팩트[index])
  }
}

export function getMagicProps(dfchar: DFChar, part: MagicPropsPart) {
  const item = getItem(dfchar.items[part])
  const atype = whois(dfchar.dfclass).atype ?? "Physc"
  const magicPropsNames = dfchar.magicProps[part]
  const { level, rarity } = item
  const magicPropArray = getMagicPropsAttrs(magicPropsNames, atype, level, rarity, part)
  return {
    name: `${part} 마법봉인`,
    attrs: combine(...magicPropArray)
  }
}

/** 이 캐릭터의 아티팩트를 선택한다. */
export function getArtifacts(dfchar: DFChar) {
  return Object.values(dfchar.items.아티팩트).map(getItem).filter(v => v != null)
}

/** 이 캐릭터의 아티팩트 옵션을 선택한다. */
export function getArtifactProps(dfchar: DFChar) {
  const artifacts = getArtifacts(dfchar)
  const artifactProps: AttrSource[] = []
  artifacts.forEach(a => {
    switch (a.ArtiColor) {
      case "Red":
        artifactProps.push({
          name: "레드 아티팩트 옵션",
          attrs: atx("Stat", dfchar.creatureValues.Red)
        })
      break
      case "Blue":
        artifactProps.push({
          name: "블루 아티팩트 옵션",
          attrs: atx("Atk", dfchar.creatureValues.Blue)
        })
      break
      case "Green":
        artifactProps.push({
          name: "그린 아티팩트 옵션",
          attrs: atx("El", dfchar.creatureValues.Green)
        })
      break
    }
  })
  return artifactProps
}

/** 이 캐릭터가 착용중인 어느 한 "부위"를 선택한다. */
export function getPartSource(dfchar: DFChar, part: SingleItemPart) {
  const item = getCurrentMainItem(dfchar, part)
  const partSource: PartSourceSet = { type: part, item }
  if (!item) return null

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
    if (card) partSource.card = card

    const emblemSpecs = dfchar.emblems[part] ?? []
    const maxEmblemCount = getMaxEmblemCount(item)
    const emblems = emblemSpecs.slice(0, maxEmblemCount).map(getEmblem)
    partSource.emblems = emblems
  }

  if (hasMagicProps(part)) {
    partSource.magicProps = getMagicProps(dfchar, part)
  }

  if (part === "봉인석") {
    const spells = dfchar.items.정수.map(getItem)
    partSource.spells = spells
    partSource.blessing = getBlessing(item, ...spells)
  }

  if (part === "크리쳐") {
    partSource.artifacts = getArtifacts(dfchar)
    partSource.artifactProps = getArtifactProps(dfchar)
  }

  return partSource
}
