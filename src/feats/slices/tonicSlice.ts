import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import _initState from "./initState.json"
const tonicInit: TonicType = _initState.Tonic

export const tonicSlice = createSlice({
  name: 'Tonic',
  initialState: tonicInit,
  reducers: {
    SetTonic: (s, { payload }: PayloadAction<[keyof TonicType, number]>) => {
      s[payload[0]] = payload[1]
    },
  }
})


export const {
  SetTonic
} = tonicSlice.actions
