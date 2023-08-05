import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import createMigrate from 'redux-persist/es/createMigrate'
import storage from 'redux-persist/lib/storage'

import { configureStore } from '@reduxjs/toolkit'

import { m3to4, m4to5 } from './migrate/migrate'
import { dfSlice } from './slices/slicev5'

const v5reducer = dfSlice.reducer
export type RootState = ReturnType<typeof v5reducer>


const migration = {
  4: m3to4,
  5: m4to5,
}

const persistedReducer = persistReducer({
  key: "dfmview",
  version: 5, 
  storage,
  migrate: createMigrate(migration, { debug: false })
}, v5reducer)


export const store = configureStore({
  // reducer: persistedReducer,
  reducer: v5reducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
  },

  // reducer: v5reducer
})

export default store

export type AppDispatch = typeof store.dispatch



