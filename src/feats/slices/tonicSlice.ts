import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TonicType {
  Accu: number;
  crit: number;
  def: number;
  el_all: number;
  strn_intl: number;
  hp_mp_max: number;
  vit_psi: number;
}

const tonicInit: TonicType = {
  Accu: 239,
  crit: 237,
  def: 2100,
  el_all: 25,
  hp_mp_max: 1240,
  strn_intl: 237,
  vit_psi: 237
};

export const tonicSlice = createSlice({
  name: 'Tonic',
  initialState: tonicInit,
  reducers: {
    SetTonic: (s, { payload }: PayloadAction<[keyof TonicType, number]>) => {
      s[payload[0]] = payload[1];
    },
  }
});


export const {
  SetTonic
} = tonicSlice.actions;
