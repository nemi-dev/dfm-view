import { createSlice, PayloadAction } from "@reduxjs/toolkit";


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
  
  eltype: [],

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

type SetAttrAction = PayloadAction<[keyof NumberCalibrate, number]>
type SkillIncPayloadType = PayloadAction<[number, number]>

export const calibrateSlice = createSlice({
  name: 'MyStat',
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
