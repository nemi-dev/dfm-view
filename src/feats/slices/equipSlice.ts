import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { accessParts, armorParts, getItem, oneEmblemParts } from "../../items"
import { avMagicProps, nextMagicProps } from "../../magicProps"


import _initState from "./initState.json"
const equipInit: EquipsType = _initState.Equips as EquipsType




export const equipSlice = createSlice({
  name: 'Equip',
  initialState: equipInit,
  reducers: {
    SetEquip: (s, { payload: [part, name] }: PayloadAction<[EquipPart, string]>) => {
      s[part].name = name
    },
    SetCard: (s, { payload: [part, cardName] }: PayloadAction<[EquipPart, string]>) => {
      s[part].card = cardName
    },
    SetEmblem: (s, { payload: [part, index, emblemType, emblemLevel] }: PayloadAction<[EquipPart, number, EmblemType, number]>) => {
      s[part].emblems[index] = [emblemType, emblemLevel as EmblemLevel]
    },
    SetColorEmblemLevelAll: (s, { payload }: PayloadAction<EmblemLevel>) => {
      oneEmblemParts.forEach(part => s[part].emblems.forEach(sp => sp[1] = payload))
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
      s[part].material = value
    },
    SetMaterialAll: (s, { payload }: PayloadAction<ArmorMaterial>) => {
      armorParts.forEach(part => s[part].material = payload)
    },
    SetEquips: (s, { payload }: PayloadAction<Record<EquipPart, string>>) => {
      for (const key in payload) {
        s[key as EquipPart].name = payload[key]
      }
    },
    NextMagicProps: (s, { payload: [part, index] }: PayloadAction<[EquipPart, number]>)=> {
      const { level, rarity } = getItem(s[part].name)
      const current = s[part].magicProps[index]
      s[part].magicProps[index] = nextMagicProps(
        part, current, level, rarity, index === 0)
    },
    SetPerfectMagicPropsStat: (s)=> {
      armorParts.forEach(part => {
        s[part].magicProps = ["Stat", "Stat", "Stat"]
      })
      s["무기"].magicProps[0] = "dmg_inc"
      s["무기"].magicProps.fill("Stat", 1, 3)
    },
    SetPerfectMagicPropsEl: (s, { payload: p }: PayloadAction<"el_fire" | "el_ice" | "el_lght" | "el_dark"> ) => {
      s.팔찌.magicProps = [p, p, p]
      s.목걸이.magicProps = [p, p, p]
      s.반지.magicProps = [p, p, p]
    }
  }
})


export const {
  SetEquip,
  SetCard,
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



interface ConditionalSelectors {
  branches: Record<string, boolean>
  gives: Record<string, boolean>
  exclusives: Record<string, string>
}

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

