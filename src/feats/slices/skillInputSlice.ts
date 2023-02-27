import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface SkillInputInit {
  cases: SkillSpec[]
}

const initialState: SkillInputInit = {
  cases: [
    { name: "평타",value: 381, fixed: 96, useSkillInc: false },
    { name: "평타 막타",value: 505, fixed: 128, useSkillInc: false },
    { name: "프라이드 악셀", value: 3041, fixed: 3041, useSkillInc: true },
    { name: "슬로스 바디", value: 8853, fixed: 8853, useSkillInc: true },
    { name: "스커드 더 라스", value: 14106, fixed: 14107, useSkillInc: true },
    { name: "정화의 꽃",value: 14322, fixed: 14322, useSkillInc: true },
  ]
}
export const skillInputSlice = createSlice({
  name: "SkillInput",
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
      s.cases[index].useSkillInc = val
    },
    AddSkillCase: (s) => {
      s.cases.push({ name: `스킬 ${s.cases.length}`, value: 1000, fixed: 1000, useSkillInc: true })
    },
    RemoveSkillCase: (s, { payload }: PayloadAction<number>) => {
      s.cases.splice(payload, 1)
    },
  }
})

export const {
  SetSkillInputName,
  SetSkillValue,
  SetSkillFixValue,
  SetSkillUsesSkillInc,
  AddSkillCase,
  RemoveSkillCase
} = skillInputSlice.actions
