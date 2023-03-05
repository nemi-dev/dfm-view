import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { armorParts, getItem } from "../../items"
import { getAvailableMagicPropsForEquip } from "../../magicProps"

import _equipInit from "./equipInit.json"
const equipInit: EquipsType = _equipInit as EquipsType

interface DF_TitlePartType {
  name: string
  emblems: EmblemSpec[]
  card: string
}


interface EquipsType {

  무기: EquipPartType

  상의: ArmorPartType
  하의: ArmorPartType
  머리어깨: ArmorPartType
  벨트: ArmorPartType
  신발: ArmorPartType

  팔찌: EquipPartType
  목걸이: EquipPartType
  반지: EquipPartType

  보조장비: EquipPartType

  칭호: DF_TitlePartType

}

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
      (["상의", "하의", "머리어깨", "벨트", "신발", "팔찌", "목걸이", "반지"] as EquipPart[]).forEach(part => s[part].emblems.forEach(sp => sp[1] = payload))
    },
    SetEquipUpgradeValue: (s, { payload: [part, value] }: PayloadAction<[EquipPart, number]>) => {
      s[part].upgrade = value
    },
    SetArmorUpgradeValueAll: (s, { payload }: PayloadAction<number>) => {
      armorParts.forEach(part => s[part].upgrade = payload)
    },
    SetAccessUpgradeValueAll: (s, { payload }: PayloadAction<number>) => {
      ["팔찌", "목걸이", "반지"].forEach(part => s[part].upgrade = payload)
    },
    SetMaterial: (s, { payload: [part, value] }: PayloadAction<[ArmorPart, ArmorMaterial]>) => {
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
      const mint = getAvailableMagicPropsForEquip(part, level, rarity, index === 0)
      const current = s[part].magicProps[index]
      const next = mint.cycle[current]
      s[part].magicProps[index] = next
    },
    SetPerfectMagicPropsStat: (s, { payload: p }: PayloadAction<"strn" | "intl">)=> {
      armorParts.forEach(part => {
        s[part].magicProps = [p, p, p]
      })
      s.무기.magicProps[0] = "dmg_inc"
      s.무기.magicProps.fill(p, 1, 3)
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

