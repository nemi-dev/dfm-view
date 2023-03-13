import { createSlice, PayloadAction } from "@reduxjs/toolkit";



const initialState: CustomSkillState = {
  cases: [
    { name: "평타", value: 381, fixed: 96, isSkill: false },
    { name: "평타 막타", value: 505, fixed: 128, isSkill: false },
    { name: "프라이드 악셀", value: 3041, fixed: 3041, isSkill: true },
    { name: "슬로스 바디", value: 8853, fixed: 8853, isSkill: true },
    { name: "스커드 더 라스", value: 14106, fixed: 14107, isSkill: true },
    { name: "정화의 꽃", value: 14322, fixed: 14322, isSkill: true },
  ]
}
export const skillInputSlice = createSlice({
  name: "CustomSklill",
  initialState,
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
    SetSkillUsesSkillInc: (s, { payload: [index, val] }: PayloadAction<[number, boolean]>) => {
      s.cases[index].isSkill = val
    }
  }
})

export const {
  SetSkillInputName,
  SetSkillValue,
  SetSkillFixValue,
  SetSkillUsesSkillInc,
} = skillInputSlice.actions
