import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { avatarParts } from '../../avatar'
import { perfectGuild } from '../../constants'
import { dfclassNames } from '../../dfclass'
import { accessParts, armorParts, getItem, oneEmblemParts } from '../../items'
import initialState from './initState'

type ItemPartSetter = 
| [Exclude<WholePart, "정수" | "아티팩트" >, ItemIdentifier]
| ["정수", number, ItemIdentifier]
| ["아티팩트", ArtifactColor, ItemIdentifier]

type SetAttrAction = PayloadAction<[keyof NumberCalibrate, number]>
type SkillIncPayloadType = PayloadAction<[number, number]>

export const dfcharSlice = createSlice({
  name: 'ThisDFChar',
  initialState,
  reducers: {
    // #region Self
    SetMyName: (state, { payload }: PayloadAction<string>) => {
      state.Self.myName = payload
    },
    SetMyDFClass: (state, { payload }: PayloadAction<DFClassName>) => {
      if (dfclassNames.includes(payload)) state.Self.dfclass = payload
    },
    SetMyLevel: (state, { payload }: PayloadAction<number>) => {
      state.Self.level = payload
    },
    SetMyAchieveLevel: (state, { payload }: PayloadAction<number>) => {
      state.Self.achieveLevel = payload
    },
    SetMyAtkFixed: (state, pay : PayloadAction<number>) => {
      state.Self.atkFixed = pay.payload
    },
    // #endregion

    // #region Item
    SetMyItem: (state, { payload }: PayloadAction<ItemPartSetter>) => {
      if ( payload[0] == "정수" || payload[0] == "아티팩트" ) {
        state.Item[payload[0]][payload[1]] = payload[2]
      } else {
        state.Item[payload[0]] = payload[1]
      }
    },
    SetMySpellAll: (state, { payload: id }: PayloadAction<ItemIdentifier>) => {
      state.Item["정수"].fill(id)
    },
    FetchMyItems: (state, { payload: items }: PayloadAction<Partial<ItemsState>>) => {
      Object.assign(state.Item, items)
    },
    // #endregion

    // #region Card
    SetMyCard: (state, { payload: [part, id] }: PayloadAction<[CardablePart, ItemIdentifier]>) => {
      state.Card[part] = id
    },
    SetMyCardsAllPossible: (state, { payload: id }: PayloadAction<ItemIdentifier>) => {
      const card = getItem(id)
      const possible = card?.part ?? []
      console.log(card)
      possible.forEach(part => state.Card[part] = id)
    },
    FetchCards: (state, { payload: cards }: PayloadAction<Partial<CardState>>) => {
      Object.assign(state.Card, cards)
    },
    // #endregion

    // #region Emblem
    SetMyEmblem: (state, { payload: [part, index, emblemType, emblemLevel] }: PayloadAction<[CardablePart, number, EmblemType, number]>) => {
      state.Emblem[part][index] = [emblemType, emblemLevel]
    },
    DecreaseMyEmblemLevel: (state, { payload: [part, index] }: PayloadAction<[Exclude<CardablePart, "무기"|"보조장비"|"칭호">, number]>) => {
      const level = state.Emblem[part][index][1]
      let nextLevel = level - 1
      if (nextLevel < 3) nextLevel = 10
      state.Emblem[part][index][1] = nextLevel
    },
    SetMyEmblemLevelAll: (state, { payload: level }: PayloadAction<number>) => {
      oneEmblemParts.forEach(part => state.Emblem[part].forEach(sp => sp[1] = level))
    },
    FetchMyEmblems: (state, { payload: emblems }: PayloadAction<EmblemState>) => {
      Object.assign(state.Emblem, emblems)
    },
    // #endregion

    //#region MagicProps
    SetMyMagicProps: (state, { payload: [part, index, magicProps]}: PayloadAction<[MagicPropsPart, number, MagicPropsCareAbout]>) => {
      state.MagicProps[part][index] = magicProps
    },
    PerfectMyMagicProps: (state)=> {
      armorParts.forEach(part => state.MagicProps[part] = ["Stat", "Stat", "Stat"])
      state.MagicProps["무기"][0] = "dmg_inc"
      state.MagicProps["무기"].fill("Stat", 1, 3)
    },
    PerfectMyMagicPropsEl: (state, { payload: p }: PayloadAction<"el_fire" | "el_ice" | "el_lght" | "el_dark"> ) => {
      accessParts.forEach(part => state.MagicProps[part] = [p, p, p])
    },
    FetchMyMagicProps: (state, { payload }: PayloadAction<MagicPropsState>) => {
      Object.assign(state.MagicProps, payload)
    },
    // #endregion

    //#region Upgrade
    SetMyUpgradeValue: (state, { payload: [part, value] }: PayloadAction<[EquipPart, number]>) => {
      state.Upgrade[part] = value
    },
    SetMyArmorUpgradeAll: (state, { payload }: PayloadAction<number>) => {
      armorParts.forEach(part => state.Upgrade[part] = payload)
    },
    SetMyAccessUpgradeAll: (state, { payload }: PayloadAction<number>) => {
      accessParts.forEach(part => state.Upgrade[part] = payload)
    },
    FetchMyUpgrades: (state, { payload }: PayloadAction<UpgradeOrKaledoState>) => {
      Object.assign(state.Upgrade, payload)
    },
    // #endregion

    //#region Material
    SetMyMaterial: (state, { payload: [part, value] }: PayloadAction<[ArmorPart, ArmorMaterial]>) => {
      state.Material[part] = value
    },
    SetMyMaterialAll: (state, { payload }: PayloadAction<ArmorMaterial>) => {
      armorParts.forEach(part => state.Material[part] = payload)
    },
    FetchMyMaterials: (state, { payload }: PayloadAction<MaterialState>) => {
      Object.assign(state.Material, payload)
    },
    //#endregion

    //#region Avatar
    SetMyAvatarRarity: (state, { payload: [part, rarity] }: PayloadAction<[WearAvatarPart, "Uncommon" | "Rare"]>) => {
      state.Avatar[part] = rarity
    },
    SetMyAvatarRarityAll: (state, { payload }: PayloadAction<"Uncommon" | "Rare">) => {
      avatarParts.forEach(part => state.Avatar[part] = payload)
    },
    //#endregion
  
    //#region Guild
    SetMyGuildBuffLevel: (state, { payload }: PayloadAction<[keyof GuildState, number]>) => {
      state.Guild[payload[0]] = payload[1]
    },
    PerfectMyGuild: (state) => {
      Object.assign(state.Guild, perfectGuild)
    },
    FetchMyGuild: (state, { payload }: PayloadAction<GuildState>) => {
      Object.assign(state.Guild, payload)
    },
    //#endregion

    //#region CreatureValue
    SetMyCreatureStat: (state, { payload }: PayloadAction<number>) => {
      state.CreatureValue.Creature = payload
    },
    SetMyArtifactValue: (state, { payload: [attr_name, value] }: PayloadAction<[ArtifactColor, number]>) => {
      state.CreatureValue[attr_name] = value
    },
    //#endregion

    //#region Choice
    SetMyChoiceOfBranch: (state, { payload: [key, value] }: PayloadAction<[string, OptionalChoiceType]>) => {
      state.Choice.branches[key] = value;
    },
    SetMyChoiceOfGives: (state, { payload: [key, value] }: PayloadAction<[string, OptionalChoiceType]>) => {
      state.Choice.gives[key] = value;
    },
    SetMyChoiceOfExclusive: (state, { payload: [key, value] }: PayloadAction<[string, string]>) => {
      state.Choice.exclusives[key] = value;
    },
    DeleteMyChoice: (state, { payload: [type, key] }: PayloadAction<["branches" | "gives" | "exclusives", string]>) => {
      delete state.Choice[type][key]
    },
    //#endregion

    //#region Calibrate
    SetMyCaliSingleAttr: (state, { payload: [key, value] }: SetAttrAction) => {
      value? state.Calibrate[key] = value : delete state.Calibrate[key]
    },
    SetMyCaliSkillInc: (state, { payload: [index, value] }: SkillIncPayloadType) => {
      state.Calibrate.sk_inc[index] = value
    },
    AddMyCaliSkillInc: (state) => {
      state.Calibrate.sk_inc.push(0)
    },
    DeleteMyCaliSkillInc: (state, { payload }: PayloadAction<number>) => {
      if (state.Calibrate.sk_inc.length > 1) state.Calibrate.sk_inc.splice(payload, 1)
    },
    SetMyCaliEltype: (state, { payload: [ el, on ] }: PayloadAction<[Eltype, boolean]>) => {
      if (on && !state.Calibrate.eltype.includes(el)) state.Calibrate.eltype.push(el)
      else if (!on && state.Calibrate.eltype.includes(el)) state.Calibrate.eltype.splice(state.Calibrate.eltype.indexOf(el), 1)
    }
    //#endregion
  }
})




