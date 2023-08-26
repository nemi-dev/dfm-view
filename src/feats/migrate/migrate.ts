import type { PersistedState } from "redux-persist"
import produce from "immer"


export function m3to4(state: V3._RootState & PersistedState) {
  return produce(state, draft => {
    const CreatureProp = state.My.CreatureProp
    const CreatureValue: CreaturePropState = {
      Creature: CreatureProp.CreatureStat,
      Red: CreatureProp.RedPropsValue,
      Green: CreatureProp.GreenPropsEl,
      Blue: CreatureProp.BluePropsValue
    }
    draft.My["CreatureValue"] = CreatureValue
    delete draft.My.CreatureProp
  })
}


export function m4to5(state: V4._RootState & PersistedState) {

  return produce<V4._RootState, DFMRootState>(state, draft => {
    // My를 없애기
    delete draft.My

    // 모든 사용자스킬의 maxHit를 hit로 바꾸기
    draft.CustomSkill.forEach((sk, i) => {
      sk.hit = state.CustomSkill[i].maxHit
      delete sk.maxHit
    })

    // 저장된 모든 캐릭터 업데이트
    Object.entries(state.SavedChars.byID)
    .forEach(([id, saved]) => {

      const { Self: { myName: name, level, dfclass, achieveLevel, atkFixed }, 
        Item,
        Card,
        Emblem,
        MagicProps,
        Upgrade,
        Material,
        Avatar,
        Guild,
        CreatureValue,
        Choice,
        Calibrate,
        } = saved.DFChar
      
      const dfc: DFChar = {
        id,
        TimeStamp: saved.TimeStamp,
        name, level, dfclass, achieveLevel, atkFixed,
        items: Item,
        cards: Card,
        emblems: Emblem,
        magicProps: MagicProps,
        upgradeValues: Upgrade,
        materials: Material,
        avatars: Avatar,
        guild: Guild,
        creatureValues: CreatureValue,
        choices: Choice,
        calibrate: Calibrate,
        skillLevelMap: {},
        skillTPMap: {},
        skillChargeupMap: {},
        skillUseCountMap: {}
      }

      for (const key in dfc.calibrate) {
        if (dfc.calibrate[key] === 0) delete dfc.calibrate[key]
      }

      draft.SavedChars.byID[id] = dfc
      
    })

    

  }) as any
}