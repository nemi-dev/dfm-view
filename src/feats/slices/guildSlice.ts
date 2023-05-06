import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { perfectGuild } from "../../constants"

const hardCodedPublicStatLevel = 6

export const guildSlice = createSlice({
  name: 'My',
  initialState: {
    ...perfectGuild,
    PublicStatLv: hardCodedPublicStatLevel
  } as GuildState,
  reducers: {
    SetGuild: (s, { payload }: PayloadAction<[keyof GuildState, number]>) => {
      s[payload[0]] = payload[1]
    },
    PerfectGuild: (s) => {
      Object.assign(s, perfectGuild)
    },
    FetchGuild: (s, { payload }: PayloadAction<GuildState>) => {
      Object.assign(s, payload)
    }
  }
})


export const {
  SetGuild, PerfectGuild, FetchGuild
} = guildSlice.actions
