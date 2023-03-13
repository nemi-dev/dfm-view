import { atx } from "../../attrs"
import type { RootState } from "../store"
import { whois } from "../../dfclass"
import { createSelector } from "@reduxjs/toolkit"

/** 내 이름을 선택한다. */
export const selectMyName = (state: RootState) => state.My.Self.myName

/** 내 직업을 선택한다 */
export const selectMyDFClass = (state: RootState) => whois(state.My.Self.dfclass)

/** 내 직업의 공격타입을 선택한다. */
export const selectClassAtype = createSelector(
  selectMyDFClass,
  (dfclass) => dfclass?.atype ?? "Physc"
)

/** 내가 직접 체크한 공격타입을 선택한다 */
export const selectSpecifiedAtype = (state: RootState) => state.My.Self.atype

/** 업적달성레벨로 얻는 보너스 효과를 얻는다.. */
export const selectAchievementAttrs = (state: RootState) => atx("Stat", state.My.Self.achieveLevel * 7 - 2)
