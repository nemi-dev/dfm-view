import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { SetArtifactValue, SetCreatureSkill, SetCreatureStat } from '../feats/slice'
import { LabeledInput } from "./widgets/Forms"

export function Creatures() {
  const
    stat = useAppSelector(state => state.Creature.stat),
    skill_stat = useAppSelector(state => state.Creature.skill.stat),
    skill_el_all = useAppSelector(state => state.Creature.skill.el_all),
    skill_dmg_add = useAppSelector(state => state.Creature.skill.dmg_add),
    stat_arti = useAppSelector(state => state.Creature.Artifacts.stat),
    atk = useAppSelector(state => state.Creature.Artifacts.atk),
    el_all = useAppSelector(state => state.Creature.Artifacts.el_all),
    speed_atk = useAppSelector(state => state.Creature.Artifacts.speed_atk),
    speed_cast = useAppSelector(state => state.Creature.Artifacts.speed_cast)
  const dispatch = useAppDispatch()
  return (
    <div>
      <h3>크리쳐</h3>
      <div className="InputArea">
        <LabeledInput label="크리쳐 스탯" value={stat} onChange={value => dispatch(SetCreatureStat(value))} />
        <LabeledInput label="크리쳐 스킬: 힘/지능" value={skill_stat} onChange={value => dispatch(SetCreatureSkill(["stat", value]))} />
        <LabeledInput label="크리쳐 스킬: 내 속성 강화" value={skill_el_all} onChange={value => dispatch(SetCreatureSkill(["el_all", value]))} />
        <LabeledInput label="크리쳐 스킬: 추가 데미지 (%)" value={skill_dmg_add} onChange={value => dispatch(SetCreatureSkill(["dmg_add", value]))} />
      </div>
      <h3>아티팩트</h3>
      <div className="InputArea">
        <LabeledInput label="레드 아티팩트 효과 + 옵션 (힘/지능)" value={stat_arti} onChange={value => dispatch(SetArtifactValue(["stat", value]))} />
        <LabeledInput label="블루 아티팩트: 공격속도 (%)" value={speed_atk} onChange={value => dispatch(SetArtifactValue(["speed_atk", value]))} />
        <LabeledInput label="블루 아티팩트: 캐스팅속도 (%)" value={speed_cast} onChange={value => dispatch(SetArtifactValue(["speed_cast", value]))} />
        <LabeledInput label="블루 아티팩트 옵션 (물리/마법공격력)" value={atk} onChange={value => dispatch(SetArtifactValue(["atk", value]))} />
        <LabeledInput label="그린 아티팩트 옵션 (속성 강화)" value={el_all} onChange={value => dispatch(SetArtifactValue(["el_all", value]))} />
      </div>
    </div>
  )
}




