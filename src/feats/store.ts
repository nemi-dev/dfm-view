import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { creatureSlice, profileSlice } from "./slices/slice"
// import { crackSlice } from "./slices/cracksSlice"
import { tonicSlice } from "./slices/tonicSlice"
import { FetchGuild, guildSlice } from "./slices/guildSlice"
// import { equipSlice } from "./slices/equipSlice"
import { switchSlice } from "./slices/switchSlice"
import { avatarSlice } from "./slices/avatarSlice"
import { calibrateSlice } from "./slices/calibrateSlice"
import { skillInputSlice } from "./slices/skillInputSlice"
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { cardSlice, emblemSlice, itemSlice, magicPropsSlice, materialSlice, upgradeSlice } from "./slices/itemSlice"


const reducer = 

combineReducers({
  Profile: profileSlice.reducer,
  Item: itemSlice.reducer,
  Card: cardSlice.reducer,
  Emblem: emblemSlice.reducer,
  MagicProps: magicPropsSlice.reducer,
  Upgrade: upgradeSlice.reducer,
  Material: materialSlice.reducer,
  Avatar: avatarSlice.reducer,
  Tonic: tonicSlice.reducer,
  Guild: guildSlice.reducer,
  CreatureProp: creatureSlice.reducer,
  Choice: switchSlice.reducer,
  Calibrate: calibrateSlice.reducer,
  SkillInput: skillInputSlice.reducer
})


/*
const persistedReducer = persistReducer({
  key: "root",
  version: 1, 
  storage
}, reducer)


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
  reducer
})


export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

