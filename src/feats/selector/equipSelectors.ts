import { createSelector } from '@reduxjs/toolkit'

import { atx, combine } from '../../attrs'
import { getEmblem } from '../../emblem'
import {
  equipParts, getActiveISets, getBlessing, getItem, getMaxEmblemCount
} from '../../items'
import { getMagicPropsAttrs } from '../../magicProps'
import { selectClassAtype, selectDFChar } from './baseSelectors'

import type { RootState } from "../store"
import { getCurrentMainItem } from '../../dfchar'

/** 세 번째 것을 그대로 뱉어내는 함수를 만든다. */
function partExposer<T> () {
  return (_state: RootState, _dfcharID: RootState["currentID"], part: T ) => part
}




/** 특정 부위에 장착중인 아이템을 선택한다. */
export const selectItem2 = createSelector(
  selectDFChar,
  partExposer<MainItemSelector>(),
  getCurrentMainItem
)

/** 특정 부위의 강화보너스 수치(무기는 물/마공, 다른장비는 스탯)를 선택한다 */
export const selectUpgradeValue2 = createSelector(
  selectDFChar,
  partExposer<EquipPart>(),
  (dfchar, part) => {
    return dfchar.upgradeValues[part]
  }
)

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

/** 특정 부위의 아이템에 바른 카드를 선택한다 */
export const selectCard2 = createSelector(
  selectDFChar,
  partExposer<CardablePart>(),
  (dfchar, part) => {
    return getItem(dfchar.cards[part])
  }
)


/** 특정 부위 아이템의 마법봉인 이름을 선택한다. (장착 아이템 여부에 상관없이 3개 풀로 선택함) */
export const selectMagicPropNames2 = createSelector(
  selectDFChar,
  partExposer<MagicPropsPart>(),
  (dfchar, part) => {
    return dfchar.magicProps[part]
  }
)


/** 특정 부위의 마법봉인 효과를 선택한다. */
export const selectMagicProps2 = createSelector(
  partExposer<MagicPropsPart>(),
  selectClassAtype,
  // selectItem2,   // <= 이걸로 하면 TypeScript가 지랄발광을 한다.
  (state: V5State, id: V5State["currentID"], part: MagicPropsPart) => selectItem2(state, id, part),
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

/** 특정 부위의 "내가 선택한" 방어구 재질을 선택한다 (해당 방어구재질이 고정되어있는지 여부는 고려하지 않는다.) */
export const selectCustomMaterial2 = createSelector(
  selectDFChar,
  partExposer<ArmorPart>(),
  (dfchar, part) => {
    return dfchar.materials[part]
  }
)




/** 특정 부위의 아이템에 박은 엠블렘 스펙을 모두 선택한다 */
export const selectEmblemSpecs2 = createSelector(
  selectDFChar,
  partExposer<CardablePart>(),
  (dfchar, part) => {
    return dfchar.emblems[part] ?? []
  }
)

/** 특정 부위의 엠블렘 효과를 선택한다. */
export const selectEmblems2 = createSelector(
  // selectItem2,
  (state: V5State, id: V5State["currentID"], part: CardablePart) => selectItem2(state, id, part),
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
//@ts-ignore
export const selectEquipPart2
 = createSelector(
  (state: V5State, id: V5State["currentID"], part: EquipPart) => selectItem2(state, id, part),
  (state: V5State, id: V5State["currentID"], part: EquipPart) => selectUpgrade2(state, id, part),
  (state: V5State, id: V5State["currentID"], part: EquipPart) => selectCard2(state, id, part),
  (state: V5State, id: V5State["currentID"], part: EquipPart) => selectMagicProps2(state, id, part),
  (state: V5State, id: V5State["currentID"], part: EquipPart) => selectEmblems2(state, id, part),
  (item, upgrade, card, magicProps, emblems) => {
    if (!item) return []
    return [item, upgrade, card, magicProps, ...emblems]
  }
)

/** 10장비의 모든 아이템+강화+카드+엠블렘+마법봉인 효과를 선택한다. */
const selectWholeEquips2 = createSelector(
  equipParts.map(part => (state: V5State, charID: V5State["currentID"]) => selectEquipPart2(state, charID, part)),
  (...srcs) => srcs.flat()
)

/** 현재 완성된 장비세트들을 얻는다. */
export const selectEquipISets2 = createSelector(
  equipParts.map(part => (state: V5State, charID: V5State["currentID"]) => selectItem2(state, charID, part)),
  getActiveISets
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








/** 현재 장착 중인 모든 정수를 선택한다. */
export const selectSpells = createSelector(
  selectDFChar,
  (dfchar) => dfchar.items.정수.map(getItem)
)

const selectRune = (state: RootState, id: RootState["currentID"]) => selectItem2(state, id, "봉인석")

/** 현재 착용한 봉인석+정수로부터 활성화되는 모든 세트를 얻는다. */
export const selectCrackISet = createSelector(
  selectRune,
  selectSpells,
  (rune, spells) => {
    return getActiveISets(rune, ...spells)
  }
)

/** 현재 착용한 봉인석+정수로부터 활성화되는 가호를 얻는다. */
export const selectBlessing = createSelector(
  selectRune,
  selectSpells,
  (rune, spells) => {
    return getBlessing(rune, ...spells)
  }
)

/** 봉인석을 장착 중일 때, 봉인석+정수+활성화된 가호+세트를 선택한다.  
 * 봉인석이 없으면 모든게 무효화된다. */
export const selectCracks = createSelector(
  selectRune,
  (state: RootState, id: RootState["currentID"]) => selectMagicProps2(state, id, "봉인석"),
  selectSpells,
  selectBlessing,
  selectCrackISet,
  (rune, magicProps, spells, blessing, isets) => {
    if (!rune) return []
    return [
      rune,
      magicProps,
      ...spells,
      blessing,
      ...isets
    ]
  }
)
