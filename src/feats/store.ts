import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { creatureSlice, profileSlice } from "./slices/slice"
import { crackSlice } from "./slices/cracksSlice"
import { tonicSlice } from "./slices/tonicSlice"
import { guildSlice } from "./slices/guildSlice"
import { equipSlice, switchSlice } from "./slices/equipSlice"
import { avatarSlice } from "./slices/avatarSlice"
import { calibrateSlice } from "./slices/calibrateSlice"
import { skillInputSlice } from "./slices/skillInputSlice"
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"
import storage from "redux-persist/lib/storage"

/*
const reducers = 

combineReducers({
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
})

const persistedReducer = persistReducer({
  key: "root",
  version: 1, 
  storage
}, reducers)





export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
  },
})

*/

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

