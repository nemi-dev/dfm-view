import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { avatarParts } from "../../avatar"

import _initState from "./initState.json"

const avatarInit = _initState.Avatars as AvatarInitType

export const avatarSlice = createSlice({
  name: "Avatar",
  initialState: avatarInit,
  reducers: {
    SetAvatarType: (s, { payload: [part, rarity] }: PayloadAction<[AvatarPart, "Uncommon" | "Rare"]>) => {
      s[part] = rarity
    },
    SetAvatarTypeAll: (s, { payload }: PayloadAction<"Uncommon" | "Rare">) => {
      avatarParts.forEach(part => s[part] = payload)
    },
    SetOtherAvatar: (s, { payload: [part, name] }: PayloadAction<["칭호" | "오라" | "무기아바타", string]>) => {
      s[part] = name
    },
    SetDFTitleCard: (s, { payload }: PayloadAction<string>) => {
      s.card = payload
    },
    SetDFTitleEmblem: (s, { payload }: PayloadAction<EmblemSpec>) => {
      s.emblems = [payload]
    },
  }
})

export const {
  SetAvatarType,
  SetAvatarTypeAll,
  SetOtherAvatar,
  SetDFTitleCard,
  SetDFTitleEmblem
} = avatarSlice.actions






