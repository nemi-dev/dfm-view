import { collectSpecial, combine, elMap2, percent_inc_mul, whatElType } from "./attrs"
import { RootState } from "./feats/store"
import { getActiveISetAttrs, getArmorBase, countISetsFrom, getItem, armorParts, equipParts, getActiveBranch, isActiveGives, getActiveExclusive, getBlessing, isArmorPart } from "./items"
import { getEmblem } from "./emblem"
import { getMagicPropsAttrs } from "./magicProps"
import { createSelector } from "@reduxjs/toolkit"
import { explode } from "./utils"
import { selectWholeAvatarAttrs } from "./feats/avatarSelectors"



function noot<T>(func: (part: EquipPart, s: RootState) => T): { [k in EquipPart]: (state: RootState) => T } {
  const _o = {}
  equipParts.forEach(part => _o[part] = func.bind(null, part))
  return _o as any
}

function noot2<T>(func: (part: EquipPart) => ((s: RootState) => T)): { [k in EquipPart]: (state: RootState) => T } {
  const _o = {}
  equipParts.forEach(part => _o[part] = func(part))
  return _o as any
}

export const selectPart: { [k in EquipPart]: (state: RootState) => k extends ArmorPart? ArmorPartType : EquipPartType }
= noot((part, state) => state.Equips[part]) as any

export const selectItem = noot((part, state) => getItem(state.Equips[part].name))

export const selectMagicProps = noot2(
  part => createSelector(
    selectPart[part],
    (equipPart) => {
      const { name, magicProps } = equipPart
      if (!name || !magicProps || !magicProps.length) return {} 
      const { level, rarity } = getItem(name)
      const _magicProps = magicProps.slice(rarity === "Epic" ? 0 : 1)
      const array = _magicProps.map((name, index) => getMagicPropsAttrs(name, part, level, rarity, index == 0))
      return combine(...array)
    }
  )
)

/**
 * 주어진 아이템에서 "내가 체크한" 조건부 옵션들을 배열로 얻는다.
 * @param item 아이템일 수도 있고, 세트일 수도 있다. 하지만 `combine()`으로 만든거는 안된다
 */
function activeOptionalSelector(item: Attrs, state: RootState) {
  if (!item) return []
  const array: BaseAttrs[] = []
  array.push(...getActiveBranch(item, state.Switch.branches))

  const gives = isActiveGives(item, state.Switch.gives)
  if (gives) array.push(gives)
  
  array.push(...getActiveExclusive(item, state.Switch.exclusives))
  return array
}

export const selectActiveOption = noot(
  (part, state) => {
    const item = getItem(state.Equips[part].name)
    return activeOptionalSelector(item, state)
  }
)

export const selectArmorBase = noot2(
  (part) => createSelector(
    selectPart[part],
    equipPart => {
      if (!isArmorPart(part)) return {}
      const armorPart = equipPart as ArmorPartType
      const item = getItem(armorPart.name)
      
      const { level, rarity } = item
      return getArmorBase(level, rarity, armorPart.material, part)
    }
  )
)

/**
 * 어떤 한 장비 부의의 아이템 옵션, 업그레이드 보너스, 마법봉인, 엠블렘, 카드 옵션을 얻는다.  
 * (조건부 옵션은 완전히 배제한다.)
 */
export const selectWholePartWithoutOptional = noot2(
  part => createSelector(
    selectPart[part],
    selectMagicProps[part],
    selectArmorBase[part],
    (equipPart, magicProps, armorbase) => {
      const item = getItem(equipPart.name)
      const upgradeAttr = explode(equipPart.upgrade, part === "무기"? "atk" : "stat")
      return combine(item, armorbase, upgradeAttr, magicProps, ...equipPart.emblems.map(getEmblem), getItem(equipPart.card))
    }
  )
)

/** 어떤 한 장비 부의의 아이템 옵션, 활성화시킨 조건부 옵션, 업그레이드 보너스, 마법봉인, 엠블렘, 카드 옵션을 얻는다. */
export const selectWholeFromPart = noot2(
  part => createSelector(
    selectPart[part],
    selectMagicProps[part],
    selectArmorBase[part],
    selectActiveOption[part],
    (equipPart, magicProps, armorbase, activeOption) => {
      const item = getItem(equipPart.name)
      const upgradeAttr = explode(equipPart.upgrade, part === "무기"? "atk" : "stat")
      return combine(item, armorbase, ...activeOption, upgradeAttr, magicProps, ...equipPart.emblems.map(getEmblem), getItem(equipPart.card))
    }
  )
)

