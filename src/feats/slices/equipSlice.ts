import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { accessParts, armorParts, getItem, isArmorPart, oneEmblemParts } from "../../items"
import { nextMagicProps } from "../../magicProps"


import _initState from "./initState.json"
const equipInit = (_initState.Equips as unknown) as EquipsState

type EquipPartNow = EquipPart | "칭호" | "봉인석"


export const equipSlice = createSlice({
  name: 'Equip',
  initialState: equipInit,
  reducers: {
    SetEquip: (s, { payload: [part, name] }: PayloadAction<[EquipPartNow, string]>) => {
      s[part].name = name
    },
    SetCard: (s, { payload: [part, cardName] }: PayloadAction<[CardablePart, string]>) => {
      s[part].card = cardName
    },
    SetCardsAllPossible: (s, { payload }: PayloadAction<string>) => {
      const card = getItem(payload) as Card
      const possible = card.part ?? []
      possible.forEach(part => s[part].card = payload)
    },
    SetEmblem: (s, { payload: [part, index, emblemType, emblemLevel] }: PayloadAction<[CardablePart, number, EmblemType, number]>) => {
      s[part].emblems[index] = [emblemType, emblemLevel as EmblemLevel]
    },
    SetColorEmblemLevelAll: (s, { payload }: PayloadAction<number>) => {
      oneEmblemParts.forEach(part => s[part].emblems.forEach(sp => sp[1] = payload as EmblemLevel))
    },
    SetEquipUpgradeValue: (s, { payload: [part, value] }: PayloadAction<[EquipPart, number]>) => {
      s[part].upgrade = value
    },
    SetArmorUpgradeValueAll: (s, { payload }: PayloadAction<number>) => {
      armorParts.forEach(part => s[part].upgrade = payload)
    },
    SetAccessUpgradeValueAll: (s, { payload }: PayloadAction<number>) => {
      accessParts.forEach(part => s[part].upgrade = payload)
    },
    SetMaterial: (s, { payload: [part, value] }: PayloadAction<[EquipPart, ArmorMaterial]>) => {
      if (isArmorPart(part)) s[part].material = value
    },
    SetMaterialAll: (s, { payload }: PayloadAction<ArmorMaterial>) => {
      armorParts.forEach(part => s[part].material = payload)
    },
    SetEquips: (s, { payload }: PayloadAction<Record<EquipPart, string>>) => {
      for (const key in payload) s[key].name = payload[key]
    },
    NextMagicProps: (s, { payload: [part, index] }: PayloadAction<[MagicPropsPart, number]>)=> {
      const { level, rarity } = getItem(s[part].name)
      const current = s[part].magicProps[index]
      s[part].magicProps[index] = nextMagicProps(part, current, level, rarity, index === 0)
    },
    SetPerfectMagicPropsStat: (s)=> {
      armorParts.forEach(part => s[part].magicProps = ["Stat", "Stat", "Stat"])
      s["무기"].magicProps[0] = "dmg_inc"
      s["무기"].magicProps.fill("Stat", 1, 3)
    },
    SetPerfectMagicPropsEl: (s, { payload: p }: PayloadAction<"el_fire" | "el_ice" | "el_lght" | "el_dark"> ) => {
      accessParts.forEach(part => s[part].magicProps = [p, p, p])
    }
  }
})


export const {
  SetEquip,
  SetCard,
  SetCardsAllPossible,
  SetEmblem,
  SetColorEmblemLevelAll,
  SetEquipUpgradeValue,
  SetArmorUpgradeValueAll,
  SetAccessUpgradeValueAll,
  SetMaterial,
  SetMaterialAll,
  SetEquips,
  NextMagicProps,
  SetPerfectMagicPropsStat,
  SetPerfectMagicPropsEl
} = equipSlice.actions




const switchInit: ConditionalSelectors = {
  branches: {},
  gives: {},
  exclusives: {}
}

export const switchSlice = createSlice({
  name: 'Switch',
  initialState: switchInit,
  reducers: {
    SetBranch: (s, { payload: [key, value] }: PayloadAction<[string, boolean]>) => {
      s.branches[key] = value
    },
    SetGives: (s, { payload: [key, value] }: PayloadAction<[string, boolean]>) => {
      s.gives[key] = value
    },
    SetExclusive: (s, { payload: [key, value] }: PayloadAction<[string, string]>) => {
      s.exclusives[key] = value
    },
    DeleteSwitch: (s, { payload: [type, key] }: PayloadAction<["branches" | "gives" | "exclusives", string]>) => {
      if (type === "exclusives") delete s[type][key]
      else s[type][key] = false
    }
  }
})

export const {
  SetBranch,
  SetGives,
  SetExclusive,
  DeleteSwitch
} = switchSlice.actions

