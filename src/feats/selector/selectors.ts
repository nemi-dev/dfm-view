import { createSelector } from "@reduxjs/toolkit"
import { atx, combine, dualTrigger, whatElType } from "../../attrs"
import type { RootState } from "../store"
import { add, percent_inc_mul } from "../../utils"
import { selectGuilds } from "./guildSelectors"
import { selectEquips, selectEquipsNoConds } from "./equipSelectors"
import { selectAchievementAttrs, selectClassAtype, selectMyDFClass, selectMyLevel } from "./selfSelectors"
import { selectCreatures, selectCreaturesNoCond } from "./creatureSelectors"
import { selectCracks } from "./cracksSelectors"
import { selectWholeAvatarAttrs, selectWholeAvatarAttrsNoCond } from "./avatarSelectors"
import { critFt, defRate, getPlainDamage, } from "../../damage"

/** 마력결정 스탯보너스를 모두 얻는다. */
export function selectTonics(state: RootState): AttrSource {
  const { el_all, hpmax, mpmax, strn_intl, vit_psi, def_ph, def_mg, Crit, Accu } = state.Tonic

  return {
    name: "마력결정",
    attrs: {
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
}











/** 스탯을 보정한 값만을 가져온다. */
export function selectCalibrated(state: RootState): BaseAttrs {
  const sk_inc = state.My.Calibrate.sk_inc.reduce(percent_inc_mul, 0)
  return { ...state.My.Calibrate, sk_inc }
}



/** 직업 + 장비 + 아바타 + 크리쳐 + 마력결정 + 성안의봉인 + 길드 + 업적보너스 (조건부옵션 포함, 보정값 제외) */
export const selectMeNoCal = createSelector(
  selectMyDFClass, selectEquips, selectWholeAvatarAttrs, selectCreatures, selectTonics, selectCracks, selectGuilds,
  selectAchievementAttrs,
  (dfc, e, av, c, tonic, cr, guild, ach) => {
    // 듀얼트리거는 던전 입장시에도 유지된다!
    return dualTrigger(combine(dfc?.attrs, e, av, c, tonic.attrs, cr, guild.attrs, ach))
  }
)

/** 직업 + 장비 + 아바타 + 크리쳐 + 마력결정 + 성안의봉인 + 길드 + 업적보너스 + 보정값 (조건부옵션 제외, 보정값 포함) */
export const selectMeNoCond = createSelector(
  selectMyDFClass, selectEquipsNoConds, selectWholeAvatarAttrsNoCond, selectCreaturesNoCond, selectTonics, selectCracks, selectGuilds,
  selectAchievementAttrs,
  selectCalibrated,
  (dfc, e, av, c, tonic, cr, guild, ach, cal) => {
    // 듀얼트리거는 던전 입장시에도 유지된다!
    return dualTrigger(combine(dfc?.attrs, e, av, c, tonic.attrs, cr, guild.attrs, ach, cal))
  }
)

/**  장비 + 아바타 + 크리쳐 + 마력결정 + 성안의봉인 + 길드 + 업적보너스 + 보정값 (조건부옵션 포함, 보정값 포함) */
export const selectMe = createSelector(
  selectMeNoCal, selectCalibrated,
  (me, cal) => combine(me, cal)
)

/** 현재 상태에서 내 원소 공격속성을 선택한다. */
export const selectMyFinalEltype = createSelector(
  selectMe,
  whatElType
)





/** 현재 상태에서 스증+크증이 모두 적용된 내 퍼센트 물/마공 데미지를 선택한다. */
export const selectMyDamage = createSelector(
  selectMe,
  selectClassAtype,
  selectMyFinalEltype,
  (attrs, atype, eltypes) => {
    return +
    getPlainDamage(atype, eltypes, attrs)
    * critFt(attrs["cdmg_inc"], attrs["catk_inc"])
    * (1 + add(attrs["sk_inc"], attrs["sk_inc_sum"]) / 100)
  }
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

/** 현재 상태의 내 레벨과 적 방어력(방깎적용)으로부터 방어율을 계산한다. */
export const selectEnemyDefRate = createSelector(
  selectMyLevel,
  selectEnemyDefense,
  defRate
)
