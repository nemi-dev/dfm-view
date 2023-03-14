import { createAction } from "@reduxjs/toolkit";


function fuckyou<T>() { return (t: T) => ({ payload: t }) }
export const FetchDFChar = createAction("DFM/FetchChar", fuckyou<SavedChar>())


export const ImportDFChar = createAction("DFM/Import", fuckyou<DFCharState>())
export const Load = createAction("DFM/Load", fuckyou<string>())
export const Save = createAction("DFM/Save", fuckyou<void>())
export const CreateNew = createAction("DFM/New", fuckyou<string>())
export const DeleteDFChar = createAction("DFM/Delete", fuckyou<string>())