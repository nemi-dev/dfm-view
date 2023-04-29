import '../../style/Attrs.scss'
import { Num } from "./NumberView"
import { attrDefs, AttrDef, Elemental } from '../../attrs'
import { ErrorBoundary } from 'react-error-boundary'


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

function Misc({ value = [] }: { value: string[] } ) {
  return (
    <>
      {value.map((v, i) => 
      <div key={`${i}=${v}`} className="AttrItem">
        <span className="KeyName">{v}</span>
      </div>
      )}
    </>
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
    case "Misc": return <Misc value={value as string[]} />
  }
}



export function SimpleBaseAttrView({ attrs }: { attrs: BaseAttrs | undefined | null }) {
  if (!attrs) return null
  return <ErrorBoundary fallback={<>앗! 효과를 보다가 문제가 생겼어요!</>} >
  {attrDefs.array.filter(attrDef => attrDef.key in attrs)
    .map(attrDef =>
    <AttrItem key={attrDef.key} attrDef={attrDef} value={attrs[attrDef.key]} />
    )}
  </ErrorBoundary>
}

