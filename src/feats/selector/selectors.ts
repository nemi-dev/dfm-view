import { createSelector } from '@reduxjs/toolkit'

import { applyAddMaxEldmg, atx, dualTrigger, whatElType } from '../../attrs'
import { AtypeAttrKey } from '../../constants'
import { critChance, critFt, defRate, getPlainDamage, getRealdef } from '../../damage'
import { CombineItems } from '../../items'
import { add, compound } from '../../utils'
import { selectAvatars } from './avatarSelectors'
import { selectCracks } from './cracksSelectors'
import { selectCreatureAndArtis } from './creatureSelectors'
import { selectEquips } from './equipSelectors'
import { selectGuilds } from './guildSelectors'
import { selectAchBonus, selectClassAtype, selectMyDFClass, selectMyLevel } from './selfSelectors'

import type { RootState } from "../store"

/** 
 * 두 번째 것이 유효하다면 두 번째 것을 그대로 리턴한다.
 * 그렇지 않다면 현재 열린 캐릭터의 ID를 얻는다.
 */
export function forwardID(state: RootState, id = state.currentID) {
  return id || state.currentID
}

/** 저장된 캐릭터를 선택한다. */
export function selectDFChar(state: RootState, id = state.currentID) {
  return state.SavedChars.byID[id].DFChar
}

/** 내가 활성화한 조건부를 모두 선택한다. */
export const selectMyChoice = createSelector(
  selectDFChar, dfchar => dfchar.Choice
)

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

/** 스탯 보정값을 선택한다. (복리스증이 배열로 되어있는 그시끼) */
export const selectCalibrate = createSelector(selectDFChar, (ch) => ch.Calibrate)

/** 스탯보정 효과를 선택한다. */
export const selectCaliSource = createSelector(
  selectCalibrate,
  (cal) => {
    const sk_inc = cal.sk_inc.reduce(compound, 0)
    return {
      name: "스탯 조정값",
      attrs: {
        ...cal, sk_inc
      }
    }
  }
)


/** 
 * 모든 "소스"를 선택한다.  
 * 
 * 직업 + 장비 + 아바타 + 크리쳐 + 마력결정 + 성안의봉인 + 길드 + 업적보너스 + 보정값  
 */
export const selectMySource = createSelector(
  selectMyDFClass,
  selectEquips,
  selectAvatars,
  selectCreatureAndArtis,
  selectTonics,
  selectCracks,
  selectGuilds,
  selectAchBonus,
  selectCaliSource,
  (dfc, equips, avatars, creatures, tonic, cracks, guild, ach, cal) => {
    return [
      dfc,
      ...equips,
      ...avatars,
      ...creatures,
      tonic,
      ...cracks,
      guild,
      ach,
      cal
    ]
  }
)


/** 
 * 마을에서 내 스탯을 선택한다.  
 * **듀얼트리거/최대 속성강화 추가데미지가 포함되었다면 여기서 적용된다.**
*/
export const selectMyAttrTown = createSelector(
  selectMySource,
  (sources) => {
    const a = CombineItems(sources)
    return applyAddMaxEldmg(dualTrigger(a))
  }
)

/** 
 * 던전에서 내 스탯을 선택한다. (조건부옵션이 명시적으로 포함됨)  
 * **듀얼트리거/최대 속성강화 추가데미지가 포함되었다면 여기서 적용된다.**
*/
export const selectMyAttr = createSelector(
  selectMySource,
  selectMyChoice,
  (sources, choice) => {
    const a = CombineItems(sources, choice)
    return applyAddMaxEldmg(dualTrigger(a))
  }
)

/** 던전에서 내 크리티컬 확률을 선택한다. */
export const selectMyCritChance = createSelector(
  selectMyAttr,
  selectClassAtype,
  (attrs, atype) => {
    const { Crit, CritCh } = AtypeAttrKey[atype]
    return critChance(attrs[Crit], attrs[CritCh])
  }
)

/** 던전에서 내 원소 공격속성을 선택한다. */
export const selectMyFinalEltype = createSelector(
  selectMyAttr,
  whatElType
)

/** 던전에서 스증도, 크증도 적용되지 않은 내 퍼센트 물/마공 데미지를 선택한다. */
export const selectMyVanDamage = createSelector(
  selectMyAttr,
  selectClassAtype,
  selectMyFinalEltype,
  (attrs, atype, eltypes) => {
    return getPlainDamage(atype, eltypes, attrs)
  }
)

/** 던전에서 스증+크증이 모두 적용된 내 퍼센트 물/마공 데미지를 선택한다. */
export const selectMyDamage = createSelector(
  selectMyAttr,
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
  selectMyAttr,
  selectBaseEnemyDefense,
  (attrs = {}, def) => {
    const { target_def = 0, DefBreak = 0 } = attrs
    return getRealdef(def, target_def, DefBreak)
  }
)

/** 속깎 적용후 적 속성저항을 선택한다 */
export const selectEnemyElRes = createSelector(
  selectMyAttr,
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
