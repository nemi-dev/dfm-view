import { createSelector } from "@reduxjs/toolkit"
import { atx } from "../../attrs"
import { whois } from "../../dfclass"
import { getSelfSkill, getSkill } from "../../skills"
import { selectDFChar } from "./selectors"

/** 캐릭터 이름을 선택한다. */
export const selectMyName = createSelector(selectDFChar, dfchar => dfchar.Self.myName)

/** 캐릭터 이름을 선택한다. */
export const selectName = createSelector(selectDFChar, dfchar => dfchar.Self.myName)

/** 캐릭터 레벨을 선택한다. */
export const selectMyLevel = createSelector(selectDFChar, dfchar => dfchar.Self.level)

/** 캐릭터 레벨을 선택한다. */
export const selectLevel = createSelector(selectDFChar, dfchar => dfchar.Self.level)

/** 업적 레벨을 선택한다. */
export const selectMyAchievementLevel = createSelector(selectDFChar, dfchar => dfchar.Self.achieveLevel)

/** 캐릭터 직업을 선택한다 */
export const selectMyDFClass = createSelector(selectDFChar, dfchar => whois(dfchar.Self.dfclass))

/** 캐릭터의 독립공격력을 선택한다. */
export const selectMyAtkFixed = createSelector(selectDFChar, dfchar => dfchar.Self.atkFixed)

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
