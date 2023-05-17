import { useState } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import styled from 'styled-components'

import { whatElType } from '../attrs'
import { critFt, getSkillDamage } from '../damage'
import { useAppSelector } from '../feats/hooks'
import {
  selectClassASkills, selectClassAtype, selectMyAtkFixed, selectMyLevel
} from '../feats/selector/baseSelectors'
import {
  selectEnemyDefRate, selectEnemyElRes, selectMyAttr, selectMyCritChance
} from '../feats/selector/selectors'
import { bindSkill, getMaxSkillLevelAt } from '../skills'
import { add } from '../utils'
import { Num } from './widgets/NumberView'

function union<T>(a: T[], b: T[]) {
  return [...a, ...b].reduce((v, i) => {
    if (!v.includes(i)) v.push(i)
    return v
  }, [] as T[])
}

interface OneAttackProps {
  attack: RealOneAttack

  /** 계수증가/감소 "aka 특정 스킬 공격력 증가" */
  sk_val?: number

  /** 타격 횟수 증가/감소 */
  sk_hit?: number

}

interface SkillOneProps {
  skill: AttackSkill
}


function OneAttackProfileView ({ attack, sk_hit = 0 }: OneAttackProps) {
  const { value: baseValue, fixed: baseFixed, hit: baseHit } = attack
  const value = baseValue
  const hit = baseHit + sk_hit
  return (
    <div className="OneAttack">
      <span className="OneAttackName">{attack.atName}: </span>
      <span className="OneAttackValue"><Num value={value} percented /></span>
      {hit > 1 ? <span>({hit}회)</span> : null}
    </div>
  )
}

function SkillDetailView({ attacks }: { attacks: RealOneAttack[] }) {
  if (!attacks || attacks.length < 1) return null
  return (
    <div>
      {attacks.map(at => <OneAttackProfileView key={at.atName} attack={at} />)}
    </div>
  )
}

function SkillDamage({ skill, attacks }: { skill: AttackSkill, attacks: RealOneAttack[] }) {

  const atype = useAppSelector(selectClassAtype)
  const attrs = useAppSelector(selectMyAttr)
  const atkFix = useAppSelector(selectMyAtkFixed)
  const chance = useAppSelector(selectMyCritChance)

  /** 일단 나한테 달려있는 모든 속성부여들 (가장 높은 속성강화 그런거 아직 적용안함) */
  const myEltype = attrs.eltype ?? []
  const targetElRes = useAppSelector(selectEnemyElRes)
  const defRate = useAppSelector(selectEnemyDefRate)

  const { el_fire, el_ice, el_lght, el_dark } = attrs
  if (!attacks) return null
  
  const unionEltype = skill.eltype? union(myEltype, skill.eltype) : myEltype
  const eltype = whatElType({ eltype: unionEltype, el_fire, el_ice, el_lght, el_dark })
  const damages = attacks.map(at => getSkillDamage(atype, eltype, attrs, atkFix, at, targetElRes, defRate))
  const damage = damages.reduce(add, 0)

  const criticalDamage = damage * critFt(attrs["cdmg_inc"], attrs["catk_inc"])

  const mean = chance * criticalDamage + (1 - chance) * damage

  return (
    <>
      <div>
        평균 {<Num className={"AttrValue "+atype} value={mean} separated/>}
      </div>
      <div>
        크리 {<Num className={"AttrValue "+atype} value={criticalDamage} separated/>}
      </div>
    </>
  )
}

const AttackSkillStyle = styled.div`
  padding: 0.5rem;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  @media screen and (max-width: 999px) {
    padding: 0.25rem;
  }
`

const SkillHeadingStyle = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 4px;
  margin: 0;
`

const SkillName = styled.div`
  font-weight: 900;
  color: white;
`

const SkillLevel = styled.div`
  color: var(--color-epic);
`

const SkillLevelBonus = styled.div`
  color: var(--color-green);
`

const SkillSuffix = styled.div`
  color: var(--color-uncommon);
`

interface SkillHeadingProps {
  skName: string
  baseSkLv: number
  sklvBonus?: number
}

/** 공격스킬 헤드 부분 */
function SkillHeading({ skName, baseSkLv, sklvBonus }: SkillHeadingProps) {
  return (
  <SkillHeadingStyle>
    <SkillName>{skName}</SkillName>
    <SkillLevel>Lv.{baseSkLv + sklvBonus}</SkillLevel>
    {sklvBonus? <SkillLevelBonus>(+{sklvBonus})</SkillLevelBonus> : null}
  </SkillHeadingStyle>
  )
}

interface ExtraIndexProps {
  skillName: string
  suffix: string
}

/** 바리에이션 또는 풀충전이 적용된 공격스킬 행 헤딩 */
function AttackSkillExtraIndex({ skillName, suffix }: ExtraIndexProps) {
  return (
    <SkillHeadingStyle>
      <SkillName>{skillName}</SkillName>
      <SkillSuffix>({suffix})</SkillSuffix>
    </SkillHeadingStyle>
  )
}


const SkillMainView = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  align-items: center;
  align-content: center;
  justify-items: center;

  > :first-child {
    justify-self: start;
  }
`

