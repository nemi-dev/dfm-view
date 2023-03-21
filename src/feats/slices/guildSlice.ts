import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { perfectGuildStat } from "./initState"

const hardCodedPublicStatLevel = 6

export const guildSlice = createSlice({
  name: 'My',
  initialState: {
    ...perfectGuildStat,
    PublicStatLv: hardCodedPublicStatLevel
  } as GuildState,
  reducers: {
    SetGuild: (s, { payload }: PayloadAction<[keyof GuildState, number]>) => {
      s[payload[0]] = payload[1]
    },
    PerfectGuild: (s) => {
      Object.assign(s, perfectGuildStat)
    },
    FetchGuild: (s, { payload }: PayloadAction<GuildState>) => {
      Object.assign(s, payload)
    }
  }
})


export const {
  SetGuild, PerfectGuild, FetchGuild
} = guildSlice.actions
