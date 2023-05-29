import { Fragment, useState } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import styled from 'styled-components'

import { whatElType } from '../attrs'
import { critFt, getSkillDamage } from '../damage'
import { useAppDispatch, useAppSelector } from '../feats/hooks'
import {
  selectClassASkills, selectClassAtype, selectAtkFixed, selectLevel
} from '../feats/selector/baseSelectors'
import {
  selectEnemyDefRate, selectEnemyElRes, selectAttr, selectCritChance
} from '../feats/selector/selectors'
import { bindSkill, getMaxSkillLevelAt, isChargable } from '../skills'
import { add } from '../utils'
import { Num } from './widgets/NumberView'
import { selectSkillLevel, selectSkillLevelBonus } from '../feats/selector/skillSelectors'
import { NumberInput } from './widgets/Forms'
import { SetSkillLevel } from '../feats/slices/slicev5'

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
  charged?: boolean
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
  const attrs = useAppSelector(selectAttr)
  const atkFix = useAppSelector(selectAtkFixed)
  const chance = useAppSelector(selectCritChance)

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
      <Num className={"AttrValue "+atype} value={mean} separated/>
      <Num className={"AttrValue "+atype} value={criticalDamage} separated/>
    </>
  )
}

const AttackSkillStyle = styled.div`
  padding: 0.5rem;
  box-sizing: border-box;

  @media screen and (max-width: 999px) {
    padding: 0.25rem;
  }
`

const SkillHeadingStyle = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin: 0;
`

const SkillName = styled.div`
  font-weight: 900;
  white-space: nowrap;
  color: white;
`

const SkillLevelBonus = styled.span`
  color: var(--color-green);
`

const SkillSuffix = styled.div`
  color: var(--color-uncommon);
`

interface SkillHeadingProps {
  skill: AttackSkill
  baseSkLv: number
  sklvBonus?: number
}

interface ExtraIndexProps {
  skillName: string
  suffix: string
}

/** 공격스킬 헤드 부분 */
function SkillHeading({ skill, baseSkLv, sklvBonus = 0 }: SkillHeadingProps) {
  return (
  <SkillHeadingStyle>
    <SkillName>{skill.name}</SkillName>
    <SkillLevelConfig skill={skill} skLv={baseSkLv} skLvBonus={sklvBonus} />
  </SkillHeadingStyle>
  )
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


const BaseRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  align-items: center;
  align-content: center;
  justify-items: end;
`

const SkillRow = styled(BaseRow)`
  > :first-child {
    justify-self: stretch;
  }
`

interface SkConfigProps {
  skill: AttackSkill
  skLv: number
  skLvBonus? : number
}

const SkillLevelLabel = styled.span`
  color: var(--color-epic);
`

const SkillLevelInput = styled(NumberInput)`
  input[type='number']& {
    width: 2rem;
    color: var(--color-epic);
    background-color: transparent!important;
    text-align: left;
    font-size: inherit;
  }
`

const SkillConfigStyle = styled.div`
`

function SkillLevelConfig({ skill, skLv, skLvBonus }: SkConfigProps) {
  const dispatch = useAppDispatch()

  return (
    <SkillConfigStyle>
      <SkillLevelLabel>Lv.</SkillLevelLabel>
      <SkillLevelInput value={skLv}
      onChange={value => dispatch(SetSkillLevel({ skID: skill.id, value }))}
      onClick={ev => ev.stopPropagation()}
      />
      {skLvBonus? <SkillLevelBonus>(+{skLvBonus})</SkillLevelBonus> : null}
    </SkillConfigStyle>
  )
}

/** 그냥 사용 or 풀충전 스킬 사용 */
function AttackSkillDefault({ skill, charged = false }: SkillOneProps) {
  const [showDetail, setShowDetail] = useState(false)
  const myLevel = useAppSelector(selectLevel)
  const myAttrs = useAppSelector(selectAttr)
  const skLvBonus = useAppSelector(state => selectSkillLevelBonus(state, undefined, skill))

  const skLvInput = useAppSelector(state => selectSkillLevel(state, undefined, skill.id ))

  const maxSkLv = getMaxSkillLevelAt(skill, myLevel, true)
  const baseSkLv = skLvInput != null? Math.max(Math.min(skLvInput, maxSkLv), 0) : maxSkLv
  const attacks = bindSkill(skill, baseSkLv, myAttrs, { charged })

  return (
    <AttackSkillStyle className="AttackSkill Bordered">
      <SkillRow onClick={() => setShowDetail(!showDetail)}>
        {charged?
          <AttackSkillExtraIndex skillName={skill.name} suffix={skill.chargeupType ?? "충전"} />
          :<SkillHeading skill={skill} baseSkLv={baseSkLv} sklvBonus={skLvBonus} />
        }
        <SkillDamage skill={skill} attacks={attacks}/>
      </SkillRow>
      {showDetail && <SkillDetailView attacks={attacks} />}
    </AttackSkillStyle>
  )
}

interface AttackSkillVariantProps {
  skill: AttackSkill
  variant: string
}

/** 바리에이션이 적용된 스킬 */
function AttackSkillVariant({ skill, variant }: AttackSkillVariantProps) {
  const [showDetail, setShowDetail] = useState(false)
  const myLevel = useAppSelector(selectLevel)
  const myAttrs = useAppSelector(selectAttr)

  /** @todo 스킬레벨을 사용자가 입력하도록 하시오. */
  const baseSkLv = getMaxSkillLevelAt(skill, myLevel, true)
  const attacks = bindSkill(skill, baseSkLv, myAttrs, { variant })

  return (
    <AttackSkillStyle className="AttackSkill Bordered">
      <SkillRow onClick={() => setShowDetail(!showDetail)}>
        <AttackSkillExtraIndex skillName={skill.name} suffix={variant} />
        <SkillDamage skill={skill} attacks={attacks}/>
      </SkillRow>
      {showDetail && <SkillDetailView attacks={attacks} />}
    </AttackSkillStyle>
  )
}

/** 공격스킬과 그에 딸린 바리에이션, 풀충전시 데미지 수치를 렌더한다. */
function SkillListContent() {
  const skills = useAppSelector(selectClassASkills)
  if (!(skills?.length > 0)) return <SkillNotImplemented />
  return <>
    {skills.map(skill => 
    <Fragment key={skill.name}>
      <AttackSkillDefault skill={skill} />
      {isChargable(skill) && <AttackSkillDefault skill={skill} charged />}
      {skill.variant?.map(va => 
      <AttackSkillVariant key={va.vaName} skill={skill} variant={va.vaName} />
      )}
    </Fragment>
    )}
  </>
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

const SkillHeadingRow = styled(BaseRow)`
  > * {
    text-align: center;
  }
`

export function Skill() {
  return (
    <ErrorBoundary FallbackComponent={SkillError}>
      <div id="Skill">
        <header>
          <h3>스킬</h3>
        </header>
        <AttackSkillListStyle className="SkillList">
          <SkillHeadingRow className="Bordered">
            <div>스킬</div>
            <div>평균데미지<br /><small>(크리확률+배율 적용)</small></div>
            <div>크리티컬 데미지<br /><small>(크리배율 적용)</small></div>
          </SkillHeadingRow>
          <SkillListContent />
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
