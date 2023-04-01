import { createSelector } from "@reduxjs/toolkit"
import { combine } from "../../attrs"
import { RootState } from "../store"
import { createActiveCondyces } from "../../items"
import { getEmblem } from "../../emblem"
import { avatarParts, rareSet, UncommonSet, getAvatarAttr } from "../../avatar"
import { selectItem, selectCard, selectEmblemSpecs } from "./equipSelectors"

/** 지금 착용중인 레어 아바타의 수를 선택한다. */
export function selectRareAvatarCount(state: RootState) {
  return avatarParts
    .map(part => state.My.Avatar[part])
    .reduce((n, rarity) => rarity === "Rare" ? n + 1 : n, 0)
}

/** 지금 착용중인 언커먼 아바타의 수를 선택한다. */
export function selectUncommonAvatarCount(state: RootState) {
  return avatarParts
    .map(part => state.My.Avatar[part])
    .reduce((n, rarity) => rarity === "Uncommon" ? n + 1 : n, 0)
}

/** 지금 착용중인 아바타 8부위 효과를 선택한다. */
export function selectWearAvatarSource(state: RootState): AttrSource {
  return {
    name: "아바타",
    attrs: combine(...avatarParts.map(p => getAvatarAttr(p, state.My.Avatar[p])))
  } as AttrSource
}

/** 지금 착용중인 아바타로부터 아바타 세트 효과를 선택한다. */
export const selectAvatarSet = createSelector(
  selectUncommonAvatarCount,
  selectRareAvatarCount,
  (uncommonCount, rareCount) => {
    const name = ["아바타 세트 효과"]
    if (rareCount > 0) name.push(`레어[${rareCount}]`)
    if (uncommonCount > 0) name.push(`언커먼[${uncommonCount}]`)
    const attrsArray: BaseAttrs[] = []
    for (const i in rareSet)
      if (Number(i) <= rareCount)
        attrsArray.push(rareSet[i])
    for (const i in UncommonSet)
      if (Number(i) <= uncommonCount)
        attrsArray.push(UncommonSet[i])
    return {
      name: name.join(" "),
      attrs: combine(...attrsArray)
    } as AttrSource
  }
)

/** 마을에서의 칭호 효과를 선택한다. */
export const selectDFTitleTown = createSelector(
  selectItem["칭호"],
  selectCard["칭호"],
  selectEmblemSpecs["칭호"],
  (dftitle, card, emblem): AttrSource[] => {
    if (!dftitle) return []
    return [dftitle, card, getEmblem(emblem[0])]
  }
)

/** 칭호의 조건부 옵션들 중 내가 활성화한 효과를 선택한다. */
export const selectDFTitleCondyce = createSelector(
  selectItem["칭호"],
  (state: RootState) => state.My.Choice,
  (dftitle, choice) => {
    if (!dftitle) return []
    return createActiveCondyces(dftitle, choice)
  }
)

/** 칭호+칭호에 박은 보주+엠블렘 효과+칭호의 활성화된 조건부 효과를 선택한다. */
export const selectDFTitle = createSelector(
  selectDFTitleTown,
  selectDFTitleCondyce,
  (dftitle, condyce): AttrSource[] => {
    return [ ...dftitle, ...condyce ]
  }
)

/** **(조건부 빼고)** 칭호+오라+무기아바타+다른 아바타 효과+아바타 세트효과를 모두 선택한다. */
export const selectWholeAvatarAttrsTown = createSelector(
  selectDFTitleTown,
  selectWearAvatarSource,
  selectAvatarSet,
  selectItem["무기아바타"],
  selectItem["오라"],
  (dftitle, wears, aset, weaponAvatar, aura) => 
  combine(
    ...dftitle.map(i => i?.attrs),
    wears.attrs,
    aset.attrs,
    weaponAvatar?.attrs,
    aura?.attrs
  )
)

/** 칭호+오라+무기아바타+다른 아바타 효과+아바타 세트효과를 모두 선택한다. */
export const selectWholeAvatarAttrs = createSelector(
  selectDFTitle,
  selectWearAvatarSource,
  selectAvatarSet,
  selectItem["무기아바타"],
  selectItem["오라"],
  (dftitle, wears, aset, weaponAvatar, aura) => 
  combine(
    ...dftitle.map(i => i?.attrs),
    wears.attrs,
    aset.attrs,
    weaponAvatar?.attrs,
    aura?.attrs
  )
)
