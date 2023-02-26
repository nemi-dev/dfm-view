import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CalibrateInitType {
  strn: number,
  intl: number,
  str_inc: number,
  int_inc: number,

  atk_ph: number,
  atk_mg: number,
  atk_ph_inc: number,
  atk_mg_inc: number,

  crit_ph: number,
  crit_mg: number,
  crit_ph_pct: number,
  crit_mg_pct: number,

  dmg_inc: number,
  cdmg_inc: number,
  dmg_add: number,
  
  el_fire: number,
  el_ice: number,
  el_lght: number,
  el_dark: number,

  eldmg_fire: number,
  eldmg_ice: number,
  eldmg_lght: number,
  eldmg_dark: number,
  
  sk_inc: number[],
  sk_inc_sum: number

  target_def: number,
  target_res: number
}

const attrs: CalibrateInitType = {
  strn: 0,
  intl: 0,
  str_inc: 0,
  int_inc: 0,

  atk_ph: 0,
  atk_mg: 0,
  atk_ph_inc: 0,
  atk_mg_inc: 0,
  
  crit_ph: 0,
  crit_mg: 0,
  crit_ph_pct: 0,
  crit_mg_pct: 0,

  dmg_inc: 0,
  cdmg_inc: 0,
  dmg_add: 0,
  
  el_fire: 0,
  el_ice: 0,
  el_lght: 0,
  el_dark: 0,

  eldmg_fire: 0,
  eldmg_ice: 0,
  eldmg_lght: 0,
  eldmg_dark: 0,
  
  sk_inc: [0],
  sk_inc_sum: 0,
  
  target_def: 0,
  target_res: 0
}

type SetAttrAction = PayloadAction<[keyof Omit<CalibrateInitType, "sk_inc">, number]>
type SkillIncPayloadType = PayloadAction<[number, number]>

export const calibrateSlice = createSlice({
  name: 'Calibrate',
  initialState: attrs,
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
    }
  }
})

export const {
  SetBasicAttr,
  SetSkillInc,
  AddSkillInc,
  RemoveSkillInc
} = calibrateSlice.actions