/**
 * 현재 착용한 장비들로부터 활성화되는 모든 세트 옵션을 얻는다.
 * 
 * { "<세트 이름>[<옵션 활성화에 필요했던 세트 수>]" : 세트 옵션 } 형식으로 얻는다.
 */
export function selectISetAttrs(state: RootState) {
  const isets = countISetsFrom(...equipParts.map(part => state.Equips[part].name))
  return getActiveISetAttrs(isets)
}


/** 지금 활성화된 세트로부터, on/off 여부를 불문하고 모든 가능한 조건부 옵션들을 얻는다. */
export function selectISetConditionalsAll(state: RootState) {
  const isets = selectISetAttrs(state)
  return collectSpecial(...Object.values(isets))

}

/** 지금 착용한 장비로부터 오는 모든 장비 효과, 장비에 바른 카드 효과, 엠블렘 효과, 강화 효과, 마법봉인 효과, 세트 효과 및 이들 중에서 내가 체크한 조건부 효과를 싸그리 긁어모은다. */
export function selectEquips(state: RootState) {

  /** 지금 활성화된 세트옵션들 */
  const isetattrs = selectISetAttrs(state)
  const J: Attrs[] = []
  for (const k in isetattrs) {
    J.push(isetattrs[k], ...activeOptionalSelector(isetattrs[k], state))
  }

  return combine(
    ...equipParts.map(part => selectWholeFromPart[part](state)),
    ...J
  )
}

/**
 * 지금 착용한 장비로부터 오는 모든 장비 효과, 장비에 바른 카드 효과, 엠블렘 효과, 강화 효과, 마법봉인 효과, 세트 효과를 긁어모은다.  
 * (조건부 효과는 체크 여부에 상관없이 완전히 배제한다.)
 */
export function selectEquipsWithoutOptional(state: RootState) {

  /** 지금 활성화된 세트옵션들 */
  const isetattrs = selectISetAttrs(state)
  const J: Attrs[] = []
  for (const k in isetattrs) {
    J.push(isetattrs[k])
  }

  return combine(
    ...equipParts.map(part => selectWholePartWithoutOptional[part](state)),
    ...J
  )
}



/** 크리쳐 효과 + 크리쳐 스킬 효과 + 아티팩트 효과 를 얻는다. */
export function selectCreatures(state: RootState): BaseAttrs {
  const
    stat = state.Creature.stat,
    skill_stat = state.Creature.skill.stat,
    skill_el_all = state.Creature.skill.el_all,
    skill_dmg_add = state.Creature.skill.dmg_add,
    stat_arti = state.Creature.Artifacts.stat,
    atk = state.Creature.Artifacts.atk,
    el_all = state.Creature.Artifacts.el_all,
    speed_atk = state.Creature.Artifacts.speed_atk,
    speed_cast = state.Creature.Artifacts.speed_cast
  return {
    strn: stat + skill_stat + stat_arti,
    intl: stat + skill_stat + stat_arti,
    vit: stat,
    psi: stat,
    ...explode(atk, "atk"),
    ...explode(el_all + skill_el_all, "el_all"),
    dmg_add : skill_dmg_add,
    speed_atk,
    speed_cast
  }
}



/** 마력결정 스탯보너스를 모두 얻는다. */
export function selectTonics(state: RootState): BaseAttrs {
  const { Accu, crit, def, el_all, hp_mp_max, strn_intl, vit_psi } = state.Tonic

  return {
    strn: strn_intl,
    intl: strn_intl,
    vit: vit_psi,
    psi: vit_psi,
    Accu,
    crit_ph: crit,
    crit_mg: crit,
    ...explode(el_all, "el_all"),
    def_ph: def,
    def_mg: def,
    hpmax: hp_mp_max,
    mpmax: hp_mp_max
  }

}




