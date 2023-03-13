import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { accessParts, armorParts, getItem, oneEmblemParts } from "../../items"
import _initState from "./initStateMt.json"
import { ImportDFChar } from "../actions"


const itemsInit = _initState.Item as ItemsState
export const itemSlice = createSlice({
  name: "Item",
  initialState: itemsInit,
  reducers: {
    SetItem: (s, { payload: [part, itemName] }: PayloadAction<[SingleItemPart, string]>) => {
      s[part] = itemName
    },
    SetSpell: (s, { payload: [index, itemName] }: PayloadAction<[number, string]>) => {
      s["정수"][index] = itemName
    },
    SetSpellAll: (s, { payload: itemName }: PayloadAction<string>) => {
      s["정수"].fill(itemName)
    },
    SetArtifact: (s, { payload: [ color, name ] }: PayloadAction<["Red"|"Green"|"Blue", string]>) => {
      s["아티팩트"][color] = name
    },
    FetchItems: (s, { payload: items }: PayloadAction<Partial<ItemsState>>) => {
      Object.assign(s, items)
    },
  },
  extraReducers: builder => {
    builder.addCase(ImportDFChar, (state, { payload }) => {
      Object.assign(state, payload.Item)
    })
  },
})
export const {
  SetItem, SetSpell, SetSpellAll, SetArtifact, FetchItems
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
      const card = getItem(cardName)
      const possible = card?.part ?? []
      possible.forEach(part => s[part] = cardName)
    },
    FetchCards: (s, { payload: cards }: PayloadAction<CardState>) => {
      Object.assign(s, cards)
    }
  },
  extraReducers: builder => {
    builder.addCase(ImportDFChar, (s, { payload }) => {
      Object.assign(s, payload.Card)
    })
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
  extraReducers: builder => {
    builder.addCase(ImportDFChar, (s, { payload }) => {
      Object.assign(s, payload)
    })
  }
})
export const {
  SetEmblem, DecreaseEmblemLevel, SetColorEmblemLevelAll, FetchEmblems
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
  },
  extraReducers: builder => {
    builder.addCase(ImportDFChar, (s, { payload }) => {
      Object.assign(s, payload.MagicProps)
    })
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
  },
  extraReducers: builder => {
    builder.addCase(ImportDFChar, (s, { payload }) => {
      Object.assign(s, payload.Upgrade)
    })
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
  },
  extraReducers: builder => {
    builder.addCase(ImportDFChar, (s, { payload }) => {
      Object.assign(s, payload.Material)
    })
  }
})
export const {
  SetMaterial, SetMaterialAll, FetchMaterials
} = materialSlice.actions


