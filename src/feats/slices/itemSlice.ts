import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { accessParts, armorParts, getItem, oneEmblemParts } from "../../items"
import _initState from "./initStateN.json"


const itemsInit = _initState.Item as ItemsState
export const itemSlice = createSlice({
  name: "Item",
  initialState: itemsInit,
  reducers: {
    SetItem: (s, { payload: [part, itemName] }: PayloadAction<[Exclude<WholePart, "정수">, string]>) => {
      s[part] = itemName
    },
    FetchItems: (s, { payload: items }: PayloadAction<Partial<Omit<ItemsState, "정수">>>) => {
      Object.assign(s, items)
    },
    SetSpell: (s, { payload: [index, itemName] }: PayloadAction<[number, string]>) => {
      s["정수"][index] = itemName
    },
    SetSpellAll: (s, { payload: itemName }: PayloadAction<string>) => {
      s["정수"].fill(itemName)
    },
    FetchSpells: (s, { payload }: PayloadAction<string[]>) => {
      s["정수"] = payload
    }
  }
})
export const {
  SetItem, FetchItems, SetSpell, SetSpellAll, FetchSpells
} = itemSlice.actions



const cardsInit = _initState.Card as CardState
export const cardSlice = createSlice({
  name: "Card",
  initialState: cardsInit,
  reducers: {
    SetCard: (s, { payload: [part, cardName] }: PayloadAction<[CardablePart, string]>) => {
      s[part] = cardName
    },
    SetCardsAllPossible: (s, { payload: cardName }: PayloadAction<string>) => {
      const card = getItem(cardName) as Card
      const possible = card?.part ?? []
      possible.forEach(part => s[part] = cardName)
    },
    FetchCards: (s, { payload: cards }: PayloadAction<CardState>) => {
      Object.assign(s, cards)
    }
  }
})
export const {
  SetCard, SetCardsAllPossible, FetchCards
} = cardSlice.actions




const emblemInit = _initState.Emblem as EmblemState
export const emblemSlice = createSlice({
  name: "Emblem",
  initialState: emblemInit,
  reducers: {
    SetEmblem: (s, { payload: [part, index, emblemType, emblemLevel] }: PayloadAction<[CardablePart, number, EmblemType, number]>) => {
      s[part][index] = [emblemType, emblemLevel as EmblemLevel]
    },
    SetColorEmblemLevelAll: (s, { payload: level }: PayloadAction<number>) => {
      oneEmblemParts.forEach(part => s[part].forEach(sp => sp[1] = level as EmblemLevel))
    },
    FetchEmblems: (s, { payload: emblems }: PayloadAction<EmblemState>) => {
      Object.assign(s, emblems)
    }
  }
})
export const {
  SetEmblem, SetColorEmblemLevelAll, FetchEmblems
} = emblemSlice.actions



const magicPropsInit = _initState.MagicProps as MagicPropsState
export const magicPropsSlice = createSlice({
  name: "MagicProps",
  initialState: magicPropsInit,
  reducers: {
    SetMagicProps: (s, { payload: [part, index, magicProps]}: PayloadAction<[MagicPropsPart, number, MagicPropsCareAbout]>) => {
      s[part][index] = magicProps
    },
    SetPerfectMagicPropsStat: (s)=> {
      armorParts.forEach(part => s[part] = ["Stat", "Stat", "Stat"])
      s["무기"][0] = "dmg_inc"
      s["무기"].fill("Stat", 1, 3)
    },
    SetPerfectMagicPropsEl: (s, { payload: p }: PayloadAction<"el_fire" | "el_ice" | "el_lght" | "el_dark"> ) => {
      accessParts.forEach(part => s[part] = [p, p, p])
    },
    FetchMagicProps: (s, { payload }: PayloadAction<MagicPropsState>) => {
      Object.assign(s, payload)
    }
  }
})
export const {
  SetMagicProps, SetPerfectMagicPropsStat, SetPerfectMagicPropsEl, FetchMagicProps
} = magicPropsSlice.actions



const upgradeInit = _initState.Upgrade as UpgradeOrKaledoState
export const upgradeSlice = createSlice({
  name: "Upgrade",
  initialState: upgradeInit,
  reducers: {
    SetUpgradeValue: (s, { payload: [part, value] }: PayloadAction<[EquipPart, number]>) => {
      s[part] = value
    },
    SetArmorUpgradeAll: (s, { payload }: PayloadAction<number>) => {
      armorParts.forEach(part => s[part] = payload)
    },
    SetAccessUpgradeAll: (s, { payload }: PayloadAction<number>) => {
      accessParts.forEach(part => s[part] = payload)
    },
    FetchUpgrades: (s, { payload }: PayloadAction<UpgradeOrKaledoState>) => {
      Object.assign(s, payload)
    }
  }
})
export const {
  SetUpgradeValue, SetArmorUpgradeAll, SetAccessUpgradeAll, FetchUpgrades
} = upgradeSlice.actions


const materialInit = _initState.Material as MaterialState
export const materialSlice = createSlice({
  name: "Material",
  initialState: materialInit,
  reducers: {
    SetMaterial: (s, { payload: [part, value] }: PayloadAction<[ArmorPart, ArmorMaterial]>) => {
      s[part] = value
    },
    SetMaterialAll: (s, { payload }: PayloadAction<ArmorMaterial>) => {
      armorParts.forEach(part => s[part] = payload)
    },
    FetchMaterials: (s, { payload }: PayloadAction<MaterialState>) => {
      Object.assign(s, payload)
    }
  }
})
export const {
  SetMaterial, SetMaterialAll, FetchMaterials
} = materialSlice.actions
