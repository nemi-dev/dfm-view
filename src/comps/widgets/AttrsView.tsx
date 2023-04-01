import '../../style/Attrs.scss'
import React from "react"
import { Num } from "./NumberView"
import { attrDefs, AttrDef, Elemental } from '../../attrs'
import { ErrorBoundary } from 'react-error-boundary'


interface FlatValueIncrementProps {
  name: string
  value: number
  percented?: boolean
}

function OneValue({ name, value, percented = false }: FlatValueIncrementProps) {
  return(
    <div className="AttrOne">
      <span className="KeyName">{name}</span>
      <Num className="AttrValue" value={value} signed percented={percented} />
    </div>
  )
}

function DearEltype({ value }: { value: Eltype | Eltype[] }) {
  const eltype = typeof value === "string" ? 
  Elemental[value]["속성"]
  :value.map(et => Elemental[et]["속성"]).join('+')
  return( <div className="AttrOne Eltype">{eltype}공격속성</div> )
}

function DualTrigger() {
  return <div className="AttrOne"><div className="AttrValue">듀얼 트리거</div></div>
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
        <div key={skillName} className="AttrOne">
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
      <div key={`${i}=${v}`} className="AttrOne">
        <span className="KeyName">{v}</span>
      </div>
      )}
    </>
  )
}


export function AttrOneItem({ attrDef, value }: { attrDef: AttrDef, value: any }) {
  if (!attrDef) return null
  const { name, expression } = attrDef
  switch (expression) {
    case "DearEltype":  return <DearEltype value={value} />
    case "DualTrigger": return <DualTrigger />
    case "Flat":    return <OneValue name={name} value={value as number} />
    case "Percent": return <OneValue name={name} percented value={value as number} />
    case "MapFlat": return <SkillValue name={name} values={value as Record<string, number>} />
    case "MapPercent": return <SkillValue name={name} percented values={value as Record<string, number>} />
    case "Misc": return <Misc value={value as string[]} />
  }
}



export function SimpleBaseAttrView({ attrs }: { attrs: BaseAttrs | undefined | null }) {
  if (!attrs) return null
  return <ErrorBoundary fallback={<>앗! 효과를 보다가 문제가 생겼어요!</>} >
  {attrDefs.array.filter(attrDef => attrDef.key in attrs)
    .map(attrDef => <AttrOneItem key={attrDef.key} attrDef={attrDef} value={attrs[attrDef.key]} />)}
  </ErrorBoundary>
}

