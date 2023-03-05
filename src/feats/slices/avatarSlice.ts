import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { avatarParts } from "../../avatar"

type AvatarInitType = {
  [k in AvatarPart]: "Uncommon" | "Rare"
} & {
  칭호: string
  오라: string
  무기아바타: string

  card: string
  emblem: EmblemSpec[]
}

const avatarInit: AvatarInitType = {
  모자: "Uncommon",
  얼굴: "Uncommon",
  상의: "Uncommon",
  목가슴: "Uncommon",
  신발: "Uncommon",
  머리: "Uncommon",
  하의: "Uncommon",
  허리: "Uncommon",
  칭호: "월하/뜨거운 썸머 바캉스",
  오라: "월하/바캉스/메이플 오라",
  무기아바타: "이달의 아이템 무기아바타",

  card: null,
  emblem: [["Intel", 5]]
}

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
      s.emblem = [payload]
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






