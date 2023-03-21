import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { customSkillInit2 } from "./customSkillInit";



export const skillInputSlice = createSlice({
  name: "CustomSkill",
  initialState: customSkillInit2,
  reducers: {

    SetSkillInputName: (s, { payload: [index, val] }: PayloadAction<[number, string]>) => {
      s[index].name = val
    },
    SetSkillValue: (s, { payload: [index, val] }: PayloadAction<[number, number]>) => {
      s[index].value = val
    },
    SetSkillFixValue: (s, { payload: [index, val] }: PayloadAction<[number, number]>) => {
      s[index].fixed = val
    },
    SetSkillMaxHit: (s, { payload: [index, val] }: PayloadAction<[number, number]>) => {
      s[index].maxHit = Math.max(val, 1)
    },
    SetSkillUsesSkillInc: (s, { payload: [index, val] }: PayloadAction<[number, boolean]>) => {
      s[index].isSkill = val
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
