import { createSelector } from "@reduxjs/toolkit"
import { combine } from "../../attrs"
import { RootState } from "../store"
import { getActiveISets, getItem, getBlessing } from "../../items"
import memoizee from "memoizee"
import { selectItem, selectMagicProps } from "./equipSelectors"

/** 특정 정수를 선택한다. */
export const selectSpell = memoizee(
  (index: number) => (state: RootState) => getItem(state.My.Item["정수"][index]),
  { primitive: true }
)

/** 현재 장착 중인 모든 정수를 선택한다. */
export function selectSpells(state: RootState) {
  return state.My.Item["정수"].map(getItem)
}

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
    if (!rune) return null
    return getBlessing(rune, ...spells)
  }
)

/** 성안의 봉인에서 오는 모든 효과를 얻는다. */
export const selectCracks = createSelector(
  selectItem["봉인석"],
  selectMagicProps["봉인석"],
  selectSpells,
  selectBlessing,
  selectCrackISet,
  (rune, mp, spells, blessing, isets) => {
    if (!rune) return {}
    return combine(
      rune.attrs,
      mp,
      ...spells.map((s) => s.attrs),
      blessing?.attrs,
      ...isets.map((s) => s.attrs)
    )
  }
)