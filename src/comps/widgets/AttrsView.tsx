import '../../style/Attrs.scss'
import { Num } from "./NumberView"
import { attrDefs, AttrDef } from '../../attrs'
import { ErrorBoundary } from 'react-error-boundary'
import { Elemental } from '../../constants'


interface OneValueProps {
  name: string
  value: number
  percented?: boolean
  useName?: boolean
}

function OneValue({ name, value, percented = false, useName = true }: OneValueProps) {
  return(
    <div className="AttrItem">
      {useName && name ? <span className="KeyName">{name}</span> : null}
      <Num className="AttrValue" value={value} signed percented={percented} />
    </div>
  )
}

function DearEltype({ value }: { value: Eltype[] }) {
  const eltype = value.map(et => Elemental[et]["속성"]).join('+')
  return( <div className="AttrItem Eltype">{eltype}공격속성</div> )
}

function DualTrigger() {
  return <div className="AttrItem"><div className="AttrValue">듀얼 트리거</div></div>
}


interface SkillValueProps {
  name: string
  values?: Record<string, number>
  percented?: boolean
}
function SkillValue({ name, values = {}, percented = false }: SkillValueProps) {
  
  const skillNames = Object.keys(values).sort()
  return(
    <>
    {skillNames.map(skillName => {
      let value = values[skillName]
      return (
        <div key={skillName} className="AttrItem">
          <span className="KeyName">{skillName} {name}</span>
          <Num className="AttrValue" value={value} signed percented={percented} />
        </div>
      )
    })}
    </>
  )
}



function DOTAttr({ name, factors }: { name: string, factors: DOTFactor[] }) {
  return (
    <>{factors.map(
      ({ dotType, on = "공격 시", chance = 100, dur, cool = 0}) => 
      <div key={name+"::"+(on)} className="AttrItem">
        {on} {chance}% 확률로 {dur}초 동안 {dotType} 걺 {cool && `(쿨타임 ${cool}초)`}
      </div>
    )}</>
  )
}

function RecoolAttr({ name, factors }: { name: string, factors: RecoolFactor[] }) {
  return (
    <>{factors.map(
      ({ on = "던전에서", chance, selectSk, cooltime }) => 
      <div key={name+"::"+(on)} className="AttrItem">
        {on} {(chance <= 100) && <>{chance}% 확률로</>} {selectSk} 스킬의 쿨타임을 초기화 (쿨타임 {cooltime}초)
      </div>
    )}</>
  )
}

function SuperarmorView({ name, factors }: { name: string, factors: string[] }) {
  return (
    <div className="AttrItem">{factors.join("/")} 슈퍼아머 적용</div>
  )
}


export function AttrItem({ attrDef, value, useName = true }: { attrDef: AttrDef, value: any, useName?: boolean }) {
  if (!attrDef || !value || (value instanceof Array && value.length == 0) ) return null
  const { name, expression } = attrDef
  switch (expression) {
    case "DearEltype":  return <DearEltype value={value} />
    case "DualTrigger": return <DualTrigger />
    case "Flat":    return <OneValue name={name} value={value as number} useName={useName} />
    case "Percent": return <OneValue name={name} percented value={value as number} useName={useName} />
    case "MapFlat": return <SkillValue name={name} values={value as Record<string, number>} />
    case "MapPercent": return <SkillValue name={name} percented values={value as Record<string, number>} />
    case "DoT": return <DOTAttr name={name} factors={value} />
    case "Recool": return <RecoolAttr name={name} factors={value} />
    case "Superarmor": return <SuperarmorView name={name} factors={value}/>
  }
}



export function SimpleBaseAttrView({ attrs }: { attrs: BaseAttrs | undefined | null }) {
  if (!attrs) return null
  return <ErrorBoundary fallback={<>앗! 효과를 보다가 문제가 생겼어요!</>} >
    {(Object.keys(attrs) as (keyof BaseAttrs)[]).map(attrKey => 
      <AttrItem key={attrKey} attrDef={attrDefs[attrKey]} value={attrs[attrKey]} />
    )}
    
  </ErrorBoundary>
}

