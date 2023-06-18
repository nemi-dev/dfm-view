import { createSelector } from '@reduxjs/toolkit'

import {
  equipParts, getItem
} from '../../items'
import { selectDFChar } from './baseSelectors'

import type { RootState } from "../store"
import { getCurrentMainItem, getPartSource } from '../dfchar'
import memoizee from 'memoizee'

/** 세 번째 것을 그대로 뱉어내는 함수를 만든다. */
export function partExposer<T> () {
  return (_state: RootState, _dfcharID: RootState["currentID"], part: T ) => part
}


/** 특정 부위의 "내가 선택한" 방어구 재질을 선택한다 (해당 방어구재질이 고정되어있는지 여부는 고려하지 않는다.) */
export const selectCustomMaterial = createSelector(
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
export const selectUpgradeValue = createSelector(
  selectDFChar,
  partExposer<EquipPart>(),
  (dfchar, part) => dfchar.upgradeValues[part]
)

/** 특정 부위의 아이템에 바른 카드를 선택한다 */
export const selectCard = createSelector(
  selectDFChar,
  partExposer<CardablePart>(),
  (dfchar, part) => getItem(dfchar.cards[part])
)

/** 특정 부위 아이템의 마법봉인 이름을 선택한다. (장착 아이템 여부에 상관없이 3개 풀로 선택함) */
export const selectMagicPropNames = createSelector(
  selectDFChar,
  partExposer<MagicPropsPart>(),
  (dfchar, part) => dfchar.magicProps[part]
)

/** 특정 부위의 아이템에 박은 엠블렘 스펙을 모두 선택한다 */
export const selectEmblemSpecs = createSelector(
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
const selectEquipPart
 = createSelector(
  selectDFChar,
  partExposer<EquipPart>(),
  (dfchar, part) => getPartSource(dfchar, part)
)



/** 아티팩트 하나를 선택한다 */
export const selectArtifact = memoizee(
  (color: ArtifactColor) => createSelector(selectDFChar, dfchar => getItem(dfchar.items.아티팩트[color])),
{ primitive: true })
