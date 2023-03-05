import '../style/Attrs.scss'
import React from "react"
import { Percent } from "./CommonUI"
import { attrDefs, AttrExpressionType } from '../attrs'
import { signed } from '../utils'


interface FlatValueIncrementProps {
  name: string
  value: number
}

function FlatValue({ name, value }: FlatValueIncrementProps) {
  return(
    <div className="AttrOne">
      <span className="AttrName">{name}</span>
      <span className="AttrValue FlatValue">{signed(value)}</span>
    </div>
  )
}

function PercentValue({ name, value }: FlatValueIncrementProps) {
  return(
    <div className="AttrOne">
      <span className="AttrName">{name}</span>
      <Percent className="AttrValue PercentValue" value={value} signed />
    </div>
  )
}

function DearEltype({ name, value }: { name: string, value: string | string[] }) {
  const eltype = typeof value === "string" ? value : value.join('+')
  return( <div className="AttrOne Eltype">{eltype}공격속성</div> )
}



function SkillValue({ midfix, skills, percent, negate }: { midfix: string, skills: Record<string, number>, percent: boolean, negate: boolean }) {
  
  const skillNames = Object.keys(skills).sort()
  const els: JSX.Element[] = []
  for (const skillName of skillNames) {
    let v = negate? -skills[skillName] : skills[skillName]
    els.push(
      <div key={skillName} className="AttrOne">
        <span className="AttrName">{skillName} {midfix}</span>
        <span className="AttrValue">{signed(v)}{percent? '%':''}</span>
      </div>
    )
  }
  return (
    <span className="AttrVex">{els}</span>
  )
}

function Misc({ value }: { value: string[] } ) {
  return (
    <div className="AttrVex">
      {value.map((v, i) => 
      <div key={`${i}=${v}`} className="AttrOne">{v}</div>
      )}
    </div>
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
  const views: JSX.Element[] = []
  for (const { key, expression, name } of attrDefs.array) {
    if (key in attrs) {
      const compo = expressionToComponent[expression]
      if (key === "sk_lv") {
        views.push(<SkillValue key={key} midfix={name} skills={attrs[key]} percent={false} negate={false} />)
        continue
      }
      if (key === "sk_val") {
        views.push(<SkillValue key={key} midfix={name} skills={attrs[key]} percent={true} negate={false} />)
        continue
      }
      if (key === "sk_cool") {
        views.push(<SkillValue key={key} midfix={name} skills={attrs[key]} percent={true} negate={true} />)
        continue
      }
      views.push(React.createElement(compo, { key, name: name, value: attrs[key] }))
    }

  }
  return (
    <>{views}</>
  )
}



interface VerboseResultProps {
  name: string
  value: number | string | JSX.Element
  className?: string
}

export function VerboseResult({ name, value = 0, className = ""}: VerboseResultProps) {
  return (
  <span className={"Result " + className}>
    {name? <div className="AttrName">{name}</div> : null}
    <div className={"AttrValue " + className}>
      {value}
    </div>
  </span>
  )
}
