import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface CreatureType {

  /** 크리쳐가 주는 모든스탯 보너스 */
  stat: number
  
  /** 크리쳐 스킬 보너스 */
  skill: {
    stat: number
    el_all: number
    dmg_add: number
  }

  /** 아티팩트 */
  Artifacts: {

    /** 빨간색 아티팩트에서 얻는 스탯증가 수치 */
    stat: number

    /** 파란색 아티팩트에서 얻는 물리/마법공격력 증가 수치 */
    atk: number

    /** 초록색 아티팩트에서 얻는 모든속성 강화 수치 */
    el_all: number

    speed_atk: number
    speed_cast: number

  }

}

const creatureInit: CreatureType = 
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



interface Profile {

  /** 캐릭터 레벨 (최대 65) */
  level: number

  /** 업적 레벨 (최대 9) */
  achieveLevel: number
  atk_fixed: number
  atype: "Physc" | "Magic"
  targetDefense: number
  targetElementResist: number
}

const profileInit : Profile = {
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

    SetLevel: (s, { payload }: PayloadAction<number>) => { s.level = payload },
    SetAchieveLevel: (s, { payload }: PayloadAction<number>) => { s.achieveLevel = payload },
    SetAtype: (s, { payload }: PayloadAction<"Physc" | "Magic">) => {
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
  SetLevel,
  SetAchieveLevel,
  SetAtype,
  set_atk_fixed,
  SetTargetDefense,
  SetTragetResist,
} = profileSlice.actions

