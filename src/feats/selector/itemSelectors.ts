import { createSelector } from '@reduxjs/toolkit'

import { getEmblem } from '../../emblem'
import {
  equipParts, getActiveISets, getItem, getMaxEmblemCount
} from '../../items'
import { selectDFChar } from './baseSelectors'

import type { RootState } from "../store"
import { getArtifactProps, getArtifacts, getCreature, getCurrentMainItem, getPartSource } from '../dfchar'
import memoizee from 'memoizee'

/** 세 번째 것을 그대로 뱉어내는 함수를 만든다. */
function partExposer<T> () {
  return (_state: RootState, _dfcharID: RootState["currentID"], part: T ) => part
}


/** 특정 부위의 "내가 선택한" 방어구 재질을 선택한다 (해당 방어구재질이 고정되어있는지 여부는 고려하지 않는다.) */
export const selectCustomMaterial2 = createSelector(
  selectDFChar,
  partExposer<ArmorPart>(),
  (dfchar, part) => dfchar.materials[part]
)


/** 특정 부위에 장착중인 아이템을 선택한다. */
export const selectMainItem = createSelector(
  selectDFChar,
  partExposer<MainItemSelector>(),
  getCurrentMainItem
)

/** 특정 부위의 강화보너스 수치(무기는 물/마공, 다른장비는 스탯)를 선택한다 */
export const selectUpgradeValue2 = createSelector(
  selectDFChar,
  partExposer<EquipPart>(),
  (dfchar, part) => dfchar.upgradeValues[part]
)

/** 특정 부위의 아이템에 바른 카드를 선택한다 */
export const selectCard2 = createSelector(
  selectDFChar,
  partExposer<CardablePart>(),
  (dfchar, part) => getItem(dfchar.cards[part])
)

/** 특정 부위 아이템의 마법봉인 이름을 선택한다. (장착 아이템 여부에 상관없이 3개 풀로 선택함) */
export const selectMagicPropNames2 = createSelector(
  selectDFChar,
  partExposer<MagicPropsPart>(),
  (dfchar, part) => dfchar.magicProps[part]
)

/** 특정 부위의 아이템에 박은 엠블렘 스펙을 모두 선택한다 */
export const selectEmblemSpecs2 = createSelector(
  selectDFChar,
  partExposer<CardablePart>(),
  (dfchar, part) => {
    return dfchar.emblems[part] ?? []
  }
)


/**
 * 어떤 한 부의의 아이템 옵션, 업그레이드 보너스, 마법봉인, 엠블렘, 카드 옵션을 얻는다.  
 * 주 아이템이 없으면 강화, 카드, 마법봉인, 엠블렘 효과가 모두 무효가 된다.
 */
const selectEquipPart2
 = createSelector(
  selectDFChar,
  partExposer<EquipPart>(),
  (dfchar, part) => getPartSource(dfchar, part)
)

/** 10장비의 모든 아이템+강화+카드+엠블렘+마법봉인 효과를 선택한다. */
export const selectWholeEquips2 = createSelector(
  equipParts.map(part => (state: RootState, charID: RootState["currentID"]) => selectEquipPart2(state, charID, part)),
  (...srcs) => srcs.flatMap(({ item, upgrade, card, magicProps, emblems }) => {
    return [item, upgrade, card, magicProps, ...emblems].filter(u => u != null)
  })
)

/** 현재 완성된 장비세트들을 얻는다. */
export const selectEquipISets2 = createSelector(
  equipParts.map(part => (state: RootState, charID: RootState["currentID"]) => selectMainItem(state, charID, part)),
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

/** 성안의 봉인 효과를 선택한다. */
export const selectCracks = createSelector(
  selectDFChar,
  (dfchar) => {
    const source = getPartSource(dfchar, "봉인석")
    if (!source) return []
    const { item, magicProps, spells, blessing } = source
    const isets = getActiveISets(item, ...spells)
    return [
      item,
      magicProps,
      ...spells,
      blessing,
      ...isets
    ]
  }
)








/** 아티팩트 하나를 선택한다 */
export const selectArtifact = memoizee(
  (color: ArtifactColor) => createSelector(selectDFChar, dfchar => getItem(dfchar.items.아티팩트[color])),
{ primitive: true })


/** 크리쳐 + 크리쳐 스탯을 선택한다. */
const selectCreature = createSelector(
  selectDFChar, getCreature
)

/** 아티팩트를 모두 선택한다. */
const selectArtifacts = createSelector(
  selectDFChar, getArtifacts
)

/** 아티팩트 옵션을 모두 선택한다. */
const selectArtifactProps = createSelector(
  selectDFChar, getArtifactProps
)

/** 크리쳐 + 아티팩트 + 아티팩트 옵션 + 크리쳐 세트를 선택한다. */
export const selectCreatureSource = createSelector(
  
  selectCreature,
  selectArtifacts,
  selectArtifactProps,
  (item, artifacts, artifactProps) => {
    const isets = getActiveISets(item, ...artifacts)
    return [
      item,
      ...artifacts,
      ...artifactProps,
      ...isets
    ]
  }
)

