import { createSelector } from "@reduxjs/toolkit"
import { atx, combine, whatElType } from "../../attrs"
import type { RootState } from "../store"
import { percent_inc_mul } from "../../utils"
import { selectGuilds } from "../guildSelectors"
import { selectEquips, selectEquipsNoConds } from "./equipSelectors"
import { selectAchievementAttrs } from "./selfSelectors"
import { selectCreatures, selectCreaturesNoCond } from "./creatureSelectors"
import { selectCracksAll } from "./cracksSelectors"
import { selectWholeAvatarAttrs, selectWholeAvatarAttrsNoCond } from "./avatarSelectors"

/** 마력결정 스탯보너스를 모두 얻는다. */
export function selectTonics(state: RootState): BaseAttrs {
  const { el_all, hpmax, mpmax, strn_intl, vit_psi, def_ph, def_mg, Crit, Accu } = state.My.Tonic

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











/** 스탯을 보정한 값만을 가져온다. */
export function selectCalibrated(state: RootState): BaseAttrs {
  const sk_inc = state.My.Calibrate.sk_inc.reduce(percent_inc_mul, 0)
  return { ...state.My.Calibrate, sk_inc }
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

/** 현재 상태에서 내 원소 공격속성을 선택한다. */
export const selectMyFinalEltype = createSelector(
  selectMe,
  attrs =>  whatElType(attrs, attrs.eltype)
)







/** 내가 입력한 적 방어력을 선택한다. */
export function selectBaseEnemyDefense(state: RootState) {
  return state.EnemyTarget.Defense
}

/** 내가 입력한 적 속성저항을 선택한다. */
export function selectBaseEnemyElRes(state: RootState) {
  return state.EnemyTarget.ElRes
}

/** 방깎 적용후 적 방어력을 선택한다 */
export const selectEnemyDefense = createSelector(
  selectMe,
  selectBaseEnemyDefense,
  (attrs, def) => {
    const { target_def = 0 } = attrs
    return Math.max(def + target_def, 0)
  }
)

/** 속깎 적용후 적 속성저항을 선택한다 */
export const selectEnemyElRes = createSelector(
  selectMe,
  selectBaseEnemyElRes,
  (attrs, res) => {
    const { target_res = 0 } = attrs
    return Math.max(res + target_res, 0)
  }
)
