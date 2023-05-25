import { createSelector } from '@reduxjs/toolkit'

import { combine } from '../../attrs'
import { avatarParts, getAvatarAttr, makeAvatarSet, rareSet, UncommonSet } from '../../avatar'
import { selectDFChar } from './baseSelectors'

/** 지금 착용중인 레어 아바타의 수를 선택한다. */
export const selectRareAvatarCount = createSelector(
  selectDFChar,
  (dfchar) => avatarParts
    .map(part => dfchar.avatars[part])
    .reduce((n, rarity) => rarity === "Rare" ? n + 1 : n, 0)
)

/** 지금 착용중인 언커먼 아바타의 수를 선택한다. */
export const selectUncommonAvatarCount = createSelector(
  selectDFChar,
  (dfchar) => avatarParts
    .map(part => dfchar.avatars[part])
    .reduce((n, rarity) => rarity === "Uncommon" ? n + 1 : n, 0)
)

/** 지금 착용중인 아바타 8부위 효과를 선택한다. */
export const selectWearAvatarsCombined = createSelector(
  selectDFChar,
  (dfchar) => ({
    name: "아바타 (모든부위 효과)",
    attrs: combine(...avatarParts.map(p => getAvatarAttr(p, dfchar.avatars[p])))
  })
)

/** 지금 착용중인 레어아바타 세트효과를 선택한다. */
export const selectRareAvatarSetActive = createSelector(
  selectRareAvatarCount,
  makeAvatarSet(rareSet, "레어아바타 세트효과")
)

/** 지금 착용중인 상급아바타 세트효과를 선택한다. */
export const selectUncommonAvatarSetActive = createSelector(
  selectUncommonAvatarCount,
  makeAvatarSet(UncommonSet, "상급아바타 세트효과")
)
