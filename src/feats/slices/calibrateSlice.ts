import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { calibrateInit } from "./initStateDefault";



type SetAttrAction = PayloadAction<[keyof NumberCalibrate, number]>
type SkillIncPayloadType = PayloadAction<[number, number]>

export const calibrateSlice = createSlice({
  name: 'MyStat',
  initialState: calibrateInit,
  reducers: {
    SetBasicAttr: (s, { payload: [key, value] }: SetAttrAction) => {
      s[key] = value
    },
    SetSkillInc: (s, { payload: [index, value] }: SkillIncPayloadType) => {
      s.sk_inc[index] = value
    },
    AddSkillInc: (s) => {
      s.sk_inc.push(0)
    },
    RemoveSkillInc: (s, { payload }: PayloadAction<number>) => {
      if (s.sk_inc.length > 1) s.sk_inc.splice(payload, 1)
    },
    SetEltype: (s, { payload: [ el, on ] }: PayloadAction<[Eltype, boolean]>) => {
      if (on && !s.eltype.includes(el)) s.eltype.push(el)
      else if (!on && s.eltype.includes(el)) s.eltype.splice(s.eltype.indexOf(el), 1)
    }
  }
})

export const {
  SetBasicAttr,
  SetSkillInc,
  AddSkillInc,
  RemoveSkillInc,
  SetEltype
} = calibrateSlice.actions
