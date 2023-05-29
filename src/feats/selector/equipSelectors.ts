import { createSelector } from '@reduxjs/toolkit'

import { atx, combine } from '../../attrs'
import { getEmblem } from '../../emblem'
import {
    armorParts, cardableParts, equipParts, getActiveISets, getArmor, getItem, getMaxEmblemCount,
    isArmor, magicPropsParts, singleItemParts
} from '../../items'
import { getMagicPropsAttrs } from '../../magicProps'
import { selectClassAtype, selectDFChar } from './baseSelectors'

import type { RootState } from "../store"

/** Redux Selector를 무진장 찍어낸다 */
function Paw<T, P extends string>(func: ($p: P) => (s: RootState, id?: string) => T, parts: (P[] | readonly P[])): {
  [k in P]: (state: RootState, id?: string) => T
} {
  const _o: any = {}
  parts.forEach(part => _o[part] = func(part))
  return _o
}

/** 특정 부위에 장착중인 아이템을 선택한다. */
export const selectItem = Paw(part => 
  createSelector(
    selectDFChar,
    (dfchar) => {
      if (isArmor(part)) return getArmor(dfchar.items[part], dfchar.materials[part])
      else return getItem(dfchar.items[part])
    }
  ),
singleItemParts)

/** 세 번째 것을 그대로 뱉어내는 함수를 만든다. */
function partExposer<T> () {
  return (_state: RootState, _dfcharID: RootState["currentID"], part: T ) => part
}





type SinglePartSelector = 
| SingleItemPart
| { part: "정수", index: number }
| { part: "아티팩트", index: ArtifactColor }



/** 특정 부위에 장착중인 아이템을 선택한다. */
export const selectItem2 = createSelector(
  selectDFChar,
  partExposer<SinglePartSelector>(),
  (dfchar, part) => {
    if (typeof part === "string") {
      if (isArmor(part)) return getArmor(dfchar.items[part], dfchar.materials[part])
      else return getItem(dfchar.items[part])
    } else {
      const { part: _part, index } = part
      if (_part === "정수") return getItem(dfchar.items.정수[index])
      if (_part === "아티팩트") return getItem(dfchar.items.아티팩트[index])
    }
  }
)



/** 특정 부위의 아이템에 바른 카드를 선택한다 */
export const selectCard = Paw(part => createSelector(selectDFChar, dfchar => getItem(dfchar.cards[part])), cardableParts)

/** 특정 부위의 아이템에 바른 카드를 선택한다 */
export const selectCard2 = createSelector(
  selectDFChar,
  partExposer<CardablePart>(),
  (dfchar, part) => {
    return getItem(dfchar.cards[part])
  }
)

/** 특정 부위의 아이템에 박은 엠블렘 스펙을 모두 선택한다 */
export const selectEmblemSpecs = Paw(part => createSelector(selectDFChar, dfchar => dfchar.emblems[part] ?? []), cardableParts)


/** 특정 부위의 아이템에 박은 엠블렘 스펙을 모두 선택한다 */
export const selectEmblemSpecs2 = createSelector(
  selectDFChar,
  partExposer<CardablePart>(),
  (dfchar, part) => {
    return dfchar.emblems[part] ?? []
  }
)

/** 특정 부위 아이템의 마법봉인 이름을 선택한다. (장착 아이템 여부에 상관없이 3개 풀로 선택함) */
export const selectMagicPropNames = Paw(
  part => createSelector(selectDFChar, dfchar => dfchar.magicProps[part]),
  magicPropsParts
)


/** 특정 부위 아이템의 마법봉인 이름을 선택한다. (장착 아이템 여부에 상관없이 3개 풀로 선택함) */
export const selectMagicPropNames2 = createSelector(
  selectDFChar,
  partExposer<MagicPropsPart>(),
  (dfchar, part) => {
    return dfchar.magicProps[part]
  }
)


/** 특정 부위의 "내가 선택한" 방어구 재질을 선택한다 (해당 방어구재질이 고정되어있는지 여부는 고려하지 않는다.) */
export const selectCustomMaterial = Paw(
  part => createSelector(selectDFChar, dfchar => dfchar.materials[part]),
  armorParts
)

/** 특정 부위의 "내가 선택한" 방어구 재질을 선택한다 (해당 방어구재질이 고정되어있는지 여부는 고려하지 않는다.) */
export const selectCustomMaterial2 = createSelector(
  selectDFChar,
  partExposer<ArmorPart>(),
  (dfchar, part) => {
    return dfchar.materials[part]
  }
)

/** 특정 부위의 강화보너스 수치(무기는 물/마공, 다른장비는 스탯)를 선택한다 */
export const selectUpgradeValue = Paw(part => createSelector(selectDFChar, dfchar => dfchar.upgradeValues[part]), equipParts)

/** 특정 부위의 강화보너스 수치(무기는 물/마공, 다른장비는 스탯)를 선택한다 */
export const selectUpgradeValue2 = createSelector(
  selectDFChar,
  partExposer<EquipPart>(),
  (dfchar, part) => {
    return dfchar.upgradeValues[part]
  }
)

/** 특정 부위의 강화 효과를 선택한다. */
const selectUpgrade = Paw(part => createSelector(
  selectUpgradeValue[part],
  (value): AttrSource => {
    return {
      name: `강화[${part}]`,
      attrs: atx(part === "무기" ? "Atk" : "StatAll", value)
    }
  }
), equipParts)

/** 특정 부위의 강화 효과를 선택한다. */
const selectUpgrade2 = createSelector(
  partExposer<EquipPart>(),
  selectUpgradeValue2,
  (part, value) => {
    return {
      name: `${part} 강화`,
      attrs: atx(part === "무기" ? "Atk" : "StatAll", value)
    }
  }
)

