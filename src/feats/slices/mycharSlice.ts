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
    SetMyName: (my, { payload }: PayloadAction<string>) => {
      my.Self.myName = payload
    },
    SetDFClass: (my, { payload }: PayloadAction<DFClassName>) => {
      if (dfclassNames.includes(payload)) my.Self.dfclass = payload
    },
    SetLevel: (my, { payload }: PayloadAction<number>) => {
      my.Self.level = payload
    },
    SetAchieveLevel: (my, { payload }: PayloadAction<number>) => {
      my.Self.achieveLevel = payload
    },
    SetAtkFixed: (my, pay : PayloadAction<number>) => {
      my.Self.atkFixed = pay.payload
    },
    // #endregion

    // #region Item
    SetItem: (my, { payload }: PayloadAction<ItemPartSetter>) => {
      if ( payload[0] == "정수" || payload[0] == "아티팩트" ) {
        my.Item[payload[0]][payload[1]] = payload[2]
      } else {
        my.Item[payload[0]] = payload[1]
      }
    },
    SetSpellAll: (my, { payload: id }: PayloadAction<ItemIdentifier>) => {
      my.Item["정수"].fill(id)
    },
    FetchItems: (my, { payload: items }: PayloadAction<Partial<ItemsState>>) => {
      Object.assign(my.Item, items)
    },
    // #endregion

    // #region Card
    SetCard: (my, { payload: [part, id] }: PayloadAction<[CardablePart, ItemIdentifier]>) => {
      my.Card[part] = id
    },
    SetCardsAllPossible: (my, { payload: id }: PayloadAction<ItemIdentifier>) => {
      const card = getItem(id)
      const possible = card?.part ?? []
      console.log(card)
      possible.forEach(part => my.Card[part] = id)
    },
    FetchCards: (my, { payload: cards }: PayloadAction<Partial<CardState>>) => {
      Object.assign(my.Card, cards)
    },
    // #endregion

    // #region Emblem
    SetEmblem: (my, { payload: [part, index, emblemType, emblemLevel] }: PayloadAction<[CardablePart, number, EmblemType, number]>) => {
      my.Emblem[part][index] = [emblemType, emblemLevel]
    },
    DecreaseEmblemLevel: (my, { payload: [part, index] }: PayloadAction<[Exclude<CardablePart, "무기"|"보조장비"|"칭호">, number]>) => {
      const level = my.Emblem[part][index][1]
      let nextLevel = level - 1
      if (nextLevel < 3) nextLevel = 10
      my.Emblem[part][index][1] = nextLevel
    },
    SetColorEmblemLevelAll: (my, { payload: level }: PayloadAction<number>) => {
      oneEmblemParts.forEach(part => my.Emblem[part].forEach(sp => sp[1] = level))
    },
    FetchEmblems: (my, { payload: emblems }: PayloadAction<EmblemState>) => {
      Object.assign(my.Emblem, emblems)
    },
    // #endregion

    //#region MagicProps
    SetMagicProps: (my, { payload: [part, index, magicProps]}: PayloadAction<[MagicPropsPart, number, MagicPropsCareAbout]>) => {
      my.MagicProps[part][index] = magicProps
    },
    SetPerfectMagicPropsStat: (my)=> {
      armorParts.forEach(part => my.MagicProps[part] = ["Stat", "Stat", "Stat"])
      my.MagicProps["무기"][0] = "dmg_inc"
      my.MagicProps["무기"].fill("Stat", 1, 3)
    },
    SetPerfectMagicPropsEl: (my, { payload: p }: PayloadAction<"el_fire" | "el_ice" | "el_lght" | "el_dark"> ) => {
      accessParts.forEach(part => my.MagicProps[part] = [p, p, p])
    },
    FetchMagicProps: (my, { payload }: PayloadAction<MagicPropsState>) => {
      Object.assign(my.MagicProps, payload)
    },
    // #endregion

    //#region Upgrade
    SetUpgradeValue: (my, { payload: [part, value] }: PayloadAction<[EquipPart, number]>) => {
      my.Upgrade[part] = value
    },
    SetArmorUpgradeAll: (my, { payload }: PayloadAction<number>) => {
      armorParts.forEach(part => my.Upgrade[part] = payload)
    },
    SetAccessUpgradeAll: (my, { payload }: PayloadAction<number>) => {
      accessParts.forEach(part => my.Upgrade[part] = payload)
    },
    FetchUpgrades: (my, { payload }: PayloadAction<UpgradeOrKaledoState>) => {
      Object.assign(my.Upgrade, payload)
    },
    // #endregion

    //#region Material
    SetMaterial: (s, { payload: [part, value] }: PayloadAction<[ArmorPart, ArmorMaterial]>) => {
      s.Material[part] = value
    },
    SetMaterialAll: (s, { payload }: PayloadAction<ArmorMaterial>) => {
      armorParts.forEach(part => s.Material[part] = payload)
    },
    FetchMaterials: (s, { payload }: PayloadAction<MaterialState>) => {
      Object.assign(s.Material, payload)
    },
    //#endregion

    //#region Avatar
    SetAvatarRarity: (s, { payload: [part, rarity] }: PayloadAction<[WearAvatarPart, "Uncommon" | "Rare"]>) => {
      s.Avatar[part] = rarity
    },
    SetAvatarTypeAll: (s, { payload }: PayloadAction<"Uncommon" | "Rare">) => {
      avatarParts.forEach(part => s.Avatar[part] = payload)
    },
    //#endregion
  
    //#region Guild
    SetGuild: (s, { payload }: PayloadAction<[keyof GuildState, number]>) => {
      s.Guild[payload[0]] = payload[1]
    },
    PerfectGuild: (s) => {
      Object.assign(s.Guild, perfectGuild)
    },
    FetchGuild: (s, { payload }: PayloadAction<GuildState>) => {
      Object.assign(s.Guild, payload)
    },
    //#endregion

    //#region CreatureValue
    SetCreatureStat: (s, { payload }: PayloadAction<number>) => {
      s.CreatureValue.Creature = payload
    },
    SetArtifactValue: (s, { payload: [attr_name, value] }: PayloadAction<[ArtifactColor, number]>) => {
      s.CreatureValue[attr_name] = value
    },
    //#endregion

    //#region Choice
    SetBranch: (s, { payload: [key, value] }: PayloadAction<[string, OptionalChoiceType]>) => {
      s.Choice.branches[key] = value;
    },
    SetGives: (s, { payload: [key, value] }: PayloadAction<[string, OptionalChoiceType]>) => {
      s.Choice.gives[key] = value;
    },
    SetExclusive: (s, { payload: [key, value] }: PayloadAction<[string, string]>) => {
      s.Choice.exclusives[key] = value;
    },
    DeleteChoice: (s, { payload: [type, key] }: PayloadAction<["branches" | "gives" | "exclusives", string]>) => {
      delete s[type][key]
    },
    //#endregion

    //#region Calibrate
    SetBasicAttr: (s, { payload: [key, value] }: SetAttrAction) => {
      value? s.Calibrate[key] = value : delete s.Calibrate[key]
    },
    SetSkillInc: (s, { payload: [index, value] }: SkillIncPayloadType) => {
      s.Calibrate.sk_inc[index] = value
    },
    AddSkillInc: (s) => {
      s.Calibrate.sk_inc.push(0)
    },
    RemoveSkillInc: (s, { payload }: PayloadAction<number>) => {
      if (s.Calibrate.sk_inc.length > 1) s.Calibrate.sk_inc.splice(payload, 1)
    },
    SetEltype: (s, { payload: [ el, on ] }: PayloadAction<[Eltype, boolean]>) => {
      if (on && !s.Calibrate.eltype.includes(el)) s.Calibrate.eltype.push(el)
      else if (!on && s.Calibrate.eltype.includes(el)) s.Calibrate.eltype.splice(s.Calibrate.eltype.indexOf(el), 1)
    }
    //#endregion
  }
})




export const {
  SetMyName,
  SetDFClass,
  SetLevel,
  SetAchieveLevel,
  SetAtkFixed,

  SetItem,
  SetSpellAll,
  FetchItems,

  SetCard, 
  SetCardsAllPossible, 
  FetchCards,

  SetEmblem,
  DecreaseEmblemLevel,
  SetColorEmblemLevelAll,
  FetchEmblems,

  SetMagicProps,
  SetPerfectMagicPropsStat,
  SetPerfectMagicPropsEl,
  FetchMagicProps,

  SetUpgradeValue,
  SetArmorUpgradeAll,
  SetAccessUpgradeAll,
  FetchUpgrades,

  SetMaterial,
  SetMaterialAll,
  FetchMaterials,

  SetAvatarRarity,
  SetAvatarTypeAll,

  SetGuild,
  PerfectGuild,
  FetchGuild,

  SetCreatureStat,
  SetArtifactValue,

  SetBranch,
  SetGives,
  SetExclusive,
  DeleteChoice,

  SetBasicAttr,
  SetSkillInc,
  AddSkillInc,
  RemoveSkillInc,
  SetEltype,
} = dfcharSlice.actions
