import { createSlice, PayloadAction } from "@reduxjs/toolkit"


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

