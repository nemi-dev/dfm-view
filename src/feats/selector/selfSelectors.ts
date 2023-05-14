import { createSelector } from "@reduxjs/toolkit"
import { atx } from "../../attrs"
import { whois } from "../../dfclass"
import type { RootState } from "../store"
import { getSelfSkill, getSkill } from "../../skills"

/** 내 이름을 선택한다. */
export const selectMyName = (state: RootState) => state.My.Self.myName

/** 현재 내 레벨을 선택한다. */
export const selectMyLevel = (state: RootState) => state.My.Self.level

/** 내 직업을 선택한다 */
export const selectMyDFClass = (state: RootState) => whois(state.My.Self.dfclass)

/** 내 직업의 공격타입을 선택한다. */
export const selectClassAtype = createSelector(
  selectMyDFClass,
  (dfclass) => dfclass?.atype ?? "Physc"
)

/** 내 직업의 공격스킬을 모두 선택한다. */
export const selectClassASkills = createSelector(
  selectMyDFClass,
  (dfclass) => {
    return dfclass.skills.map(skname => getSkill(skname))
  }
)

export const selectClassSelfSkills = createSelector(
  selectMyDFClass,
  (dfclass) => {
    return dfclass.selfSkills.map(skname => getSelfSkill(skname))
  }
)

/** 업적달성레벨로 얻는 보너스 효과를 선택한다.. */
export const selectAchBonus = (state: RootState): AttrSource => ({ name: "업적 달성 보너스", attrs: atx("StatAll", state.My.Self.achieveLevel * 7 - 2)})
