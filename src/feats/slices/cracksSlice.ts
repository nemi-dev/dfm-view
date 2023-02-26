import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getItem } from "../../items";
import { getAvailableMagicPropsForEquip } from "../../magicProps";

interface CracksType {
  /** 봉인석 이름 */
  rune: string;

  /** 봉인석 마법봉인 */
  MagicProps: MagicPropsCareAbout[];

  /** 장착 중인 정수 이름 */
  Spells: string[];
}
const cracksInit: CracksType = {
  rune: "선지자의 봉인석 (지능+마법공격력)",
  MagicProps: ["atk_mg", "strn", "Accu"],
  Spells: ["선지자의 정수 (지능+적중)", "선지자의 정수 (지능+적중)", "선지자의 정수 (지능+적중)", "선지자의 정수 (지능+적중)", "선지자의 정수 (지능+적중)"]
};

export const crackSlice = createSlice({
  name: 'Crack',
  initialState: cracksInit,
  reducers: {
    SetRune: (s, { payload }: PayloadAction<string>) => {
      s.rune = payload;
    },
    SetSpell: (s, { payload: [index, value] }: PayloadAction<[number, string]>) => {
      s.Spells[index] = value;
    },
    SetMagicProps: (s, { payload: [index, value] }: PayloadAction<[number, MagicPropsCareAbout]>) => {
      s.MagicProps[index] = value;
    },
    NextMagicProps: (s, { payload: index }: PayloadAction<number>)=> {
      const { level, rarity } = getItem(s.rune)
      const mint = getAvailableMagicPropsForEquip("봉인석", level, rarity, index === 0)
      const current = s.MagicProps[index]
      const next = mint.cycle[current]
      s.MagicProps[index] = next
    }
  }
});

export const {
  SetRune, SetSpell, SetMagicProps, NextMagicProps
} = crackSlice.actions;
