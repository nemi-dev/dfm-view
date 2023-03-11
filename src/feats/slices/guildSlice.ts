import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import _initState from "./initStateMt.json"

const perfectGuildStat = {
  "StatLv": 30,
  "AtkLv": 30,
  "CritLv": 30,
  "ElLv": 14,
  "SpeedAtkLv": 14,
  "SpeedCastLv": 14,
  "SpeedMoveLv": 14,
  "AccuLv": 30,
} as const
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
