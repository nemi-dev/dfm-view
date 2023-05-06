import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { perfectTonic } from "../../constants"


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
