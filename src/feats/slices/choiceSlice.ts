import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const switchInit: Choices = {
  branches: {},
  gives: {},
  exclusives: {}
};

export const choiceSlice = createSlice({
  name: 'Choice',
  initialState: switchInit,
  reducers: {
    SetBranch: (s, { payload: [key, value] }: PayloadAction<[string, OptionalChoiceType]>) => {
      s.branches[key] = value;
    },
    SetGives: (s, { payload: [key, value] }: PayloadAction<[string, OptionalChoiceType]>) => {
      s.gives[key] = value;
    },
    SetExclusive: (s, { payload: [key, value] }: PayloadAction<[string, string]>) => {
      s.exclusives[key] = value;
    },
    DeleteChoice: (s, { payload: [type, key] }: PayloadAction<["branches" | "gives" | "exclusives", string]>) => {
      delete s[type][key]
    }
  }
});

export const {
  SetBranch, SetGives, SetExclusive, DeleteChoice: DeleteSwitch
} = choiceSlice.actions;
