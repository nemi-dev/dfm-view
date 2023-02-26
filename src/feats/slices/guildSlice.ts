import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface GuildType {
  stat: number
  atk: number
  crit: number
  el_all: number
  speed_atk: number
  Accu: number
  guildPublicStatLv: number
}
const guildInit: GuildType = {
  stat: 120,
  atk: 90,
  crit: 90,
  el_all: 14,
  Accu: 150,
  speed_atk: 9.75,
  guildPublicStatLv: 5
}

export const guildSlice = createSlice({
  name: 'My',
  initialState: guildInit,
  reducers: {
    SetGuild: (s, { payload }: PayloadAction<[keyof GuildType, number]>) => {
      s[payload[0]] = payload[1]
    }
  }
})


export const {
  SetGuild
} = guildSlice.actions
