import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { avatarParts } from "../../avatar"

import _initState from "./initState.json"

const avatarInit = _initState.Avatars as AvatarState

export const avatarSlice = createSlice({
  name: "Avatar",
  initialState: avatarInit,
  reducers: {
    SetAvatarRarity: (s, { payload: [part, rarity] }: PayloadAction<[AvatarPart, "Uncommon" | "Rare"]>) => {
      s[part] = rarity
    },
    SetAvatarTypeAll: (s, { payload }: PayloadAction<"Uncommon" | "Rare">) => {
      avatarParts.forEach(part => s[part] = payload)
    },
    SetOtherAvatar: (s, { payload: [part, name] }: PayloadAction<["칭호" | "오라" | "무기아바타", string]>) => {
      s[part] = name
    },
  }
})

export const {
  SetAvatarRarity,
  SetAvatarTypeAll,
  SetOtherAvatar
} = avatarSlice.actions






