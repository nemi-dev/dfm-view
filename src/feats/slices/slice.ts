import { createSlice, PayloadAction } from "@reduxjs/toolkit"


const creatureInit: CreatureState = 
{
  stat: 156,
  skill: { dmg_add: 18, el_all: 5, stat: 0 },
  Artifacts: {
    stat: 63, atk: 50, el_all: 10, speed_atk: 4, speed_cast: 6
  }
}

export const creatureSlice = createSlice({
  name: 'Creature',
  initialState: creatureInit,
  reducers: {
    SetCreatureStat: (s, { payload }: PayloadAction<number>) => {
      s.stat = payload
    },
    SetCreatureSkill: (s, { payload: [attr_name, value] }: PayloadAction<["stat" | "dmg_add" | "el_all", number]>) => {
      s.skill[attr_name] = value
    },
    SetArtifactValue: (s, { payload: [attr_name, value] }: PayloadAction<["stat" | "atk" | "el_all" | "speed_atk" | "speed_cast", number]>) => {
      s.Artifacts[attr_name] = value
    }
  }
})


export const {
  SetCreatureStat,
  SetCreatureSkill,
  SetArtifactValue
} = creatureSlice.actions



interface ProfileState {

  /** 얘 이름 */
  myName: string
  /** 얘 직업 */
  dfclass: string
  /** 캐릭터 레벨 (최대 65) */
  level: number

  /** 업적 레벨 (최대 9) */
  achieveLevel: number
  atk_fixed: number
  atype: Atype
  targetDefense: number
  targetElementResist: number
}

const profileInit : ProfileState = {
  myName: "내캐릭터",
  dfclass: "미스트리스",
  level: 65,
  achieveLevel: 9,
  atype: "Magic",
  atk_fixed: 317,
  targetDefense: 19500,
  targetElementResist: 0,
}

export const profileSlice = createSlice({
  name: 'Profile',
  initialState: profileInit,
  reducers: {
    SetMyName: (s, { payload }: PayloadAction<string>) => {
      s.myName = payload
    },
    SetDFClass: (s, { payload }: PayloadAction<string>) => { s.dfclass = payload },
    SetLevel: (s, { payload }: PayloadAction<number>) => { s.level = payload },
    SetAchieveLevel: (s, { payload }: PayloadAction<number>) => { s.achieveLevel = payload },
    SetAtype: (s, { payload }: PayloadAction<Atype>) => {
      s.atype = payload
    },
    set_atk_fixed: (s, pay : PayloadAction<number>) => {
      s.atk_fixed = pay.payload
    },
    SetTargetDefense: (s, pay : PayloadAction<number>) => {
      s.targetDefense = pay.payload
    },
    SetTragetResist: (s, pay : PayloadAction<number>) => {
      s.targetElementResist = pay.payload
    },
  }
})

export const {
  SetMyName,
  SetDFClass,
  SetLevel,
  SetAchieveLevel,
  SetAtype,
  set_atk_fixed,
  SetTargetDefense,
  SetTragetResist,
} = profileSlice.actions

