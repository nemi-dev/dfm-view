import { createSelector } from "@reduxjs/toolkit"

import { avatarParts, rareSet, UncommonSet, getAvatarAttr } from "../avatar"
import { combine } from "../attrs"
import { getEmblem } from "../emblem"
import { getItem } from "../items"
import { RootState } from "./store"


export function selectRareAvatarCount(state: RootState) {
  const literals = avatarParts.map(part => state.Avatar[part])
  return literals.reduce((n, p) => p === "Rare" ? n + 1 : n, 0)
}

export function selectAvatarSetAttr(state: RootState) {
  const rareCount = selectRareAvatarCount(state)
  const UncommonCount = 8 - rareCount

  const attrsArray: BaseAttrs[] = []
  for (const i in rareSet) if (Number(i) <= rareCount) attrsArray.push(rareSet[i])
  for (const i in UncommonSet) if (Number(i) <= UncommonCount) attrsArray.push(UncommonSet[i])
  
  return combine(...attrsArray)
}

export function selectAura(state: RootState) {
  return getItem(state.Avatar["오라"])
}

export function selectDFTitle(state: RootState) {
  return getItem(state.Avatar["칭호"])
}

export function selectDFTitleCard(state: RootState) {
  return getItem(state.Avatar.card)
}

export function selectDFTitleEmblemSpec(state: RootState) {
  return state.Avatar.emblem
}

export const selectDFTitleAttrsAll = createSelector(
  selectDFTitle, selectDFTitleCard, selectDFTitleEmblemSpec,
  (dftitle, card, emblem) => combine(dftitle, card, getEmblem(emblem[0]))
)

export function selectWeaponAvatar(state: RootState) {
  return getItem(state.Avatar["무기아바타"])
}

export function selectAvatarAttrs(state: RootState) {
  return combine(
    ...avatarParts.map(p => getAvatarAttr(p, state.Avatar[p])),
    selectAvatarSetAttr(state)
  )
}

export const selectWholeAvatarAttrs = createSelector(
  selectDFTitleAttrsAll,
  selectAvatarAttrs,
  selectWeaponAvatar,
  selectAura,
  (dftitle, avatar, weaponAvatar, aura) => combine(dftitle, avatar, weaponAvatar, aura)
)
