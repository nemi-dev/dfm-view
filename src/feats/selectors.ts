import { createSelector } from "@reduxjs/toolkit"
import { atx, combine, whatElType } from "../attrs"
import type { RootState } from "./store"
import { getActiveISetAttrs, getArmorBase, getItem, equipParts, getActiveBranch, getActiveGives, getActiveExclusive, getBlessing, isArmorPart, magicPropsParts, cardableParts, countISetsFromSupport } from "../items"
import { getEmblem } from "../emblem"
import { getMagicPropsAttrs } from "../magicProps"
import { percent_inc_mul } from "../utils"
import { selectGuilds } from "./guildSelectors"
import memoizee from "memoizee"
import { avatarParts, rareSet, UncommonSet, getAvatarAttr } from "../avatar"
import { whois } from "../dfclass"


/** Redux Selector를 무진장 찍어낸다 */
function Noot2<T, P extends WholePart>(func: ($p: P) => (s: RootState)=> T, parts: (P[] | readonly P[])): { [k in P]: (state: RootState) => T } {
  const _o: any = {}
  parts.forEach(part => _o[part] = func(part))
  return _o
}

/** 내 이름을 선택한다. */
export const selectMyName = (state: RootState) => state.Profile.myName

/** 내 직업을 선택한다 */
export const selectMyDFClass = (state: RootState) => whois(state.Profile.dfclass)

/** 내 공격타입을 선택한다 */
export const selectAtype = (state: RootState) => state.Profile.atype

/** 특정 부위에 장착중인 아이템을 선택한다 */
export const selectItem = Noot2(part => state => getItem(state.Item[part]), [...equipParts, "칭호", "오라", "무기아바타", "봉인석", "크리쳐"])

/** 특정 부위의 아이템에 바른 카드를 선택한다 */
export const selectCard = Noot2(part => state =>(getItem(state.Card[part])), cardableParts)

/** 특정 부위의 아이템에 박은 엠블렘 스펙을 모두 선택한다 */
export const selectEmblemSpecs = Noot2(part => state => state.Emblem[part], cardableParts)

/** 특정 부위 아이템의 마법봉인 이름을 선택한다 */
export const selectMagicPropNames = Noot2(
  part => state => state.MagicProps[part],
  magicPropsParts
)

/** 특정 부위의 "내가 선택한" 방어구 재질을 선택한다 */
export const selectCustomMaterial = Noot2(
  part => state => isArmorPart(part)? state.Material[part] : null,
  equipParts
)

/** 특정 부위의 강화보너스 수치(무기는 물/마공, 다른장비는 스탯)를 선택한다 */
export const selectUpgrade = Noot2( part => state => state.Upgrade[part], equipParts )

/** 특정 부위의 방어구 재질 아이템을 선택한다 */
export const selectArmorBase = Noot2(
  part => createSelector(
    selectItem[part],
    selectCustomMaterial[part],
    (item, customMaterial) => {
      if (!isArmorPart(part)) return {} as DFItem
      const { level, rarity, material = customMaterial } = item
      return getArmorBase(level, rarity, material, part)
    }
  ), equipParts
)

/** 특정 부위의 마법봉인 효과를 선택한다. */
export const selectMagicProps = Noot2(
  part => createSelector(
    selectAtype,
    selectItem[part],
    selectMagicPropNames[part],
    (atype, item, magicProps) => {
      if (!item || !(magicProps?.length)) return {}
      const { level, rarity } = item
      const array = getMagicPropsAttrs(magicProps, atype, level, rarity, part)
      return combine(...array)
    }
  ), magicPropsParts
)

/**
 * 주어진 아이템에서 "내가 체크한" 조건부 옵션들을 배열로 얻는다.
 * @param iii 아이템일 수도 있고, 세트일 수도 있다.
 */
function activeOptionalSelector(iii: ComplexAttrSource, state: RootState) {
  return [
    ...getActiveBranch(iii, state.Choice.branches),
    ...getActiveGives(iii, state.Choice.gives),
    ...getActiveExclusive(iii, state.Choice.exclusives)
  ]
}

export const selectActiveConds = Noot2(
  part => state => {
    const item = getItem(state.Item[part])
    return activeOptionalSelector(item, state)
  }, equipParts
)



/**
 * 어떤 한 장비 부의의 아이템 옵션, 업그레이드 보너스, 마법봉인, 엠블렘, 카드 옵션을 얻는다.  
 * (조건부 옵션은 완전히 배제한다.)
 */
export const selectPartAttrsNoCond = Noot2(
  part => createSelector(
    selectItem[part],
    selectMagicProps[part],
    selectCard[part],
    selectEmblemSpecs[part],
    selectArmorBase[part],
    selectUpgrade[part],
    (item, magicProps, card, emblems, armorbase, upgrade) => {
      const upgradeAttr = atx(part === "무기"? "Atk" : "Stat", upgrade)
      return combine(item.attrs, armorbase.attrs, upgradeAttr, magicProps, ...emblems.map(getEmblem), card?.attrs)
    }
  ), equipParts
)

/** 어떤 한 장비 부의의 아이템 옵션, 업그레이드 보너스, 마법봉인, 엠블렘, 카드 옵션, 활성화시킨 조건부 옵션을 얻는다. */
export const selectPartAttrs = Noot2(
  part => createSelector(
  selectPartAttrsNoCond[part],
  selectActiveConds[part],
  (attrs, activeOption) => {
    return combine(attrs, ...activeOption.map(n => n.attrs))
  }), equipParts
)

