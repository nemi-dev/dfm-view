import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { avatarParts } from "../../avatar"

import initState from "./initState"

export const avatarSlice = createSlice({
  name: "Avatar",
  initialState: initState.Avatar,
  reducers: {
    SetAvatarRarity: (s, { payload: [part, rarity] }: PayloadAction<[WearAvatarPart, "Uncommon" | "Rare"]>) => {
      s[part] = rarity
    },
    SetAvatarTypeAll: (s, { payload }: PayloadAction<"Uncommon" | "Rare">) => {
      avatarParts.forEach(part => s[part] = payload)
    }
  }
})

export const {
  SetAvatarRarity,
  SetAvatarTypeAll,
} = avatarSlice.actions






