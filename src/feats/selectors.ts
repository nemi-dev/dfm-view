import { createSelector } from "@reduxjs/toolkit"
import { atx, combine, whatElType } from "../attrs"
import type { RootState } from "./store"
import { getActiveISets, getItem, getBlessing, getActiveCondyces } from "../items"
import { getEmblem } from "../emblem"
import { percent_inc_mul } from "../utils"
import { selectGuilds } from "./guildSelectors"
import memoizee from "memoizee"
import { avatarParts, rareSet, UncommonSet, getAvatarAttr } from "../avatar"
import { selectItem, selectMagicProps, selectCard, selectEmblemSpecs, selectEquips, selectEquipsNoConds } from "./selector/equipSelectors"
import { selectAchievementAttrs } from "./selector/selfSelectors"
import { selectCreatures, selectCreaturesNoCond } from "./selector/creatureSelectors"

/** 마력결정 스탯보너스를 모두 얻는다. */
export function selectTonics(state: RootState): BaseAttrs {
  const { el_all, hpmax, mpmax, strn_intl, vit_psi, def_ph, def_mg, Crit, Accu } = state.Tonic

  return {
    strn: strn_intl,
    intl: strn_intl,
    vit: vit_psi,
    psi: vit_psi,
    Accu,
    ...atx("Crit", Crit),
    ...atx("El", el_all),
    def_ph,
    def_mg,
    hpmax,
    mpmax
  }

}











/** 특정 정수를 선택한다. */
export const selectSpell = memoizee((index: number) => (state: RootState) => getItem(state.Item["정수"][index]),
{ primitive: true })


/** 현재 장착 중인 모든 정수를 선택한다. */
export function selectSpells(state: RootState) {
  return state.Item["정수"].map(getItem)
}

/** 현재 착용한 봉인석+정수로부터 활성화되는 모든 세트 옵션을 얻는다. */
export const selectCrackISetAttrs = createSelector(
  selectItem["봉인석"], selectSpells,
  (rune, spells) => {
    return getActiveISets(rune, ...spells)
  }
)

/** 현재 착용한 봉인석+정수로부터 활성화되는 가호를 얻는다. */
export const selectBlessing = createSelector(
  selectItem["봉인석"], selectSpells,
  (rune, spells) => getBlessing(rune, ...spells)
)

/** 성안의 봉인에서 오는 모든 효과를 얻는다. */
export const selectCracksAll = createSelector(
  selectItem["봉인석"],
  selectMagicProps["봉인석"],
  selectSpells,
  selectBlessing,
  selectCrackISetAttrs,
  (rune, mp, spells, blessing, isetattr) => {
    return combine(rune.attrs, mp, ...spells.map(s => s.attrs), blessing[1], ...isetattr.map(s => s.attrs))
  }
)





/** 지금 착용중인 레어 아바타의 수를 선택한다. */
export function selectRareAvatarCount(state: RootState) {
  return avatarParts
  .map(part => state.Avatar[part])
  .reduce((n, rarity) => rarity === "Rare" ? n + 1 : n, 0)
}

/** 지금 착용중인 언커먼 아바타의 수를 선택한다. */
export function selectUncommonAvatarCount(state: RootState) {
  return avatarParts
  .map(part => state.Avatar[part])
  .reduce((n, rarity) => rarity === "Uncommon" ? n + 1 : n, 0)
}

/** 지금 착용중인 아바타로부터 아바타 세트 효과를 선택한다. */
export const selectAvatarSetAttr = createSelector(
  selectUncommonAvatarCount,
  selectRareAvatarCount,
  (uncommonCount, rareCount) => {
    const attrsArray: BaseAttrs[] = []
    for (const i in rareSet) if (Number(i) <= rareCount) attrsArray.push(rareSet[i])
    for (const i in UncommonSet) if (Number(i) <= uncommonCount) attrsArray.push(UncommonSet[i])
    return combine(...attrsArray)
  }
)

/** (칭호/오라/무기아바타 빼고) 아바타 효과 + 아바타세트 효과를 모두 선택한다. */
export function selectAvatarAttrs(state: RootState) {
  return combine(
    ...avatarParts.map(p => getAvatarAttr(p, state.Avatar[p])),
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
export function  selectDFTitleCondAttrs(state: RootState) {
  const dftitle = selectItem["칭호"](state)
  const conds = getActiveCondyces(dftitle, state.Choice)
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
  (dftitleAttrs, avatarAttrs, weaponAvatar, aura) =>
    combine(dftitleAttrs, avatarAttrs, weaponAvatar.attrs, aura.attrs)
)

/** **(조건부 빼고)** 칭호+오라+무기아바타+다른 아바타 효과+아바타 세트효과를 모두 선택한다. */
export const selectWholeAvatarAttrs = createSelector(
  selectDFTitleAttrs,
  selectAvatarAttrs,
  selectItem["무기아바타"],
  selectItem["오라"],
  (dftitleAttrs, avatarAttrs, weaponAvatar, aura) =>
    combine(dftitleAttrs, avatarAttrs, weaponAvatar.attrs, aura.attrs)
)








/** 스탯을 보정한 값만을 가져온다. */
export function selectCalibrated(state: RootState): BaseAttrs {
  const sk_inc = state.Calibrate.sk_inc.reduce(percent_inc_mul, 0)
  return { ...state.Calibrate, sk_inc }
}



/** 장비 + 아바타 + 크리쳐 + 마력결정 + 성안의봉인 + 길드 + 업적보너스 (조건부옵션 포함, 보정값 제외) */
export const selectMeNoCal = createSelector(
  selectEquips, selectWholeAvatarAttrs, selectCreatures, selectTonics, selectCracksAll, selectGuilds,
  selectAchievementAttrs,
  (e, av, c, t, cr, g, ach) => combine(e, av, c, t, cr, g, ach)
)

/**
 * 장비 + 아바타 + 크리쳐 + 마력결정 + 성안의봉인 + 길드 + 업적보너스 + 보정값 (조건부옵션 제외)
 * */
export const selectMeNoCond = createSelector(
  selectEquipsNoConds, selectWholeAvatarAttrsNoCond, selectCreaturesNoCond, selectTonics, selectCracksAll, selectGuilds,
  selectAchievementAttrs,
  selectCalibrated,
  (e, av, c, t, cr, g, ach, cal) => combine(e, av, c, t, cr, g, ach, cal)
)

/**  장비 + 아바타 + 크리쳐 + 마력결정 + 성안의봉인 + 길드 + 업적보너스 + 보정값 (조건부옵션 포함) */
export const selectMe = createSelector(
  selectMeNoCal, selectCalibrated,
  (me, cal) => combine(me, cal)
)

export const selectMyFinalEltype = createSelector(
  selectMe,
  attrs =>  whatElType(attrs, attrs.eltype)
)




