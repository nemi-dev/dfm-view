import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import _initState from "./initState.json"
const guildInit: GuildState = _initState.Guild

export const guildSlice = createSlice({
  name: 'My',
  initialState: guildInit,
  reducers: {
    SetGuild: (s, { payload }: PayloadAction<[keyof GuildState, number]>) => {
      s[payload[0]] = payload[1]
    }
  }
})


export const {
  SetGuild
} = guildSlice.actions