/** 특정 부위의 마법봉인 효과를 선택한다. */
export const selectMagicProps = Paw(
  part => createSelector(
    selectClassAtype,
    selectItem[part],
    selectMagicPropNames[part],
    (atype, item, magicProps): AttrSource => {
      if (!item || !(magicProps?.length))
        return { name: `마법봉인[${part}]`, attrs: {} }
      const { level, rarity } = item
      const array = getMagicPropsAttrs(magicProps, atype, level, rarity, part)
      return {
        name: `마법봉인[${part}]`,
        attrs: combine(...array)
      }
    }
  ), magicPropsParts
)

/** 특정 부위의 마법봉인 효과를 선택한다. */
export const selectMagicProps2 = createSelector(
  partExposer<MagicPropsPart>(),
  selectClassAtype,
  selectItem2,
  selectMagicPropNames2,
  (part, atype, item, magicProps) => {
    if (!item || !(magicProps?.length)) return { name: `마법봉인[${part}]`, attrs: {} }
    const { level, rarity } = item
    const array = getMagicPropsAttrs(magicProps, atype, level, rarity, part)
    return {
      name: `마법봉인[${part}]`,
      attrs: combine(...array)
    }
  }
)

/** 특정 부위의 엠블렘 효과를 선택한다. */
export const selectEmblems = Paw(
  part => createSelector(
    selectItem[part],
    selectEmblemSpecs[part],
    (item, emblemSpecs) => {
      const maxEmblemCount = getMaxEmblemCount(item)
      const emblems = emblemSpecs.slice(0, maxEmblemCount).map(getEmblem)
      
      return emblems
    }
  )
, cardableParts)


/** 특정 부위의 엠블렘 효과를 선택한다. */
export const selectEmblems2 = createSelector(
  selectItem2,
  selectEmblemSpecs2,
  (item, emblemSpecs) => {
    const maxEmblemCount = getMaxEmblemCount(item)
    const emblems = emblemSpecs.slice(0, maxEmblemCount).map(getEmblem)

    return emblems
  }
)



/**
 * 어떤 한 장비 부의의 아이템 옵션, 업그레이드 보너스, 마법봉인, 엠블렘, 카드 옵션을 얻는다.  
 * 주 아이템이 없으면 강화, 카드, 마법봉인, 엠블렘 효과가 모두 무효가 된다. (이것들은 애초에 장비에 붙어있는 것이니까.)
 */
export const selectEquipPart = Paw(
  part => createSelector(
    selectItem[part],
    selectMagicProps[part],
    selectCard[part],
    selectEmblems[part],
    selectUpgrade[part],
    (item, magicProps, card, emblems, upgrade): AttrSource[] => {
      if (!item) return []
      return [item, upgrade, card, magicProps, ...emblems]
    }
  )
,equipParts)


/**
 * 어떤 한 장비 부의의 아이템 옵션, 업그레이드 보너스, 마법봉인, 엠블렘, 카드 옵션을 얻는다.  
 * 주 아이템이 없으면 강화, 카드, 마법봉인, 엠블렘 효과가 모두 무효가 된다. (이것들은 애초에 장비에 붙어있는 것이니까.)
 */
export const selectEquipPart2:
(state: V5State, charID: V5State["currentID"], part: EquipPart) =>  AttrSource[]
 = createSelector(
  selectItem2,
  selectMagicProps2,
  selectCard2,
  selectEmblems2,
  selectUpgrade2,
  (item, magicProps, card, emblems, upgrade) => {
    if (!item) return []
    return [item, upgrade, card, magicProps, ...emblems]
  }
)

/** 10장비의 모든 아이템+강화+카드+엠블렘+마법봉인 효과를 선택한다. */
const selectWholeEquips = createSelector(
  equipParts.map(part => selectEquipPart[part]),
  (...srcs) => srcs.flat()
)

/** 10장비의 모든 아이템+강화+카드+엠블렘+마법봉인 효과를 선택한다. */
const selectWholeEquips2 = createSelector(
  equipParts.map(part => (state: V5State, charID: V5State["currentID"]) => selectEquipPart2(state, charID, part)),
  (...srcs) => srcs.flat()
)

/** 현재 완성된 장비세트들을 얻는다. */
export const selectEquipISets = createSelector(
  equipParts.map(part => selectItem[part]),
  getActiveISets
)

/** 현재 완성된 장비세트들을 얻는다. */
export const selectEquipISets2 = createSelector(
  equipParts.map(part => (state: V5State, charID: V5State["currentID"]) => selectItem2(state, charID, part)),
  getActiveISets
)


/** 현재 착용중인 10부위 모든장비+카드+엠블렘+강화+마법봉인+세트 효과를 모두 선택한다.
 *  **(조건부 효과는 활성여부에 상관없이 모두 배제한다.)** */
export const selectEquips = createSelector(
  selectWholeEquips,
  selectEquipISets,
  (srcs, isets) => {
    const sourceList: AttrSource[] = [ ...srcs, ...isets ]
    return sourceList
  }
)

/** 현재 착용중인 10부위 모든장비+카드+엠블렘+강화+마법봉인+세트 효과를 모두 선택한다.
 *  **(조건부 효과는 활성여부에 상관없이 모두 배제한다.)** */
export const selectEquips2 = createSelector(
  selectWholeEquips2,
  selectEquipISets2,
  (srcs, isets) => {
    const sourceList: AttrSource[] = [ ...srcs, ...isets ]
    return sourceList
  }
)

