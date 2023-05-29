import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { atx } from "../../attrs"
import { whois } from "../../dfclass"
import { getSkill, getSelfSkill } from "../../skills"
import { compound } from "../../utils"

/** 현재 열린 캐릭터의 ID를 얻는다. */
export function selectCurrentID(state: RootState) {
  return state.currentID
}

/** 저장된 캐릭터를 선택한다. */
export function selectDFChar(state: RootState, id = state.currentID) {
  return state.SavedChars.byID[id]
}

/** 내가 활성화한 조건부를 모두 선택한다. */
export const selectMyChoice = createSelector(
  selectDFChar, dfchar => dfchar.choices
)

/** 캐릭터 이름을 선택한다. */
export const selectName = createSelector(
  selectDFChar,
  dfchar => dfchar.name
)

/** 캐릭터 레벨을 선택한다. */
export const selectLevel = createSelector(
  selectDFChar,
  dfchar => dfchar.level
)

/** 업적 레벨을 선택한다. */
export const selectMyAchievementLevel = createSelector(
  selectDFChar,
  dfchar => dfchar.achieveLevel
)

/** 캐릭터 직업을 선택한다 */
export const selectMyDFClass = createSelector(
  selectDFChar,
  dfchar => whois(dfchar.dfclass)
)

/** 캐릭터의 독립공격력을 선택한다. */
export const selectMyAtkFixed = createSelector(
  selectDFChar,
  dfchar => dfchar.atkFixed
)

/** 캐릭터 직업의 공격타입을 선택한다. */
export const selectClassAtype = createSelector(
  selectMyDFClass,
  (dfclass) => dfclass?.atype ?? "Physc"
)

/** 캐릭터 직업의 공격스킬을 모두 선택한다. */
export const selectClassASkills = createSelector(
  selectMyDFClass,
  dfclass => dfclass.skills?.map(skname => getSkill(skname)) ?? []
)

/** 캐릭터 직업의 패시브/버프 스킬을 모두 선택한다. */
export const selectClassSelfSkills = createSelector(
  selectMyDFClass,
  dfclass => dfclass.selfSkills.map(skname => getSelfSkill(skname))
)

/** 업적달성레벨로 얻는 보너스 효과를 선택한다.. */
export const selectAchBonus = createSelector(
  selectMyAchievementLevel,
  lv => ({ name: "업적 달성 보너스", attrs: atx("StatAll", lv * 7 - 2)})
)

/** 스탯 보정값을 선택한다. */
export const selectCalibrate = createSelector(
  selectDFChar,
  (ch) => ch.calibrate
)

/** 스탯보정 효과를 선택한다. */
export const selectCaliSource = createSelector(
  selectCalibrate,
  (cal) => {
    const sk_inc = cal.sk_inc.reduce(compound, 0)
    return {
      name: "스탯 조정",
      attrs: {
        ...cal, sk_inc
      }
    }
  }
)
