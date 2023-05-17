import type { PersistedState } from "redux-persist"
import produce from "immer"


export function migrate3to4(state: V3._RootState & PersistedState) {
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
