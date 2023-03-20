import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { customSkillInit } from "./customSkillInit";



export const skillInputSlice = createSlice({
  name: "CustomSklill",
  initialState: customSkillInit,
  reducers: {

    SetSkillInputName: (s, { payload: [index, val] }: PayloadAction<[number, string]>) => {
      s.cases[index].name = val
    },
    SetSkillValue: (s, { payload: [index, val] }: PayloadAction<[number, number]>) => {
      s.cases[index].value = val
    },
    SetSkillFixValue: (s, { payload: [index, val] }: PayloadAction<[number, number]>) => {
      s.cases[index].fixed = val
    },
    SetSkillMaxHit: (s, { payload: [index, val] }: PayloadAction<[number, number]>) => {
      s.cases[index].maxHit = Math.max(val, 1)
    },
    SetSkillUsesSkillInc: (s, { payload: [index, val] }: PayloadAction<[number, boolean]>) => {
      s.cases[index].isSkill = val
    }
  }
})

export const {
  SetSkillInputName,
  SetSkillValue,
  SetSkillFixValue,
  SetSkillMaxHit,
  SetSkillUsesSkillInc,
} = skillInputSlice.actions
