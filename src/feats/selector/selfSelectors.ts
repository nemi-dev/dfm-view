import { createSelector } from "@reduxjs/toolkit"
import { atx } from "../../attrs"
import { whois } from "../../dfclass"
import type { RootState } from "../store"

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

/** 업적달성레벨로 얻는 보너스 효과를 선택한다.. */
export const selectAchievementAttrs = (state: RootState) => atx("Stat", state.My.Self.achieveLevel * 7 - 2)

/** 특정 직업을 선택하는 것만으로도 활성화되는 효과를 선택한다. */
export const selectDFClassAttrs = createSelector(
  selectMyDFClass,
  (dfclass) => dfclass.attrs ?? {}
)
