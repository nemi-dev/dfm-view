import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const switchInit: ConditionalSelectors = {
  branches: {},
  gives: {},
  exclusives: {}
};

export const switchSlice = createSlice({
  name: 'Switch',
  initialState: switchInit,
  reducers: {
    SetBranch: (s, { payload: [key, value] }: PayloadAction<[string, boolean]>) => {
      s.branches[key] = value;
    },
    SetGives: (s, { payload: [key, value] }: PayloadAction<[string, boolean]>) => {
      s.gives[key] = value;
    },
    SetExclusive: (s, { payload: [key, value] }: PayloadAction<[string, string]>) => {
      s.exclusives[key] = value;
    },
    DeleteSwitch: (s, { payload: [type, key] }: PayloadAction<["branches" | "gives" | "exclusives", string]>) => {
      if (type === "exclusives")
        delete s[type][key];
      else
        s[type][key] = false;
    }
  }
});

export const {
  SetBranch, SetGives, SetExclusive, DeleteSwitch
} = switchSlice.actions;
