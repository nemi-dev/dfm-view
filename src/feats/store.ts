import { combineReducers, configureStore, createReducer, Reducer } from "@reduxjs/toolkit"
import { creatureSlice, currentIDSlice, enemyTargetSlice, savedCharSlice, selfSlice } from "./slices/slice"
import { tonicSlice } from "./slices/tonicSlice"
import { guildSlice } from "./slices/guildSlice"
import { choiceSlice } from "./slices/choiceSlice"
import { avatarSlice } from "./slices/avatarSlice"
import { calibrateSlice } from "./slices/calibrateSlice"
import { skillInputSlice } from "./slices/skillInputSlice"
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { cardSlice, emblemSlice, itemSlice, magicPropsSlice, materialSlice, upgradeSlice } from "./slices/itemSlice"
import reduceReducers from "reduce-reducers"



const My = 

combineReducers({
  Self: selfSlice.reducer,
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
  Choice: choiceSlice.reducer,
  Calibrate: calibrateSlice.reducer,
  CustomSklill: skillInputSlice.reducer,
})


const reducer = combineReducers({
  currentID: currentIDSlice.reducer,
  My,
  EnemyTarget: enemyTargetSlice.reducer,
  SavedChars: savedCharSlice.reducer
})

const reducerForReal = reduceReducers(reducer)
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
  reducer: reducerForReal
})


export default store
// export type RootState = ReturnType<typeof store.getState>
export type RootState = {
  currentID: { value: string }
  My: DFCharState
  EnemyTarget: EnemyTargetState
  SavedChars: SavedCharCollection
}
export type AppDispatch = typeof store.dispatch

