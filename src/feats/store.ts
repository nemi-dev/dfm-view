import { configureStore } from "@reduxjs/toolkit"
import { creatureSlice, profileSlice } from "./slice"
import { crackSlice } from "./slices/cracksSlice"
import { tonicSlice } from "./slices/tonicSlice"
import { guildSlice } from "./slices/guildSlice"
import { equipSlice, switchSlice } from "./slices/equipSlice"
import { avatarSlice } from "./slices/avatarSlice"
import { calibrateSlice } from "./slices/calibrateSlice"
import { skillInputSlice } from "./slices/skillInputSlice"

export const store = configureStore({
  reducer: {
    Equips : equipSlice.reducer,
    Avatar: avatarSlice.reducer,
    Tonic: tonicSlice.reducer,
    Crack: crackSlice.reducer,
    Creature: creatureSlice.reducer,
    Guild: guildSlice.reducer,
    Profile: profileSlice.reducer,
    Switch: switchSlice.reducer,
    Calibrate: calibrateSlice.reducer,
    SkillInput: skillInputSlice.reducer
  }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

