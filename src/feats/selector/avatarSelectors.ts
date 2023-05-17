import { createSelector } from "@reduxjs/toolkit"
import { combine } from "../../attrs"
import { RootState } from "../store"
import { avatarParts, rareSet, UncommonSet, getAvatarAttr } from "../../avatar"
import { selectItem, selectCard, selectEmblems } from "./equipSelectors"
import { selectDFChar } from "./selectors"

/** 지금 착용중인 레어 아바타의 수를 선택한다. */
export const selectRareAvatarCount = createSelector(
  selectDFChar,
  (dfchar) => avatarParts
    .map(part => dfchar.Avatar[part])
    .reduce((n, rarity) => rarity === "Rare" ? n + 1 : n, 0)
)

/** 지금 착용중인 언커먼 아바타의 수를 선택한다. */
export const selectUncommonAvatarCount = createSelector(
  selectDFChar,
  (dfchar) => avatarParts
    .map(part => dfchar.Avatar[part])
    .reduce((n, rarity) => rarity === "Uncommon" ? n + 1 : n, 0)
)

const asetMaker = (catalog: Record<number, BaseAttrs>, name: string) => 
(count: number): (AttrSource | undefined) => {
  if (count > 0) {
    const r = Object.keys(catalog).filter(i => (Number(i) <= count)).map(i => catalog[Number(i)])
    if (r.length > 0) 
    return {
      name : `${name} [${count}]`,
      attrs: combine(...r)
    }
  }
  return undefined
}

/** 지금 착용중인 아바타 8부위 효과를 선택한다. */
export const selectWearAvatarsCombined = createSelector(
  selectDFChar,
  (dfchar) => ({
    name: "아바타 (모든부위 효과)",
    attrs: combine(...avatarParts.map(p => getAvatarAttr(p, dfchar.Avatar[p])))
  })
)

/** 지금 착용중인 레어아바타 세트효과를 선택한다. */
export const selectRareAvatarSetActive = createSelector(
  selectRareAvatarCount,
  asetMaker(rareSet, "레어아바타 세트효과")
)

/** 지금 착용중인 상급아바타 세트효과를 선택한다. */
export const selectUncommonAvatarSetActive = createSelector(
  selectUncommonAvatarCount,
  asetMaker(UncommonSet, "상급아바타 세트효과")
)

/** 칭호를 장착 중일 때, 그 칭호 + 칭호에 박은 보주 + 엠블렘을 선택한다. */
export const selectDFTitleTown = createSelector(
  selectItem["칭호"],
  selectCard["칭호"],
  selectEmblems["칭호"],
  (dftitle, card, emblem): AttrSource[] => {
    if (!dftitle) return []
    return [dftitle, card, ...emblem]
  }
)


/** 칭호+오라+무기아바타+다른 아바타 효과+아바타 세트효과를 모두 선택한다. */
export const selectAvatars = createSelector(
  selectDFTitleTown,
  selectWearAvatarsCombined,
  selectRareAvatarSetActive,
  selectUncommonAvatarSetActive,
  selectItem["무기아바타"],
  selectItem["오라"],
  (dftitle, wears, asetRare, asetUnco, weaponAvatar, aura) => 
  [
    ...dftitle,
    aura,
    weaponAvatar,
    wears,
    asetRare,
    asetUnco
  ]
)
