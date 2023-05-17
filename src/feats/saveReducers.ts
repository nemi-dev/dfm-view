import { createAction, createReducer } from "@reduxjs/toolkit"
import { v4 as uuidv4, parse as parseUUID } from 'uuid'
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



function createNew(state: RootState, draft: RootState, src: DFCharState) {
  const id = newID()
  draft.currentID = id
  draft.SavedChars.IDs.unshift(id)
  draft.SavedChars.byID[id] = {
    id,
    TimeStamp: Date.now(),
    DFChar: deepCopy(src),
  }
}

export const saveReducerV4 = createReducer({} as RootState, builder => {
  builder
  .addCase(CreateDF, (state) => {
    createNew(state, state, initState)
  })
  .addCase(SaveDF, (state) => {
  })
  .addCase(LoadDF, (state, action) => {
    const id = action.payload
    if (id === state.currentID || !state.SavedChars.IDs.includes(id)) return
    state.currentID = id
  })
  .addCase(DeleteDFChar, (state, action) => {
    const id = action.payload
    if (id === state.currentID || !state.SavedChars.IDs.includes(id)) return
    delete state.SavedChars.byID[id]
    const index = state.SavedChars.IDs.indexOf(id)
    state.SavedChars.IDs.splice(index, 1)
  })
  .addCase(InitChar, (state) => {
    createNew(state, state, initState)
  })
  .addCase(ImportDF, (state, action) => {
    createNew(state, state, action.payload)
  })
  .addCase(CloneDF, (state) => {
    createNew(state, state, state.SavedChars.byID[state.currentID].DFChar)
  })
})
