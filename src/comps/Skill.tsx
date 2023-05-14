import { useAppSelector } from "../feats/hooks"
import { selectClassASkills } from "../feats/selector/selfSelectors"

export function Skill() {
  const skills = useAppSelector(selectClassASkills)
  return (
    <div id="Skill">
      <header>
        <h3>스킬</h3>
      </header>
      <div className="SkillList">
        {skills.map(sk => (
          <div key={sk.name} className="AttackSkill">{sk.name}</div>
        ))}
      </div>
    </div>
  )
}