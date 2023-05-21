import { encode as encodeB64 } from 'base64-arraybuffer'
import { parse as parseUUID, v4 as uuidv4 } from 'uuid'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { avatarParts } from '../../avatar'
import { perfectGuild, perfectTonic } from '../../constants'
import { dfclassNames } from '../../dfclass'
import { accessParts, armorParts, getItem, oneEmblemParts } from '../../items'
import { deepCopy } from '../../utils'
import { initCharState, initCustomSkill } from './initState'
import { selectDFChar } from '../selector/baseSelectors'


type SetAttrAction = PayloadAction<[keyof NumberCalibrate, number]>
type SkillIncPayloadType = PayloadAction<[number, number]>

type ItemPartSetter = 
| [string | undefined, Exclude<WholePart, "정수" | "아티팩트" >, ItemIdentifier]
| [string | undefined, "정수", number, ItemIdentifier]
| [string | undefined, "아티팩트", ArtifactColor, ItemIdentifier]

type ItemFetcher = {
  id?: string,
  items: Partial<ItemsState>
}

function newID() {
  const uuid = uuidv4()
  const bin = parseUUID(uuid)
  const id = encodeB64(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return id
}

function createNew(draft: V5State, src: DFCharState) {
  const id = newID()
  draft.currentID = id
  draft.SavedChars.IDs.unshift(id)
  draft.SavedChars.byID[id] = {
    id,
    TimeStamp: Date.now(),
    ...deepCopy(src),
  }
}



export const initV5: V5State = {
  currentID: '',
  SavedChars: {
    byID: {}, IDs: []
  },
  Tonic: perfectTonic,
  EnemyTarget: {
    Defense: 19500,
    ElRes: 0
  },
  EquipPresets: {
    byID: {}, IDs: []
  },
  CustomSkill: initCustomSkill,
  CustomSkillPresets: {
    byID: {}, IDs: []
  }
}

export const dfSlice = createSlice({
  name: "DFChar",
  initialState: initV5,
  reducers: {
    //#region SaveReducer
    CreateDF: (state) => {
      createNew(state, initCharState)
    },
    LoadDF: (state, { payload: id }: PayloadAction<string>) => {
      if (id === state.currentID || !state.SavedChars.IDs.includes(id)) return
      state.currentID = id
    },
    DeleteDFChar: (state, { payload: id }: PayloadAction<string>) => {
      if (id === state.currentID || !state.SavedChars.IDs.includes(id)) return
      delete state.SavedChars.byID[id]
      const index = state.SavedChars.IDs.indexOf(id)
      state.SavedChars.IDs.splice(index, 1)
    },
    InitChar: (state) => {
      if (!state.currentID) createNew(state, initCharState)
    },
    ImportDF: (state, { payload }: PayloadAction<DFCharState>) => {
      createNew(state, payload)
    },
    CloneDF: (state) => {
      createNew(state, state.SavedChars.byID[state.currentID])
    },
    MoveDFCharUp: (state, { payload: id }: PayloadAction<string>) => {
      const index = state.SavedChars.IDs.indexOf(id)
      if (index > 0) {
        state.SavedChars.IDs.splice(index, 1)
        state.SavedChars.IDs.splice(index - 1, 0, id)
      }
    },
    MoveDFCharDown: (state, { payload: id }: PayloadAction<string>) => {
      const index = state.SavedChars.IDs.indexOf(id)
      if (index > -1 && index < state.SavedChars.IDs.length - 1) {
        state.SavedChars.IDs.splice(index, 1)
        state.SavedChars.IDs.splice(index + 1, 0, id)
      }
    },
    //#endregion



    // #region DFChar
    SetMyName: (state, { payload }: PayloadAction<string>) => {
      const dfch = selectDFChar(state)
      dfch.name = payload
    },
    SetMyDFClass: (state, { payload }: PayloadAction<DFClassName>) => {
      const dfch = selectDFChar(state)
      if (dfclassNames.includes(payload)) dfch.dfclass = payload
    },
    SetMyLevel: (state, { payload }: PayloadAction<number>) => {
      const dfch = selectDFChar(state)
      dfch.level = payload
    },
    SetMyAchieveLevel: (state, { payload }: PayloadAction<number>) => {
      const dfch = selectDFChar(state)
      dfch.achieveLevel = payload
    },
    SetMyAtkFixed: (state, pay : PayloadAction<number>) => {
      const dfch = selectDFChar(state)
      dfch.atkFixed = pay.payload
    },
    // #endregion



    // #region Item
    SetItem: (state, { payload }: PayloadAction<ItemPartSetter>) => {
      const [charID, ...p] = payload
      const dfch = selectDFChar(state, charID)
      if ( p[0] == "정수" || p[0] == "아티팩트" ) {
        dfch.Item[p[0]][p[1]] = p[2]
      } else {
        dfch.Item[p[0]] = p[1]
      }
    },
    SetSpellAll: (state, { payload: [currentID, itemID] }: PayloadAction<[string, ItemIdentifier]>) => {
      const dfch = selectDFChar(state, currentID)
      dfch.Item["정수"].fill(itemID)
    },
    SetItems: (state, { payload: { id, items } }: PayloadAction<ItemFetcher>) => {
      const dfch = selectDFChar(state, id)
      if (items.정수) {
        Object.assign(dfch.Item.정수, items.정수)
        delete items.정수
      }
      if (items.아티팩트) {
        Object.assign(dfch.Item.아티팩트, items.아티팩트)
        delete items.아티팩트
      }
      Object.assign(dfch.Item, items)
    },
    // #endregion



    // #region Card
    SetMyCard: (state, { payload: [part, id] }: PayloadAction<[CardablePart, ItemIdentifier]>) => {
      const dfch = selectDFChar(state)
      dfch.Card[part] = id
    },
    SetMyCardsAllPossible: (state, { payload: id }: PayloadAction<ItemIdentifier>) => {
      const dfch = selectDFChar(state)
      const card = getItem(id)
      const possible = card?.part ?? []
      possible.forEach(part => dfch.Card[part] = id)
    },
    FetchCards: (state, { payload: cards }: PayloadAction<Partial<CardState>>) => {
      const dfch = selectDFChar(state)
      Object.assign(dfch.Card, cards)
    },
    // #endregion



    // #region Emblem
    SetMyEmblem: (state, { payload: [part, index, emblemType, emblemLevel] }: PayloadAction<[CardablePart, number, EmblemType, number]>) => {
      const dfch = selectDFChar(state)
      dfch.Emblem[part][index] = [emblemType, emblemLevel]
    },
    DecreaseMyEmblemLevel: (state, { payload: [part, index] }: PayloadAction<[Exclude<CardablePart, "무기"|"보조장비"|"칭호">, number]>) => {
      const dfch = selectDFChar(state)
      const level = dfch.Emblem[part][index][1]
      let nextLevel = level - 1
      if (nextLevel < 3) nextLevel = 10
      dfch.Emblem[part][index][1] = nextLevel
    },
    SetMyEmblemLevelAll: (state, { payload: level }: PayloadAction<number>) => {
      const dfch = selectDFChar(state)
      oneEmblemParts.forEach(part => dfch.Emblem[part].forEach(sp => sp[1] = level))
    },
    FetchMyEmblems: (state, { payload: emblems }: PayloadAction<EmblemState>) => {
      const dfch = selectDFChar(state)
      Object.assign(dfch.Emblem, emblems)
    },
    // #endregion



    //#region MagicProps
    SetMyMagicProps: (state, { payload: [part, index, magicProps]}: PayloadAction<[MagicPropsPart, number, MagicPropsCareAbout]>) => {
      const dfch = selectDFChar(state)
      dfch.MagicProps[part][index] = magicProps
    },
    PerfectMyMagicProps: (state)=> {
      const dfch = selectDFChar(state)
      armorParts.forEach(part => dfch.MagicProps[part] = ["Stat", "Stat", "Stat"])
      dfch.MagicProps["무기"][0] = "dmg_inc"
      dfch.MagicProps["무기"].fill("Stat", 1, 3)
    },
    PerfectMyMagicPropsEl: (state, { payload: p }: PayloadAction<"el_fire" | "el_ice" | "el_lght" | "el_dark"> ) => {
      const dfch = selectDFChar(state)
      accessParts.forEach(part => dfch.MagicProps[part] = [p, p, p])
    },
    FetchMyMagicProps: (state, { payload }: PayloadAction<MagicPropsState>) => {
      const dfch = selectDFChar(state)
      Object.assign(dfch.MagicProps, payload)
    },
    // #endregion



    //#region Upgrade
    SetMyUpgradeValue: (state, { payload: [part, value] }: PayloadAction<[EquipPart, number]>) => {
      const dfch = selectDFChar(state)
      dfch.Upgrade[part] = value
    },
    SetMyArmorUpgradeAll: (state, { payload }: PayloadAction<number>) => {
      const dfch = selectDFChar(state)
      armorParts.forEach(part => dfch.Upgrade[part] = payload)
    },
    SetMyAccessUpgradeAll: (state, { payload }: PayloadAction<number>) => {
      const dfch = selectDFChar(state)
      accessParts.forEach(part => dfch.Upgrade[part] = payload)
    },
    FetchMyUpgrades: (state, { payload }: PayloadAction<UpgradeOrKaledoState>) => {
      const dfch = selectDFChar(state)
      Object.assign(dfch.Upgrade, payload)
    },
    // #endregion



    //#region Material
    SetMyMaterial: (state, { payload: [part, value] }: PayloadAction<[ArmorPart, ArmorMaterial]>) => {
      const dfch = selectDFChar(state)
      dfch.Material[part] = value
    },
    SetMyMaterialAll: (state, { payload }: PayloadAction<ArmorMaterial>) => {
      const dfch = selectDFChar(state)
      armorParts.forEach(part => dfch.Material[part] = payload)
    },
    FetchMyMaterials: (state, { payload }: PayloadAction<MaterialState>) => {
      const dfch = selectDFChar(state)
      Object.assign(dfch.Material, payload)
    },
    //#endregion



    //#region Avatar
    SetMyAvatarRarity: (state, { payload: [part, rarity] }: PayloadAction<[WearAvatarPart, "Uncommon" | "Rare"]>) => {
      const dfch = selectDFChar(state)
      dfch.Avatar[part] = rarity
    },
    SetMyAvatarRarityAll: (state, { payload }: PayloadAction<"Uncommon" | "Rare">) => {
      const dfch = selectDFChar(state)
      avatarParts.forEach(part => dfch.Avatar[part] = payload)
    },
    //#endregion
  


    //#region Guild
    SetMyGuildBuffLevel: (state, { payload }: PayloadAction<[keyof GuildState, number]>) => {
      const dfch = selectDFChar(state)
      dfch.Guild[payload[0]] = payload[1]
    },
    PerfectMyGuild: (state) => {
      const dfch = selectDFChar(state)
      Object.assign(dfch.Guild, perfectGuild)
    },
    FetchMyGuild: (state, { payload }: PayloadAction<GuildState>) => {
      const dfch = selectDFChar(state)
      Object.assign(dfch.Guild, payload)
    },
    //#endregion



    //#region CreatureValue
    SetMyCreatureStat: (state, { payload }: PayloadAction<number>) => {
      const dfch = selectDFChar(state)
      dfch.CreatureValue.Creature = payload
    },
    SetMyArtifactValue: (state, { payload: [attr_name, value] }: PayloadAction<[ArtifactColor, number]>) => {
      const dfch = selectDFChar(state)
      dfch.CreatureValue[attr_name] = value
    },
    //#endregion



    //#region Choice
    SetMyChoiceOfBranch: (state, { payload: [key, value] }: PayloadAction<[string, OptionalChoiceType]>) => {
      const dfch = selectDFChar(state)
      dfch.Choice.branches[key] = value;
    },
    SetMyChoiceOfGives: (state, { payload: [key, value] }: PayloadAction<[string, OptionalChoiceType]>) => {
      const dfch = selectDFChar(state)
      dfch.Choice.gives[key] = value;
    },
    SetMyChoiceOfExclusive: (state, { payload: [key, value] }: PayloadAction<[string, string]>) => {
      const dfch = selectDFChar(state)
      dfch.Choice.exclusives[key] = value;
    },
    DeleteMyChoice: (state, { payload: [type, key] }: PayloadAction<["branches" | "gives" | "exclusives", string]>) => {
      const dfch = selectDFChar(state)
      delete dfch.Choice[type][key]
    },
    //#endregion



    //#region Calibrate
    SetMyCaliSingleAttr: (state, { payload: [key, value] }: SetAttrAction) => {
      const dfch = selectDFChar(state)
      value? dfch.Calibrate[key] = value : delete dfch.Calibrate[key]
    },
    SetMyCaliSkillInc: (state, { payload: [index, value] }: SkillIncPayloadType) => {
      const dfch = selectDFChar(state)
      dfch.Calibrate.sk_inc[index] = value
    },
    AddMyCaliSkillInc: (state) => {
      const dfch = selectDFChar(state)
      dfch.Calibrate.sk_inc.push(0)
    },
    DeleteMyCaliSkillInc: (state, { payload }: PayloadAction<number>) => {
      const dfch = selectDFChar(state)
      if (dfch.Calibrate.sk_inc.length > 1) dfch.Calibrate.sk_inc.splice(payload, 1)
    },
    SetMyCaliEltype: (state, { payload: [ el, on ] }: PayloadAction<[Eltype, boolean]>) => {
      const dfch = selectDFChar(state)
      if (on && !dfch.Calibrate.eltype.includes(el)) dfch.Calibrate.eltype.push(el)
      else if (!on && dfch.Calibrate.eltype.includes(el)) dfch.Calibrate.eltype.splice(dfch.Calibrate.eltype.indexOf(el), 1)
    },
    //#endregion



    //#region Tonic
    SetTonic: (state, { payload }: PayloadAction<[keyof TonicState, number]>) => {
      state.Tonic[payload[0]] = payload[1]
    },
    PerfectifyTonic: (state) => {
      Object.assign(state.Tonic, perfectTonic)
    },
    //#endregion



    //#region EnemyTarget
    SetEnemyDefense: (state, pay : PayloadAction<number>) => {
      state.EnemyTarget.Defense = pay.payload
    },
    SetEnemyResist: (state, pay : PayloadAction<number>) => {
      state.EnemyTarget.ElRes = pay.payload
    },
    //#endregion



    //#region CustomSkill
    SetSkillInputName: (state, { payload: [index, val] }: PayloadAction<[number, string]>) => {
      state.CustomSkill[index].name = val
    },
    SetSkillValue: (state, { payload: [index, val] }: PayloadAction<[number, number]>) => {
      state.CustomSkill[index].value = val
    },
    SetSkillFixValue: (state, { payload: [index, val] }: PayloadAction<[number, number]>) => {
      state.CustomSkill[index].fixed = val
    },
    SetSkillMaxHit: (state, { payload: [index, val] }: PayloadAction<[number, number]>) => {
      state.CustomSkill[index].hit = Math.max(val, 1)
    },
    SetSkillUsesSkillInc: (state, { payload: [index, val] }: PayloadAction<[number, boolean]>) => {
      state.CustomSkill[index].isSkill = val
    },
    //#endregion



    //#region Skill
    SetSkillLevel: (state, { payload: [skName, val]}: PayloadAction<[string, number]>) => {
      const dfch = selectDFChar(state)
      dfch.SkillLevelMap[skName] = val
    },

    SetSkillUsageCount: (state, { payload: [skName, val]}: PayloadAction<[string, number]>) => {
      const dfch = selectDFChar(state)
      dfch.SkillUsageCountMap[skName] = val
    },

    SetSkillTP: (state, { payload: [skName, val]}: PayloadAction<[string, number]>) => {
      const dfch = selectDFChar(state)
      dfch.SkillTPMap[skName] = val
    },

    SetSkillChargeup: (state, { payload: [skName, val]}: PayloadAction<[string, boolean]>) => {
      const dfch = selectDFChar(state)
      if (val) dfch.SkillChargeupMap[skName] = true
      else delete dfch.SkillChargeupMap[skName]
    },
    //#endregion
  
  
  }
})

export const {
  InitChar,
  CreateDF,
  LoadDF,
  CloneDF,
  ImportDF,
  DeleteDFChar,

  MoveDFCharDown,
  MoveDFCharUp,

  SetMyName,
  SetMyDFClass,
  SetMyLevel,
  SetMyAchieveLevel,
  SetMyAtkFixed,

  SetItem,
  SetSpellAll,
  SetItems,

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

  SetTonic,
  PerfectifyTonic,

  SetEnemyDefense,
  SetEnemyResist,

  SetSkillInputName,
  SetSkillValue,
  SetSkillFixValue,
  SetSkillMaxHit,
  SetSkillUsesSkillInc,

} = dfSlice.actions
