import { createSlice } from "@reduxjs/toolkit";
import { perfectTonic } from "../../constants";
import myState, { customSkillInit } from "./initState";

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

const initialState: V5State = {
  currentID: '',
  My: myState,
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
  CustomSkill: customSkillInit,
  CustomSkillPresets: {
    byID: {},
    IDs: []
  }
}

export const bigFuckingSlice = createSlice({
  name: "DFM",
  initialState,
  reducers: {

  }
})

export const {

} = bigFuckingSlice.caseReducers
