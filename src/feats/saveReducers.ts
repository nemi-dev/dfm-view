import { createAction, Reducer } from "@reduxjs/toolkit"
import { v4 as uuidv4, parse as parseUUID } from 'uuid'
import { produce } from "immer"
import { encode as encodeB64 } from "base64-arraybuffer"

import { deepCopy } from "../utils"
import { RootState } from "./store"
import initState from "./slices/initState"
import { selectMyDamage } from "./selector/selectors"

function newID() {
  const uuid = uuidv4()
  const bin = parseUUID(uuid)
  const id = encodeB64(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return id
}


function fuckyou<T>() { return (t: T) => ({ payload: t }) }

export const ImportDF = createAction("DFM/Import", fuckyou<DFCharState>())
export const LoadDF = createAction("DFM/Load", fuckyou<string>())
export const SaveDF = createAction("DFM/Save")
export const CloneDF = createAction("DFM/Clone")
export const CreateDF = createAction("DFM/New")
export const InitChar = createAction("DFM/Init")
export const DeleteDFChar = createAction("DFM/Delete", fuckyou<string>())

export const SaveEquip = createAction("DFM/SaveEquip")
export const LoadEquip = createAction("DFM/LoadEquip", fuckyou<string>())
export const DeleteEquip = createAction("DFM/DeleteEquip", fuckyou<string>())
export const ImportEquip = createAction("DFM/ImportEquip", fuckyou<Pick<ItemsState, EquipPart>>())

export const SaveSkill = createAction("DFM/SaveSkill")
export const LoadSkill = createAction("DFM/LoadSkill", fuckyou<string>())
export const DeleteSkill = createAction("DFM/DeleteSkill", fuckyou<string>())
export const ImportSkill = createAction("DFM/ImportSkill", fuckyou<CustomSkillState>())




function commit(state: RootState, draft: RootState) {
  const currentID = state.currentID
  draft.SavedChars.byID[currentID].DFChar = deepCopy(state.My)
  draft.SavedChars.byID[currentID].DamageGrab = selectMyDamage(state)
}

function createNew(state: RootState, draft: RootState, src: DFCharState, doCommit: boolean) {
  if (doCommit) commit(state, draft)
  const id = newID()
  draft.My = deepCopy(src)
  draft.currentID = id
  draft.SavedChars.IDs.unshift(id)
  draft.SavedChars.byID[id] = {
    id,
    TimeStamp: Date.now(),
    DFChar: deepCopy(src),
    DamageGrab: 0,
  }
}

export const NewReducer: Reducer<RootState,
ReturnType<typeof CreateDF>> =
function NewReducer(state, action) {
  if (action.type != CreateDF.type) return state
  return produce(state, draft => {
    createNew(state, draft, initState, true)
  })
}

// @ts-ignore
export const SaveReducer: Reducer<RootState, 
ReturnType<typeof SaveDF>> = 
function Saver(state, action) {
  if (action.type != SaveDF.type) return state
  return produce(state, draft => {
    commit(state, draft)
  })
}

// @ts-ignore
export const LoadReducer: Reducer<RootState,
ReturnType<typeof LoadDF>> =
function Loader(state, action) {
  if (action.type != LoadDF.type) return state
  const id = action.payload

  if (id === state.currentID || !state.SavedChars.IDs.includes(id)) return state
  const saved = state.SavedChars.byID[id]
  return produce(state, draft => {
    commit(state, draft)
    draft.My = deepCopy(saved.DFChar)
    draft.currentID = id
  })
}

// @ts-ignore
export const DeleteReducer: Reducer<RootState,
ReturnType<typeof DeleteDFChar>> =
function Deleter(state, action) {
  if (action.type != DeleteDFChar.type) return state
  const id = action.payload
  if (id === state.currentID || !state.SavedChars.IDs.includes(id)) return state
  return produce(state, draft => {
    delete draft.SavedChars.byID[id]
    const index = draft.SavedChars.IDs.indexOf(id)
    draft.SavedChars.IDs.splice(index, 1)
  })
}


// @ts-ignore
export const CreatorReducer: Reducer<RootState,
ReturnType<typeof InitChar | typeof ImportDF | typeof CloneDF>
> =
function (state, action) {
  switch (action.type) {
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
