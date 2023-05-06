import { createSlice } from "@reduxjs/toolkit";
import { perfectTonic } from "../../constants";

interface V5State {
  currentID: string
  SavedChars: SavedCharCollection
  Tonic: TonicState
  EnemyTarget: EnemyTargetState
  EquipPresets: EquipPresetCollection
  CustomSkill: SkillOneAttackSpec[]
  CustomSkillPresets: CustomSkillPresetCollection
}

const initialState: V5State = {
  currentID: '',
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
  CustomSkill: [],
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