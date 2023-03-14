import { Reducer } from "@reduxjs/toolkit";
import { produce } from "immer"
import { deepCopy } from "../utils";
import { CreateNew, Load, Save } from "./actions";
import { RootState } from "./store";

function commit(state: RootState, draft: RootState) {
  const currentID = state.currentID.value
  const currentIdIndex = state.SavedChars.IDs.indexOf(currentID)
  draft.SavedChars.byID[currentID].DFChar = deepCopy(state.My)
  draft.SavedChars.IDs.splice(currentIdIndex, 1)
  draft.SavedChars.IDs.unshift(currentID)
}


export const Saver: Reducer<RootState, any> = function (state: RootState, action: { type: string, payload: any }) {
  switch (action.type) {
    case Load.type:
      const id: string = action.payload;
      if (id === state.currentID.value) return state
      const saved = state.SavedChars.byID[id]
      return produce(state, draft => {
        commit(state, draft)
        draft.My = deepCopy(saved.DFChar)
        draft.currentID.value = id
      })

    case Save.type:
      return produce(state, draft => {
        commit(state, draft)
      })
    
    case CreateNew.type:
      return state
    
    default:
      return state
  }
}
