import { createAction } from "@reduxjs/toolkit";

function fuckyou<T>() { return (t: T) => ({ payload: t }) }
export const ImportDFChar = createAction("DFM/Import", fuckyou<DFCharState>())