/** 10장비의 모든 아이템+카드+엠블렘+마법봉인+강화 효과를 선택한다.  
 * **(조건부 효과는 활성여부에 상관없이 모두 배제한다.)** */
const selectWholePartAttrsNoCond = createSelector(
  equipParts.map(part => selectPartAttrsNoCond[part]),
  combine
)

/** 10장비의 모든 아이템+카드+엠블렘+마법봉인+강화+활성화된 조건부옵션 효과를 선택한다. */
export const selectWholePartAttrs = createSelector(
  equipParts.map(part => selectPartAttrs[part]),
  combine
)

/** 현재 착용한 장비들로부터 활성화되는 모든 세트를 얻는다. */
export const selectISets = createSelector(
  equipParts.map(part => selectItem[part]),
  (...items) => {
    const isets = countISetsFromSupport(...items)
    return getActiveISetAttrs(isets)
  }
)


/** 현재 착용중인 10부위 모든장비+카드+엠블렘+강화+마법봉인+세트 효과를 모두 선택한다.  
 *  **(조건부 효과는 활성여부에 상관없이 모두 배제한다.)** */
export const selectEquipsNoConds = createSelector(
  selectWholePartAttrsNoCond,
  selectISets,
  (attrs, isets) => {
    const isetattrs = isets.map(ii => ii.attrs)
    return combine( attrs, ...isetattrs )
  }
)


/** 지금 착용한 장비로부터 오는 모든 장비 효과, 장비에 바른 카드 효과, 엠블렘 효과, 강화 효과, 마법봉인 효과, 세트 효과 및 이들 중에서 내가 체크한 조건부 효과를 싸그리 긁어모은다. */
export function selectEquips(state: RootState) {

  const isets = selectISets(state)
  const isetattrs = isets.map(ii => ii.attrs)
  const J = isets.flatMap(ii => activeOptionalSelector(ii, state).map(n => n.attrs))
    
  return combine(
    ...equipParts.map(part => selectPartAttrs[part](state)),
    ...isetattrs,
    ...J
  )
}

export const selectArtifact = memoizee(
  (color: "Red" | "Green" | "Blue") => (state: RootState) => getItem(state.Item["아티팩트"][color])
, { primitive: true })

/** 지금 장착 중인 아티팩트를 얻는다. */
export function selectArtifacts(state: RootState) {
  const { Red: redName, Green: greenName, Blue: blueName } = state.Item["아티팩트"]
  return {
    Red: getItem(redName), Green: getItem(greenName), Blue: getItem(blueName)
  }
}


/** 크리쳐 효과 + 크리쳐 스킬 효과 + 아티팩트 효과 를 얻는다. */
export function selectCreatures(state: RootState): BaseAttrs {
  const
    stat = state.CreatureProp.CreatureStat,
    stat_arti = state.CreatureProp.RedPropsValue,
    atk = state.CreatureProp.BluePropsValue,
    el_all = state.CreatureProp.GreenPropsEl
  return {
    strn: stat + stat_arti,
    intl: stat + stat_arti,
    vit: stat,
    psi: stat,
    ...atx("Atk", atk),
    ...atx("El", el_all)
  }
}



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
    const isets = countISetsFromSupport(rune, ...spells)
    return getActiveISetAttrs(isets)
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
  const conds = activeOptionalSelector(dftitle, state)
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

/** 업적달성레벨로 얻는 보너스 효과를 얻는다.. */
export const selectAchievementAttrs = (state: RootState) =>
  atx("Stat", state.Profile.achieveLevel * 7 - 2)


/** 장비 + 아바타 + 크리쳐 + 마력결정 + 성안의봉인 + 길드 + 업적보너스 (조건부옵션 포함, 보정값 제외) */
export const selectMeNoCal = createSelector(
  selectEquips, selectWholeAvatarAttrs, selectCreatures, selectTonics, selectCracksAll, selectGuilds,
  selectAchievementAttrs,
  (e, av, c, t, cr, g, ach) => combine(e, av, c, t, cr, g, ach)
)

/**
 * 장비 + 아바타 + 크리쳐 + 마력결정 + 성안의봉인 + 길드 + 업적보너스 (조건부옵션 제외, 보정값 포함)
 * @todo 크리쳐 조건부옵션 On/Off 추가되면 그것도 고려할것
 * */
export const selectMeNoCond = createSelector(
  selectEquipsNoConds, selectWholeAvatarAttrsNoCond, selectCreatures, selectTonics, selectCracksAll, selectGuilds,
  selectAchievementAttrs,
  selectCalibrated,
  (e, av, c, t, cr, g, ach, cal) => combine(e, av, c, t, cr, g, ach, cal)
)

/** 장비 + 아바타 + 크리쳐 + 마력결정 + 성안의봉인 + 길드 (조건부옵션 포함, 보정값 포함) */
export const selectMe = createSelector(
  selectMeNoCal, selectCalibrated,
  (me, cal) => combine(me, cal)
)

export const selectMyFinalEltype = createSelector(
  selectMe,
  attrs =>  whatElType(attrs, attrs.eltype)
)




