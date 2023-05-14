import { createSlice } from "@reduxjs/toolkit";
import { perfectTonic } from "../../constants";
import { customSkillInit2 } from "./customSkillInit";

interface V5State {
  currentID: string
  SavedChars: SavedCharCollection
  Tonic: TonicState
  EnemyTarget: EnemyTargetState
  EquipPresets: EquipPresetCollection
  CustomSkill: CustomSkillOneAttackSpec[]
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
  CustomSkill: customSkillInit2,
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