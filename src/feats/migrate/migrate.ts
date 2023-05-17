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
  return produce<V4._RootState, V5State>(state, draft => {
    // My를 없애기
    delete draft.My

    // 모든 사용자스킬의 maxHit를 hit로 바꾸기
    draft.CustomSkill.forEach((sk, i) => {
      sk.hit = state.CustomSkill[i].maxHit
      delete sk.maxHit
    })

    // 직업별 스킬에 추가 상태들 넣기
    Object.values(draft.SavedChars.byID)
    .forEach(dfc => {
      dfc.DFChar.SkillLevelMap ??= {}
      dfc.DFChar.SkillTPMap    ??= {}
      dfc.DFChar.SkillUsageCountMap ??= {}
    })

  }) as any
}