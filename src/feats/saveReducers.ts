import { createAction, Reducer } from "@reduxjs/toolkit"
import { v4 as uuidv4, parse as parseUUID } from 'uuid'
import { produce } from "immer"
import { encode as encodeB64 } from "base64-arraybuffer"

import { deepCopy } from "../utils"
import { RootState } from "./store"
import initState from "./slices/initState"

function newID() {
  const uuid = uuidv4()
  const bin = parseUUID(uuid)
  const id = encodeB64(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return id
}


function fuckyou<T>() { return (t: T) => ({ payload: t }) }

export const ImportDF = createAction("DFM/Import", fuckyou<DFCharState>())
export const LoadDF = createAction("DFM/Load", fuckyou<string>())
export const SaveDF = createAction("DFM/Save", fuckyou<void>())
export const CloneDF = createAction("DFM/Clone", fuckyou<void>())
export const CreateDF = createAction("DFM/New", fuckyou<void>())
export const InitChar = createAction("DFM/Init", fuckyou<void>())
export const DeleteDFChar = createAction("DFM/Delete", fuckyou<string>())

export const SaveEquip = createAction("DFM/SaveEquip", fuckyou<void>())
export const LoadEquip = createAction("DFM/LoadEquip", fuckyou<string>())
export const DeleteEquip = createAction("DFM/DeleteEquip", fuckyou<string>())
export const ImportEquip = createAction("DFM/ImportEquip", fuckyou<Pick<ItemsState, EquipPart>>())

export const SaveSkill = createAction("DFM/SaveSkill", fuckyou<void>())
export const LoadSkill = createAction("DFM/LoadSkill", fuckyou<string>())
export const DeleteSkill = createAction("DFM/DeleteSkill", fuckyou<string>())
export const ImportSkill = createAction("DFM/ImportSkill", fuckyou<CustomSkillState>())






function commit(state: RootState, draft: RootState) {
  const currentID = state.currentID
  const currentIdIndex = state.SavedChars.IDs.indexOf(currentID)
  draft.SavedChars.byID[currentID].DFChar = deepCopy(state.My)
  draft.SavedChars.IDs.splice(currentIdIndex, 1)
  draft.SavedChars.IDs.unshift(currentID)
}

function createNew(state: RootState, draft: RootState, src: DFCharState, doCommit: boolean) {
  if (doCommit) commit(state, draft)
  const id = newID()
  draft.My = deepCopy(src)
  draft.currentID = id
  draft.SavedChars.IDs.unshift(id)
  draft.SavedChars.byID[id] = {
    id: id,
    TimeStamp: Date.now(),
    DFChar: deepCopy(src),
    AtkGrab: 0,
  }
  console.log(draft)
}

export const SaveReducer: Reducer<RootState, ReturnType<typeof SaveDF>> = 
function Saver(state: RootState, action: { type: string, payload: any }) {
  if (action.type != SaveDF.type) return state
  return produce(state, draft => {
    commit(state, draft)
  })
}

export const LoadReducer: Reducer<RootState, ReturnType<typeof LoadDF>> =
function Loader(state: RootState, action) {
  if (action.type != LoadDF.type) return state
  const id: string = action.payload

  if (id === state.currentID) return state
  const saved = state.SavedChars.byID[id]
  return produce(state, draft => {
    commit(state, draft)
    draft.My = deepCopy(saved.DFChar)
    draft.currentID = id
  })
}

type CreatorReducerActionType = 
typeof CreateDF | typeof InitChar | typeof ImportDF | typeof CloneDF
export const CreatorReducer: Reducer<RootState, ReturnType<CreatorReducerActionType>> =
function (state: RootState, action) {
  switch (action.type) {
    case CreateDF.type:
      return produce(state, draft => {
        createNew(state, draft, initState, true)
      })
    case InitChar.type:
      if (state.currentID) return state
      return produce(state, draft => {
        createNew(state, draft, initState, false)
      })

    case ImportDF.type:
      return produce(state, draft => {
        createNew(state, draft, action.payload, true)
      })
    
    case CloneDF.type:
      return produce(state, draft => {
        createNew(state, draft, state.My, true)
      })
    
    default: return state
  }
}
