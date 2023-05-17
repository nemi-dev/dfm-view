// import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
// import createMigrate from 'redux-persist/es/createMigrate'
// import storage from 'redux-persist/lib/storage'

import { configureStore } from '@reduxjs/toolkit'

// import { migrate2to3, migrate3to4 } from './migrate/migrate'

import { dfSlice } from './slices/slicev5'

// const myStateReducer = 

// combineReducers({
//   Self: selfSlice.reducer,
//   Item: itemSlice.reducer,
//   Card: cardSlice.reducer,
//   Emblem: emblemSlice.reducer,
//   MagicProps: magicPropsSlice.reducer,
//   Upgrade: upgradeSlice.reducer,
//   Material: materialSlice.reducer,
//   Avatar: avatarSlice.reducer,
//   Guild: guildSlice.reducer,
//   CreatureValue: creatureSlice.reducer,
//   Choice: choiceSlice.reducer,
//   Calibrate: calibrateSlice.reducer,
// })


/* // v4
import { dfcharSlice } from './slices/mycharSlice'

const combinedReducer = combineReducers({
  currentID: currentIDSlice.reducer,
  SavedChars: savedCharSlice.reducer,
  My: dfcharSlice.reducer,
  Tonic: tonicSlice.reducer,
  EnemyTarget: enemyTargetSlice.reducer,
  EquipPresets: equipPresetSlice.reducer,
  CustomSkill: skillInputSlice.reducer,
  CustomSkillPresets: skillPresetSlice.reducer
})
export type RootState = ReturnType<typeof combinedReducer>

const modelReducer = reduceReducers(saveReducerV4, combinedReducer)
*/

const v5reducer = dfSlice.reducer
export type RootState = ReturnType<typeof v5reducer>


// const migration = {
//   3: migrate2to3,
//   4: migrate3to4
// }

// const persistedReducer = persistReducer({
//   key: "root",
//   version: 4, 
//   storage,
//   migrate: createMigrate(migration, { debug: false })
// }, modelReducer)


export const store = configureStore({
  // reducer: persistedReducer,
  // middleware: (getDefaultMiddleware) => {
  //   return getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
  //     }
  //   })
  // },
  /* // v4
  reducer: modelReducer
  */

  reducer: v5reducer
})

export default store

export type AppDispatch = typeof store.dispatch