/** 현재 장착중인 봉인석을 선택한다. */
export function selectRune(state: RootState) {
  return getItem(state.Crack.rune)
}

/** 현재 장착 중인 모든 정수를 선택한다. */
export function selectSpells(state: RootState) {
  return state.Crack.Spells.map(getItem)
}

/**
 * 현재 착용한 봉인석+정수로부터 활성화되는 모든 세트 옵션을 얻는다.
 * 
 * { "<세트 이름>[<옵션 활성화에 필요했던 세트 수>]" : 세트 옵션 } 형식으로 얻는다.
 */
export function selectCrackISetAttrs(state: RootState) {
  const isets = countISetsFrom(state.Crack.rune, ...state.Crack.Spells)
  return getActiveISetAttrs(isets)
}

/**
 * 현재 착용한 봉인석+정수로부터 활성화되는 가호를 얻는다.
 */
export const selectBlessing = createSelector(
  selectRune,
  selectSpells,
  (rune, spells) => {
    return getBlessing(rune, ...spells)
  }
)

/** 성안의 봉인에서 오는 모든 효과를 얻는다. */
export const selectCracksAll = createSelector(
  selectRune,
  selectSpells,
  selectBlessing,
  selectCrackISetAttrs,
  (rune, spells, blessing, isetattr) => {
    return combine(rune, ...spells, blessing, ...Object.values(isetattr))
  }
)




/** 길드 스탯 보너스를 얻는다. */
export function selectGuilds(state: RootState): BaseAttrs {
  const { stat, atk, crit, el_all, speed_atk, Accu, guildPublicStatLv } = state.Guild
  return {
    strn: stat + guildPublicStatLv * 10,
    intl: stat + guildPublicStatLv * 10,
    atk_ph: atk,
    atk_mg: atk,
    crit_ph: crit,
    crit_mg: crit,
    ...explode(el_all, "el_all"),
    speed_atk,
    Accu
  }
}

/** 스탯을 보정한 값만을 가져온다. */
export function selectCalibrated(state: RootState) {
  const sk_inc = state.Calibrate.sk_inc.reduce(percent_inc_mul, 0)
  return { ...state.Calibrate, sk_inc }
}

/**
 * 장비 + 아바타 + 크리쳐 + 마력결정 + 성안의봉인 + 길드 + 업적보너스 (조건부옵션 제외, 보정값 포함)
 * @todo 칭호/크리쳐 조건부옵션 On/Off 추가되면 그것도 고려할것
 * */
export const selectMeWithoutOptional = createSelector(
  selectEquipsWithoutOptional, selectWholeAvatarAttrs, selectCreatures, selectTonics, selectCracksAll, selectGuilds,
  (state: RootState) => explode(state.Profile.achieveLevel * 7 - 2, "stat"),
  selectCalibrated,
  (e, av, c, t, cr, g, ach, cal) => combine(e, av, c, t, cr, g, ach, cal)
)

/** 장비 + 아바타 + 크리쳐 + 마력결정 + 성안의봉인 + 길드 + 업적보너스 (조건부옵션 포함, 보정값 제외) */
export const selectMeWithoutCalibrate = createSelector(
  selectEquips, selectWholeAvatarAttrs, selectCreatures, selectTonics, selectCracksAll, selectGuilds,
  (state: RootState) => explode(state.Profile.achieveLevel * 7 - 2, "stat"),
  (e, av, c, t, cr, g, ach) => combine(e, av, c, t, cr, g, ach)
)

/** 장비 + 아바타 + 크리쳐 + 마력결정 + 성안의봉인 + 길드 (조건부옵션 포함, 보정값 포함) */
export const selectMe = createSelector(
  selectMeWithoutCalibrate, selectCalibrated,
  (me, cal) => combine(me, cal)
)

export const selectMyFinalEltype = createSelector(
  selectMe,
  attrs => {
    const eltype = whatElType(attrs, attrs.eltype)
    if (!eltype) return [null, 0, 0]
    const el_attrKey = elMap2[eltype]
    const eldmg_attrKey = el_attrKey.replace("el_", "eldmg_")
    const el = attrs[el_attrKey]
    const eldmg = attrs[eldmg_attrKey] ?? 0
    return [eltype, el, eldmg]
  }
)