export const {
  SetMyName,
  SetMyDFClass,
  SetMyLevel,
  SetMyAchieveLevel,
  SetMyAtkFixed,

  SetMyItem,
  SetMySpellAll,
  FetchMyItems,

  SetMyCard, 
  SetMyCardsAllPossible, 
  FetchCards,

  SetMyEmblem,
  DecreaseMyEmblemLevel,
  SetMyEmblemLevelAll,
  FetchMyEmblems,

  SetMyMagicProps,
  PerfectMyMagicProps,
  PerfectMyMagicPropsEl,
  FetchMyMagicProps,

  SetMyUpgradeValue,
  SetMyArmorUpgradeAll,
  SetMyAccessUpgradeAll,
  FetchMyUpgrades,

  SetMyMaterial,
  SetMyMaterialAll,
  FetchMyMaterials,

  SetMyAvatarRarity,
  SetMyAvatarRarityAll,

  SetMyGuildBuffLevel,
  PerfectMyGuild,
  FetchMyGuild,

  SetMyCreatureStat,
  SetMyArtifactValue,

  SetMyChoiceOfBranch,
  SetMyChoiceOfGives,
  SetMyChoiceOfExclusive,
  DeleteMyChoice,

  SetMyCaliSingleAttr,
  SetMyCaliSkillInc,
  AddMyCaliSkillInc,
  DeleteMyCaliSkillInc,
  SetMyCaliEltype,
} = dfcharSlice.actions