/** 바리에이션도, 풀충전도 아닌 스킬 사용 */
function AttackSkillPureCase({ skill }: SkillOneProps) {
  const [showDetail, setShowDetail] = useState(false)
  const myLevel = useAppSelector(selectMyLevel)
  const myAttrs = useAppSelector(selectMyAttr)

  /** @todo 스킬레벨을 사용자가 입력하도록 하시오. */
  const baseSkLv = getMaxSkillLevelAt(skill, myLevel, true)
  const attacks = bindSkill(skill, baseSkLv, myAttrs)
  const { sk_lv = {} } = myAttrs
  const sklvBonus = (sk_lv[skill.name] ?? 0)
  return (
    <AttackSkillStyle className="AttackSkill Bordered">
      <SkillMainView onClick={() => setShowDetail(!showDetail)}>
        <SkillHeading skName={skill.name} baseSkLv={baseSkLv} sklvBonus={sklvBonus} />
        <SkillDamage skill={skill} attacks={attacks}/>
      </SkillMainView>
      {showDetail && <SkillDetailView attacks={attacks} />}
    </AttackSkillStyle>
  )
}

interface AttackSkillVariantProps {
  skill: AttackSkill
  variant: string
}

/** 바리에이션만 적용된 스킬 */
function AttackSkillVariantCase({ skill, variant }: AttackSkillVariantProps) {
  const [showDetail, setShowDetail] = useState(false)
  const myLevel = useAppSelector(selectMyLevel)
  const myAttrs = useAppSelector(selectMyAttr)

  /** @todo 스킬레벨을 사용자가 입력하도록 하시오. */
  const baseSkLv = getMaxSkillLevelAt(skill, myLevel, true)
  const attacks = bindSkill(skill, baseSkLv, myAttrs, { variant })

  return (
    <AttackSkillStyle className="AttackSkill Bordered">
      <SkillMainView onClick={() => setShowDetail(!showDetail)}>
        <AttackSkillExtraIndex skillName={skill.name} suffix={variant} />
        <SkillDamage skill={skill} attacks={attacks}/>
      </SkillMainView>
      {showDetail && <SkillDetailView attacks={attacks} />}
    </AttackSkillStyle>
  )
}

/** 풀충전만 적용된 스킬 */
function AttackSkillChargeupCase({ skill }: SkillOneProps) {
  const [showDetail, setShowDetail] = useState(false)
  const myLevel = useAppSelector(selectMyLevel)
  const myAttrs = useAppSelector(selectMyAttr)

  /** @todo 스킬레벨을 사용자가 입력하도록 하시오. */
  const baseSkLv = getMaxSkillLevelAt(skill, myLevel, true)
  const attacks = bindSkill(skill, baseSkLv, myAttrs, { chargeup: skill.chargeup })
  return (
    <AttackSkillStyle className="AttackSkill Bordered">
      <SkillMainView onClick={() => setShowDetail(!showDetail)}>
        <AttackSkillExtraIndex skillName={skill.name} suffix={skill.chargeupType ?? "충전"} />
        <SkillDamage skill={skill} attacks={attacks}/>
      </SkillMainView>
      {showDetail && <SkillDetailView attacks={attacks} />}
    </AttackSkillStyle>
  )
}

/** 공격스킬과 그에 딸린 바리에이션, 풀충전시 데미지 수치를 렌더한다. */
function AttackSkill({ skill }: SkillOneProps) {
  return (<>
    <AttackSkillPureCase skill={skill} />
    {skill.variant?.length > 0?
    skill.variant.map(va => 
      <AttackSkillVariantCase key={va.vaName} skill={skill} variant={va.vaName} />
    ): null}
    {skill.chargeup > 1?
    <AttackSkillChargeupCase skill={skill} />
    : null}
  </>
  )
}


function SkillNotImplemented() {
  return <div style={{ textAlign: "center" }}>
    앗!! 개발자가 이 직업의 스킬을 구현하지 않은 모양이네요!<br />
    (스킬 계수는 인게임을 직접 참고해 입력합니다. 실례가 안된다면 개발자를 도와주세요!)
  </div>
}

const AttackSkillListStyle = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`

export function Skill() {
  const skills = useAppSelector(selectClassASkills)
  return (
    <ErrorBoundary FallbackComponent={SkillError}>
      <div id="Skill">
        <header>
          <h3>스킬</h3>
        </header>
        <AttackSkillListStyle className="SkillList">
          {skills?.length > 0? skills.map(sk => (
            <AttackSkill key={sk.name} skill={sk} />
          )): <SkillNotImplemented />}
        </AttackSkillListStyle>
      </div>
    </ErrorBoundary>
  )
}

function SkillError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div id="Skill">
      <header>
        <h3>스킬</h3>
      </header>
      <div>
        앗! 스킬을 보려다가 문제가 발생했어요! 어서 개발자에게 알려주세요!
      </div>
      <div>
        <h4>{error.name}</h4>
        <div>
          <pre>{error.message}</pre>
          <pre>{error.stack}</pre>
        </div>
      </div>
      <div>
        <button onClick={resetErrorBoundary}>다시 시도</button>
      </div>
    </div>
  )
}
