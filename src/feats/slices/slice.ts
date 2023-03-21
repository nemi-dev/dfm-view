import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { dfclassNames } from "../../dfclass"
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
      if (dfclassNames.includes(payload)) s.dfclass = payload
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
    SetAtkFixed: (s, pay : PayloadAction<number>) => {
      s.atkFixed = pay.payload
    },
  }
})

export const {
  SetMyName,
  SetDFClass,
  SetLevel,
  SetAchieveLevel,
  SetAtype,
  SetAtkFixed,
} = selfSlice.actions



export const currentIDSlice = createSlice({
  name: 'currentID',
  initialState: '' as string,
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
    SetArtifactValue: (s, { payload: [attr_name, value] }: PayloadAction<["RedPropsValue"|"GreenPropsEl"|"BluePropsValue", number]>) => {
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

