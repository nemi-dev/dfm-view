import memoizee from 'memoizee'

import { createSelector } from '@reduxjs/toolkit'

import { getActiveISets, getBlessing, getItem } from '../../items'
import { selectItem, selectMagicProps } from './equipSelectors'
import { selectDFChar } from './selectors'

/** 특정 정수를 선택한다. */
export const selectSpell = memoizee(
  (index: number) => createSelector(selectDFChar, dfchar => getItem(dfchar.Item.정수[index])),
  { primitive: true }
)

/** 현재 장착 중인 모든 정수를 선택한다. */
export const selectSpells = createSelector(
  selectDFChar,
  (dfchar) => dfchar.Item.정수.map(getItem)
)

/** 현재 착용한 봉인석+정수로부터 활성화되는 모든 세트를 얻는다. */
export const selectCrackISet = createSelector(
  selectItem["봉인석"],
  selectSpells,
  (rune, spells) => {
    return getActiveISets(rune, ...spells)
  }
)

/** 현재 착용한 봉인석+정수로부터 활성화되는 가호를 얻는다. */
export const selectBlessing = createSelector(
  selectItem["봉인석"],
  selectSpells,
  (rune, spells) => {
    return getBlessing(rune, ...spells)
  }
)

/** 봉인석을 장착 중일 때, 봉인석+정수+활성화된 가호+세트를 선택한다.  
 * 봉인석이 없으면 모든게 무효화된다. */
export const selectCracks = createSelector(
  selectItem["봉인석"],
  selectMagicProps["봉인석"],
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
