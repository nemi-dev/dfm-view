import type { PersistedState } from "redux-persist"
import produce from "immer"

export function migrate2to3(state: State_v2._RootState & PersistedState) {
  return produce(state, draft => {
    draft["CustomSkill"] = state.CustomSklill.cases
    delete draft.CustomSklill
  })
}

export function migrate3to4(state: State_v3._RootState & PersistedState) {
  return produce(state, draft => {
    const CreatureProp = state.My.CreatureProp
    const CreatureValue: CreaturePropState = {
      Creature: CreatureProp.CreatureStat,
      Red: CreatureProp.RedPropsValue,
      Green: CreatureProp.GreenPropsEl,
      Blue: CreatureProp.BluePropsValue
    }
    draft.My["CreatureValue"] = CreatureValue
    delete draft.My.CreatureProp
  })
}
