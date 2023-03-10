import '../../style/Attrs.scss'
import React from "react"
import { Num } from "./NumberView"
import { attrDefs, AttrExpressionType } from '../../attrs'


interface FlatValueIncrementProps {
  name: string
  value: number
}

function FlatValue({ name, value }: FlatValueIncrementProps) {
  return(
    <div className="AttrOne">
      <span className="AttrName">{name}</span>
      <Num className="AttrValue" value={value} signed />
    </div>
  )
}

function PercentValue({ name, value }: FlatValueIncrementProps) {
  return(
    <div className="AttrOne">
      <span className="AttrName">{name}</span>
      <Num className="AttrValue" value={value} signed percented />
    </div>
  )
}

function DearEltype({ name, value }: { name: string, value: string | string[] }) {
  const eltype = typeof value === "string" ? value : value.join('+')
  return( <div className="AttrOne Eltype">{eltype}공격속성</div> )
}



function SkillValue({ midfix, skills, percent }: { midfix: string, skills: Record<string, number>, percent: boolean }) {
  
  const skillNames = Object.keys(skills).sort()
  return(
    <>
    {skillNames.map(skillName => {
      let value = skills[skillName]
      return (
        <div key={skillName} className="AttrOne">
          <span className="AttrName">{skillName} {midfix}</span>
          <Num className="AttrValue" value={value} signed percented={percent} />
        </div>
      )
    })}
    </>
  )
}

function Misc({ value }: { value: string[] } ) {
  return (
    <>
      {value.map((v, i) => 
      <div key={`${i}=${v}`} className="AttrOne">
        <span className="AttrName">{v}</span>
      </div>
      )}
    </>
  )
}

const expressionToComponent: Record<AttrExpressionType, React.FC<any>> = {
  Scalar: FlatValue,
  Percent: PercentValue,
  ComplexScalar: SkillValue,
  ComplexPercent: SkillValue,
  DearEltype: DearEltype,
  Misc: Misc
}





export function SimpleBaseAttrView({ attrs }: { attrs: BaseAttrs }) {
  if (!attrs) return null
  const views: JSX.Element[] = []
  for (const { key, expression, name } of attrDefs.array) {
    if (key in attrs) {
      const compo = expressionToComponent[expression]
      if (key === "sk_lv") {
        views.push(<SkillValue key={key} midfix={name} skills={attrs[key]} percent={false} />)
        continue
      }
      if (key === "sk_val") {
        views.push(<SkillValue key={key} midfix={name} skills={attrs[key]} percent={true} />)
        continue
      }
      if (key === "sk_cool") {
        views.push(<SkillValue key={key} midfix={name} skills={attrs[key]} percent={true} />)
        continue
      }
      views.push(React.createElement(compo, { key, name: name, value: attrs[key] }))
    }

  }
  return (
    <>{views}</>
  )
}



interface ResultProps {
  name: string
  value: number | string | JSX.Element
  className?: string
}

export function Result({ name, value = 0, className = ""}: ResultProps) {
  return (
  <span className={"Result " + className}>
    {name? <div className="AttrName">{name}</div> : null}
    <div className={"AttrValue " + className}>
      {value}
    </div>
  </span>
  )
}
