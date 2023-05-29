import { createSelector } from "@reduxjs/toolkit";
import { selectDFChar } from "./baseSelectors";
import { RootState } from "../store";
import { selectMyAttr } from "./selectors";
import { querySkill } from "../../skills";
import { add } from "../../utils";

export const selectSkillLevel = createSelector(
  selectDFChar,
  (state: RootState, charID: string, skId: number) => skId,
  (dfchar, skID) => {
    return dfchar.skillLevelMap[skID]
  }
)

export const selectSkillLevelBonus = createSelector(
  selectMyAttr,
  (state: RootState, charID: string, sk: AttackSkill) => sk,
  (myAttrs, sk) => {
    const { sk_lv = {} } = myAttrs
    const directValue = sk_lv[sk.name] ?? 0
    const v: number[] = []
    for (const key in sk_lv) {
      if (key.startsWith("@")) {
        const skills = querySkill(key)
        if (skills.includes(sk)) {
          v.push(sk_lv[key])
        }
      }
    }
    return directValue + v.reduce(add, 0)
  }
)
