import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const perfectTonic: TonicState = {
  el_all: 25,
  hpmax: 1240,
  mpmax: 630,
  strn_intl: 237,
  vit_psi: 237,
  def_ph: 2100,
  def_mg: 1600,
  Crit: 237,
  Accu: 239,
}

export const tonicSlice = createSlice({
  name: 'Tonic',
  initialState: perfectTonic,
  reducers: {
    SetTonic: (s, { payload }: PayloadAction<[keyof TonicState, number]>) => {
      s[payload[0]] = payload[1]
    },
    SetTonicPerfect: (s) => {
      Object.assign(s, perfectTonic)
    }
  }
})


export const {
  SetTonic,
  SetTonicPerfect
} = tonicSlice.actions
