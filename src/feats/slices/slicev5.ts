import { encode as encodeB64 } from 'base64-arraybuffer'
import { parse as parseUUID, v4 as uuidv4 } from 'uuid'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { avatarParts } from '../../avatar'
import { perfectGuild, perfectTonic } from '../../constants'
import { dfclassNames } from '../../dfclass'
import { accessParts, armorParts, getItem, oneEmblemParts } from '../../items'
import { deepCopy } from '../../utils'
import initCharState, { initCustomSkill } from './initState'


type SetAttrAction = PayloadAction<[keyof NumberCalibrate, number]>
type SkillIncPayloadType = PayloadAction<[number, number]>

type ItemPartSetter = 
| [Exclude<WholePart, "정수" | "아티팩트" >, ItemIdentifier]
| ["정수", number, ItemIdentifier]
| ["아티팩트", ArtifactColor, ItemIdentifier]

function newID() {
  const uuid = uuidv4()
  const bin = parseUUID(uuid)
  const id = encodeB64(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return id
}

function createNew(state: V5State, draft: V5State, src: DFCharState) {
  const id = newID()
  draft.currentID = id
  draft.SavedChars.IDs.unshift(id)
  draft.SavedChars.byID[id] = {
    id,
    TimeStamp: Date.now(),
    DFChar: deepCopy(src),
  }
}

function selectMe(state: V5State) {
  return state.SavedChars.byID[state.currentID].DFChar
}



interface V5State {
  currentID: string

  /** @deprecated */
  My: DFCharState

  SavedChars: SavedCharCollection
  Tonic: TonicState
  EnemyTarget: EnemyTargetState
  EquipPresets: EquipPresetCollection
  CustomSkill: CustomSkillOneAttackSpec[]
  CustomSkillPresets: CustomSkillPresetCollection
}

export const initV5: V5State = {
  currentID: '',
  My: initCharState,
  SavedChars: {
    byID: {},
    IDs: []
  },
  Tonic: perfectTonic,
  EnemyTarget: {
    Defense: 19500,
    ElRes: 0
  },
  EquipPresets: {
    byID: {},
    IDs: []
  },
  CustomSkill: initCustomSkill,
  CustomSkillPresets: {
    byID: {},
    IDs: []
  }
}

export const dfSlice = createSlice({
  name: "DFChar",
  initialState: initV5,
  reducers: {
    //#region SaveReducer
    CreateDF: (state) => {
      createNew(state, state, initCharState)
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
      createNew(state, state, initCharState)
    },
    ImportDF: (state, { payload }: PayloadAction<DFCharState>) => {
      createNew(state, state, payload)
    },
    CloneDF: (state) => {
      createNew(state, state, state.SavedChars.byID[state.currentID].DFChar)
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

    // #region Self
    SetMyName: (state, { payload }: PayloadAction<string>) => {
      const my = selectMe(state)
      my.Self.myName = payload
    },
    SetMyDFClass: (state, { payload }: PayloadAction<DFClassName>) => {
      const my = selectMe(state)
      if (dfclassNames.includes(payload)) my.Self.dfclass = payload
    },
    SetMyLevel: (state, { payload }: PayloadAction<number>) => {
      const my = selectMe(state)
      my.Self.level = payload
    },
    SetMyAchieveLevel: (state, { payload }: PayloadAction<number>) => {
      const my = selectMe(state)
      my.Self.achieveLevel = payload
    },
    SetMyAtkFixed: (state, pay : PayloadAction<number>) => {
      const my = selectMe(state)
      my.Self.atkFixed = pay.payload
    },
    // #endregion

    // #region Item
    SetMyItem: (state, { payload }: PayloadAction<ItemPartSetter>) => {
      const my = selectMe(state)
      if ( payload[0] == "정수" || payload[0] == "아티팩트" ) {
        my.Item[payload[0]][payload[1]] = payload[2]
      } else {
        my.Item[payload[0]] = payload[1]
      }
    },
    SetMySpellAll: (state, { payload: id }: PayloadAction<ItemIdentifier>) => {
      const my = selectMe(state)
      my.Item["정수"].fill(id)
    },
    FetchMyItems: (state, { payload: items }: PayloadAction<Partial<ItemsState>>) => {
      const my = selectMe(state)
      Object.assign(my.Item, items)
    },
    // #endregion

    // #region Card
    SetMyCard: (state, { payload: [part, id] }: PayloadAction<[CardablePart, ItemIdentifier]>) => {
      const my = selectMe(state)
      my.Card[part] = id
    },
    SetMyCardsAllPossible: (state, { payload: id }: PayloadAction<ItemIdentifier>) => {
      const my = selectMe(state)
      const card = getItem(id)
      const possible = card?.part ?? []
      console.log(card)
      possible.forEach(part => my.Card[part] = id)
    },
    FetchCards: (state, { payload: cards }: PayloadAction<Partial<CardState>>) => {
      const my = selectMe(state)
      Object.assign(my.Card, cards)
    },
    // #endregion

    // #region Emblem
    SetMyEmblem: (state, { payload: [part, index, emblemType, emblemLevel] }: PayloadAction<[CardablePart, number, EmblemType, number]>) => {
      const my = selectMe(state)
      my.Emblem[part][index] = [emblemType, emblemLevel]
    },
    DecreaseMyEmblemLevel: (state, { payload: [part, index] }: PayloadAction<[Exclude<CardablePart, "무기"|"보조장비"|"칭호">, number]>) => {
      const my = selectMe(state)
      const level = my.Emblem[part][index][1]
      let nextLevel = level - 1
      if (nextLevel < 3) nextLevel = 10
      my.Emblem[part][index][1] = nextLevel
    },
    SetMyEmblemLevelAll: (state, { payload: level }: PayloadAction<number>) => {
      const my = selectMe(state)
      oneEmblemParts.forEach(part => my.Emblem[part].forEach(sp => sp[1] = level))
    },
    FetchMyEmblems: (state, { payload: emblems }: PayloadAction<EmblemState>) => {
      const my = selectMe(state)
      Object.assign(my.Emblem, emblems)
    },
    // #endregion

    //#region MagicProps
    SetMyMagicProps: (state, { payload: [part, index, magicProps]}: PayloadAction<[MagicPropsPart, number, MagicPropsCareAbout]>) => {
      const my = selectMe(state)
      my.MagicProps[part][index] = magicProps
    },
    PerfectMyMagicProps: (state)=> {
      const my = selectMe(state)
      armorParts.forEach(part => my.MagicProps[part] = ["Stat", "Stat", "Stat"])
      my.MagicProps["무기"][0] = "dmg_inc"
      my.MagicProps["무기"].fill("Stat", 1, 3)
    },
    PerfectMyMagicPropsEl: (state, { payload: p }: PayloadAction<"el_fire" | "el_ice" | "el_lght" | "el_dark"> ) => {
      const my = selectMe(state)
      accessParts.forEach(part => my.MagicProps[part] = [p, p, p])
    },
    FetchMyMagicProps: (state, { payload }: PayloadAction<MagicPropsState>) => {
      const my = selectMe(state)
      Object.assign(my.MagicProps, payload)
    },
    // #endregion

    //#region Upgrade
    SetMyUpgradeValue: (state, { payload: [part, value] }: PayloadAction<[EquipPart, number]>) => {
      const my = selectMe(state)
      my.Upgrade[part] = value
    },
    SetMyArmorUpgradeAll: (state, { payload }: PayloadAction<number>) => {
      const my = selectMe(state)
      armorParts.forEach(part => my.Upgrade[part] = payload)
    },
    SetMyAccessUpgradeAll: (state, { payload }: PayloadAction<number>) => {
      const my = selectMe(state)
      accessParts.forEach(part => my.Upgrade[part] = payload)
    },
    FetchMyUpgrades: (state, { payload }: PayloadAction<UpgradeOrKaledoState>) => {
      const my = selectMe(state)
      Object.assign(my.Upgrade, payload)
    },
    // #endregion

    //#region Material
    SetMyMaterial: (state, { payload: [part, value] }: PayloadAction<[ArmorPart, ArmorMaterial]>) => {
      const my = selectMe(state)
      my.Material[part] = value
    },
    SetMyMaterialAll: (state, { payload }: PayloadAction<ArmorMaterial>) => {
      const my = selectMe(state)
      armorParts.forEach(part => my.Material[part] = payload)
    },
    FetchMyMaterials: (state, { payload }: PayloadAction<MaterialState>) => {
      const my = selectMe(state)
      Object.assign(my.Material, payload)
    },
    //#endregion

    //#region Avatar
    SetMyAvatarRarity: (state, { payload: [part, rarity] }: PayloadAction<[WearAvatarPart, "Uncommon" | "Rare"]>) => {
      const my = selectMe(state)
      my.Avatar[part] = rarity
    },
    SetMyAvatarRarityAll: (state, { payload }: PayloadAction<"Uncommon" | "Rare">) => {
      const my = selectMe(state)
      avatarParts.forEach(part => my.Avatar[part] = payload)
    },
    //#endregion
  
    //#region Guild
    SetMyGuildBuffLevel: (state, { payload }: PayloadAction<[keyof GuildState, number]>) => {
      const my = selectMe(state)
      my.Guild[payload[0]] = payload[1]
    },
    PerfectMyGuild: (state) => {
      const my = selectMe(state)
      Object.assign(my.Guild, perfectGuild)
    },
    FetchMyGuild: (state, { payload }: PayloadAction<GuildState>) => {
      const my = selectMe(state)
      Object.assign(my.Guild, payload)
    },
    //#endregion

    //#region CreatureValue
    SetMyCreatureStat: (state, { payload }: PayloadAction<number>) => {
      const my = selectMe(state)
      my.CreatureValue.Creature = payload
    },
    SetMyArtifactValue: (state, { payload: [attr_name, value] }: PayloadAction<[ArtifactColor, number]>) => {
      const my = selectMe(state)
      my.CreatureValue[attr_name] = value
    },
    //#endregion

    //#region Choice
    SetMyChoiceOfBranch: (state, { payload: [key, value] }: PayloadAction<[string, OptionalChoiceType]>) => {
      const my = selectMe(state)
      my.Choice.branches[key] = value;
    },
    SetMyChoiceOfGives: (state, { payload: [key, value] }: PayloadAction<[string, OptionalChoiceType]>) => {
      const my = selectMe(state)
      my.Choice.gives[key] = value;
    },
    SetMyChoiceOfExclusive: (state, { payload: [key, value] }: PayloadAction<[string, string]>) => {
      const my = selectMe(state)
      my.Choice.exclusives[key] = value;
    },
    DeleteMyChoice: (state, { payload: [type, key] }: PayloadAction<["branches" | "gives" | "exclusives", string]>) => {
      const my = selectMe(state)
      delete my.Choice[type][key]
    },
    //#endregion

    //#region Calibrate
    SetMyCaliSingleAttr: (state, { payload: [key, value] }: SetAttrAction) => {
      const my = selectMe(state)
      value? my.Calibrate[key] = value : delete my.Calibrate[key]
    },
    SetMyCaliSkillInc: (state, { payload: [index, value] }: SkillIncPayloadType) => {
      const my = selectMe(state)
      my.Calibrate.sk_inc[index] = value
    },
    AddMyCaliSkillInc: (state) => {
      const my = selectMe(state)
      my.Calibrate.sk_inc.push(0)
    },
    DeleteMyCaliSkillInc: (state, { payload }: PayloadAction<number>) => {
      const my = selectMe(state)
      if (my.Calibrate.sk_inc.length > 1) my.Calibrate.sk_inc.splice(payload, 1)
    },
    SetMyCaliEltype: (state, { payload: [ el, on ] }: PayloadAction<[Eltype, boolean]>) => {
      const my = selectMe(state)
      if (on && !my.Calibrate.eltype.includes(el)) my.Calibrate.eltype.push(el)
      else if (!on && my.Calibrate.eltype.includes(el)) my.Calibrate.eltype.splice(my.Calibrate.eltype.indexOf(el), 1)
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
    }
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
