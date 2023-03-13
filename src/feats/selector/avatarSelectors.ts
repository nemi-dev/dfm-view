import { createSelector } from "@reduxjs/toolkit"
import { combine } from "../../attrs"
import { RootState } from "../store"
import { getActiveCondyces } from "../../items"
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

/** 지금 착용중인 아바타로부터 아바타 세트 효과를 선택한다. */
export const selectAvatarSetAttr = createSelector(
  selectUncommonAvatarCount,
  selectRareAvatarCount,
  (uncommonCount, rareCount) => {
    const attrsArray: BaseAttrs[] = []
    for (const i in rareSet)
      if (Number(i) <= rareCount)
        attrsArray.push(rareSet[i])
    for (const i in UncommonSet)
      if (Number(i) <= uncommonCount)
        attrsArray.push(UncommonSet[i])
    return combine(...attrsArray)
  }
)

/** (칭호/오라/무기아바타 빼고) 아바타 효과 + 아바타세트 효과를 모두 선택한다. */
export function selectAvatarAttrs(state: RootState) {
  return combine(
    ...avatarParts.map(p => getAvatarAttr(p, state.My.Avatar[p])),
    selectAvatarSetAttr(state)
  )
}

/** 칭호+칭호에 박은 보주+엠블렘 효과를 선택한다. **(조건부효과 빠짐!)** */
export const selectDFTitleAttrsNoCond = createSelector(
  selectItem["칭호"],
  selectCard["칭호"],
  selectEmblemSpecs["칭호"],
  (item, card, emblem) => combine(item.attrs, card?.attrs, getEmblem(emblem[0]))
)

/** 칭호의 조건부 옵션들 중 내가 활성화한 것을 선택한다. */
export function selectDFTitleCondAttrs(state: RootState) {
  const dftitle = selectItem["칭호"](state)
  const conds = getActiveCondyces(dftitle, state.My.Choice)
  return combine(...conds.map(co => co.attrs))
}

/** 칭호+칭호에 박은 보주+엠블렘 효과를 선택한다. */
export const selectDFTitleAttrs = createSelector(
  selectDFTitleAttrsNoCond,
  selectDFTitleCondAttrs,
  (attrs, condAttrs) => {
    return combine(attrs, condAttrs)
  }
)

/** **(조건부 빼고)** 칭호+오라+무기아바타+다른 아바타 효과+아바타 세트효과를 모두 선택한다. */
export const selectWholeAvatarAttrsNoCond = createSelector(
  selectDFTitleAttrsNoCond,
  selectAvatarAttrs,
  selectItem["무기아바타"],
  selectItem["오라"],
  (dftitleAttrs, avatarAttrs, weaponAvatar, aura) => combine(dftitleAttrs, avatarAttrs, weaponAvatar.attrs, aura.attrs)
)

/** **(조건부 빼고)** 칭호+오라+무기아바타+다른 아바타 효과+아바타 세트효과를 모두 선택한다. */
export const selectWholeAvatarAttrs = createSelector(
  selectDFTitleAttrs,
  selectAvatarAttrs,
  selectItem["무기아바타"],
  selectItem["오라"],
  (dftitleAttrs, avatarAttrs, weaponAvatar, aura) => combine(dftitleAttrs, avatarAttrs, weaponAvatar.attrs, aura.attrs)
)
