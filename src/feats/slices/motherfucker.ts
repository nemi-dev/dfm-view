import { createAction } from "@reduxjs/toolkit";

function fuckyou<T>() { return (t: T) => ({ payload: t }) }
export const DFCharLoad = createAction("DFM/Load", fuckyou<DFCharState>())
