import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { accessParts, armorParts, getItem, oneEmblemParts } from "../../items"
import initState from "./initState"

const { Item, Card, Emblem, MagicProps, Upgrade, Material } = initState


export const itemSlice = createSlice({
  name: "Item",
  initialState: Item,
  reducers: {
    SetItem: (s, { payload: [part, id] }: PayloadAction<[SingleItemPart, ItemIdentifier]>) => {
      s[part] = id
    },
    SetSpell: (s, { payload: [index, id] }: PayloadAction<[number, ItemIdentifier]>) => {
      s["정수"][index] = id
    },
    SetSpellAll: (s, { payload: id }: PayloadAction<ItemIdentifier>) => {
      s["정수"].fill(id)
    },
    SetArtifact: (s, { payload: [ color, id ] }: PayloadAction<["Red"|"Green"|"Blue", ItemIdentifier]>) => {
      s["아티팩트"][color] = id
    },
    FetchItems: (s, { payload: items }: PayloadAction<Partial<ItemsState>>) => {
      Object.assign(s, items)
    },
  },
})
export const {
  SetItem, SetSpell, SetSpellAll, SetArtifact, FetchItems
} = itemSlice.actions



export const cardSlice = createSlice({
  name: "Card",
  initialState: Card,
  reducers: {
    SetCard: (s, { payload: [part, id] }: PayloadAction<[CardablePart, ItemIdentifier]>) => {
      s[part] = id
    },
    SetCardsAllPossible: (s, { payload: id }: PayloadAction<ItemIdentifier>) => {
      const card = getItem(id)
      const possible = card?.part ?? []
      console.log(card)
      possible.forEach(part => s[part] = id)
    },
    FetchCards: (s, { payload: cards }: PayloadAction<CardState>) => {
      Object.assign(s, cards)
    }
  },
})
export const {
  SetCard, SetCardsAllPossible, FetchCards
} = cardSlice.actions




export const emblemSlice = createSlice({
  name: "Emblem",
  initialState: Emblem,
  reducers: {
    SetEmblem: (s, { payload: [part, index, emblemType, emblemLevel] }: PayloadAction<[CardablePart, number, EmblemType, number]>) => {
      s[part][index] = [emblemType, emblemLevel]
    },
    DecreaseEmblemLevel: (s, { payload: [part, index] }: PayloadAction<[Exclude<CardablePart, "무기"|"보조장비"|"칭호">, number]>) => {
      const level = s[part][index][1]
      let nextLevel = level - 1
      if (nextLevel < 5) nextLevel = 10
      s[part][index][1] = nextLevel
    },
    SetColorEmblemLevelAll: (s, { payload: level }: PayloadAction<number>) => {
      oneEmblemParts.forEach(part => s[part].forEach(sp => sp[1] = level))
    },
    FetchEmblems: (s, { payload: emblems }: PayloadAction<EmblemState>) => {
      Object.assign(s, emblems)
    }
  },
})
export const {
  SetEmblem, DecreaseEmblemLevel, SetColorEmblemLevelAll, FetchEmblems
} = emblemSlice.actions



export const magicPropsSlice = createSlice({
  name: "MagicProps",
  initialState: MagicProps,
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
  },
})
export const {
  SetMagicProps, SetPerfectMagicPropsStat, SetPerfectMagicPropsEl, FetchMagicProps
} = magicPropsSlice.actions



export const upgradeSlice = createSlice({
  name: "Upgrade",
  initialState: Upgrade,
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
  },
})
export const {
  SetUpgradeValue, SetArmorUpgradeAll, SetAccessUpgradeAll, FetchUpgrades
} = upgradeSlice.actions


export const materialSlice = createSlice({
  name: "Material",
  initialState: Material,
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
  },
})
export const {
  SetMaterial, SetMaterialAll, FetchMaterials
} = materialSlice.actions


