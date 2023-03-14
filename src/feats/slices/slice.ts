import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import initState from "./initState"
const { Self } = initState


export const selfSlice = createSlice({
  name: 'Self',
  initialState: Self,
  reducers: {
    SetMyName: (s, { payload }: PayloadAction<string>) => {
      s.myName = payload
    },
    SetDFClass: (s, { payload }: PayloadAction<DFClassName>) => {
      s.dfclass = payload
    },
    SetLevel: (s, { payload }: PayloadAction<number>) => {
      s.level = payload
    },
    SetAchieveLevel: (s, { payload }: PayloadAction<number>) => {
      s.achieveLevel = payload
    },
    SetAtype: (s, { payload }: PayloadAction<Atype>) => {
      s.atype = payload
    },
    set_atk_fixed: (s, pay : PayloadAction<number>) => {
      s.atk_fixed = pay.payload
    },
  }
})

export const {
  SetMyName,
  SetDFClass,
  SetLevel,
  SetAchieveLevel,
  SetAtype,
  set_atk_fixed,
} = selfSlice.actions



export const currentIDSlice = createSlice({
  name: 'currentID',
  initialState: {
    value: "Set this later"
  },
  reducers: { }
})



const creatureInit: CreaturePropState = 
{
  CreatureStat: 156,
  RedPropsValue: 50,
  BluePropsValue: 50,
  GreenPropsEl: 10,
}

export const creatureSlice = createSlice({
  name: 'CreatureProp',
  initialState: creatureInit,
  reducers: {
    SetCreatureStat: (s, { payload }: PayloadAction<number>) => {
      s.CreatureStat = payload
    },
    SetArtifactValue: (s, { payload: [attr_name, value] }: PayloadAction<["RedPropsValue"|"GreenPropsValue"|"BluePropsValue", number]>) => {
      s[attr_name] = value
    }
  }
})


export const {
  SetCreatureStat,
  SetArtifactValue
} = creatureSlice.actions




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
  reducers: { }
})

