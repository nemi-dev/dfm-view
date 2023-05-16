import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { customSkillInit } from './initState'

export const currentIDSlice = createSlice({
  name: 'currentID',
  initialState: '' as string,
  reducers: { }
})


const enemyTargetInit: EnemyTargetState = {
  Defense: 19500,
  ElRes: 0
}

export const enemyTargetSlice = createSlice({
  name: "EnemyTarget",
  initialState: enemyTargetInit,
  reducers: {
    SetEnemyDefense: (s, pay : PayloadAction<number>) => {
      s.Defense = pay.payload
    },
    SetEnemyResist: (s, pay : PayloadAction<number>) => {
      s.ElRes = pay.payload
    },
  }
})

export const {
  SetEnemyDefense,
  SetEnemyResist,
} = enemyTargetSlice.actions



const initSavedCharState: SavedCharCollection = {
  byID: {},
  IDs: []
}
export const savedCharSlice = createSlice({
  name: "SavedChars",
  initialState: initSavedCharState,
  reducers: {
    MoveDFCharUp: (state, { payload: id }: PayloadAction<string>) => {
      const index = state.IDs.indexOf(id)
      if (index > 0) {
        state.IDs.splice(index, 1)
        state.IDs.splice(index - 1, 0, id)
      }
    },
    MoveDFCharDown: (state, { payload: id }: PayloadAction<string>) => {
      const index = state.IDs.indexOf(id)
      if (index > -1 && index < state.IDs.length - 1) {
        state.IDs.splice(index, 1)
        state.IDs.splice(index + 1, 0, id)
      }
    }
  }
})

export const {
  MoveDFCharUp, MoveDFCharDown
} = savedCharSlice.actions

const equipPresetInit: EquipPresetCollection = {
  byID: {},
  IDs: []
}
export const equipPresetSlice = createSlice({
  name: "EquipPresets",
  initialState: equipPresetInit,
  reducers: { }
})

const skillPresetInit: CustomSkillPresetCollection = {
  byID: {},
  IDs: []
}
export const skillPresetSlice = createSlice({
  name: "CustomSkillPresets",
  initialState: skillPresetInit,
  reducers: { }
})

export const skillInputSlice = createSlice({
  name: "CustomSkill",
  initialState: customSkillInit,
  reducers: {

    SetSkillInputName: (s, { payload: [index, val] }: PayloadAction<[number, string]>) => {
      s[index].name = val
    },
    SetSkillValue: (s, { payload: [index, val] }: PayloadAction<[number, number]>) => {
      s[index].value = val
    },
    SetSkillFixValue: (s, { payload: [index, val] }: PayloadAction<[number, number]>) => {
      s[index].fixed = val
    },
    SetSkillMaxHit: (s, { payload: [index, val] }: PayloadAction<[number, number]>) => {
      s[index].hit = Math.max(val, 1)
    },
    SetSkillUsesSkillInc: (s, { payload: [index, val] }: PayloadAction<[number, boolean]>) => {
      s[index].isSkill = val
    }
  }
})

export const {
  SetSkillInputName,
  SetSkillValue,
  SetSkillFixValue,
  SetSkillMaxHit,
  SetSkillUsesSkillInc,
} = skillInputSlice.actions
