import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getItem } from "../../items"
import { avMagicProps } from "../../magicProps"

import _initState from "./initState.json"
const cracksInit = _initState.Cracks as CracksType

export const crackSlice = createSlice({
  name: 'Crack',
  initialState: cracksInit,
  reducers: {
    SetRune: (s, { payload }: PayloadAction<string>) => {
      s.rune = payload
    },
    SetSpell: (s, { payload: [index, value] }: PayloadAction<[number, string]>) => {
      s.Spells[index] = value
    },
    SetSpellAll: (s, { payload }: PayloadAction<string>) => {
      s.Spells.fill(payload)
    },
    SetMagicProps: (s, { payload: [index, value] }: PayloadAction<[number, MagicPropsCareAbout]>) => {
      s.MagicProps[index] = value
    },
    NextMagicProps: (s, { payload: index }: PayloadAction<number>)=> {
      const { level, rarity } = getItem(s.rune)
      const mint = avMagicProps("봉인석", level, rarity, index === 0)
      const current = s.MagicProps[index]
      const next = mint.cycle[current]
      s.MagicProps[index] = next
    }
  }
})

export const {
  SetRune, SetSpell, SetSpellAll, SetMagicProps, NextMagicProps
} = crackSlice.actions
