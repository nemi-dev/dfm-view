import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { creatureSlice, currentIDSlice, enemyTargetSlice, equipPresetSlice, savedCharSlice, selfSlice, skillPresetSlice } from "./slices/slice"
import { tonicSlice } from "./slices/tonicSlice"
import { guildSlice } from "./slices/guildSlice"
import { choiceSlice } from "./slices/choiceSlice"
import { avatarSlice } from "./slices/avatarSlice"
import { calibrateSlice } from "./slices/calibrateSlice"
import { skillInputSlice } from "./slices/customSkillSlice"
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, PersistedState } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { cardSlice, emblemSlice, itemSlice, magicPropsSlice, materialSlice, upgradeSlice } from "./slices/itemSlice"
import reduceReducers from "reduce-reducers"
import { CreatorReducer, DeleteReducer, LoadReducer, NewReducer, SaveDF, SaveReducer } from "./saveReducers"
import createMigrate from "redux-persist/es/createMigrate"
import produce from "immer"
import { itemNameToId } from "../items"
import { migrate2to3, migrate3to4 } from "./migrate/migrate"


const myStateReducer = 

combineReducers({
  Self: selfSlice.reducer,
  Item: itemSlice.reducer,
  Card: cardSlice.reducer,
  Emblem: emblemSlice.reducer,
  MagicProps: magicPropsSlice.reducer,
  Upgrade: upgradeSlice.reducer,
  Material: materialSlice.reducer,
  Avatar: avatarSlice.reducer,
  Guild: guildSlice.reducer,
  CreatureValue: creatureSlice.reducer,
  Choice: choiceSlice.reducer,
  Calibrate: calibrateSlice.reducer,
})


const combinedReducer = combineReducers({
  currentID: currentIDSlice.reducer,
  My: myStateReducer,
  Tonic: tonicSlice.reducer,
  EnemyTarget: enemyTargetSlice.reducer,
  SavedChars: savedCharSlice.reducer,
  EquipPresets: equipPresetSlice.reducer,
  CustomSkill: skillInputSlice.reducer,
  CustomSkillPresets: skillPresetSlice.reducer
})

const modelReducer = reduceReducers(NewReducer, SaveReducer, LoadReducer, DeleteReducer, CreatorReducer, combinedReducer)

export type RootState = ReturnType<typeof combinedReducer>

const migration = {
  3: migrate2to3,
  4: migrate3to4
}

const persistedReducer = persistReducer({
  key: "root",
  version: 4, 
  storage,
  migrate: createMigrate(migration, { debug: false })
}, modelReducer)


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

export default store

export type AppDispatch = typeof store.dispatch




window.addEventListener("beforeunload", () => {
  store.dispatch(SaveDF())
})
