import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getItem } from "../../items"
import { getAvailableMagicPropsForEquip } from "../../magicProps"

import _equipInit from "./equipInit.json"
const equipInit: EquipsType = _equipInit as EquipsType

interface EquipPartType {
  name: string

  /** 힘/지능 또는 물리/마법 공격력 증가 수치 */
  upgrade: number
  magicProps: MagicPropsCareAbout[]
  emblems: EmblemSpec[]
  card: string
}

interface ArmorPartType extends EquipPartType {
  material: ArmorMaterial
}

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
    SetEquipUpgradeValue: (s, { payload: [part, value] }: PayloadAction<[EquipPart, number]>) => {
      s[part].upgrade = value
    },
    SetArmorUpgradeValueAll: (s, { payload }: PayloadAction<number>) => {
      s["상의"].upgrade = payload
      s["하의"].upgrade = payload
      s["머리어깨"].upgrade = payload
      s["벨트"].upgrade = payload
      s["신발"].upgrade = payload
    },
    SetMaterial: (s, { payload: [part, value] }: PayloadAction<[ArmorPart, ArmorMaterial]>) => {
      s[part].material = value
    },
    SetEquipShotgun: (s, { payload }: PayloadAction<Record<EquipPart, string>>) => {
      for (const key in payload) {
        s[key as EquipPart].name = payload[key]
      }
      // Object.assign(s, payload)
    },
    NextMagicProps: (s, { payload: [part, index] }: PayloadAction<[EquipPart, number]>)=> {
      const { level, rarity } = getItem(s[part].name)
      const mint = getAvailableMagicPropsForEquip(part, level, rarity, index === 0)
      const current = s[part].magicProps[index]
      const next = mint.cycle[current]
      s[part].magicProps[index] = next
    }
  }
})


export const {
  SetArmorUpgradeValueAll,
  SetEquip,
  SetCard,
  SetEmblem,
  SetEquipUpgradeValue,
  SetMaterial,
  NextMagicProps,
  SetEquipShotgun
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

