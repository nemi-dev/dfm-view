import { useMemo } from "react"
import "../style/DFCharView.scss"
import { DamageOutput } from "./DamageOutput"


interface DamageOneProps {
  name: string
}

function DamageOne({ name, children }: React.PropsWithChildren<DamageOneProps>) {
  return <div className="DamageOne">
    <span className="KeyName">{name}</span>
    {children}
  </div>
}

function OutputZone() {
  return <div className="OutputZone">
    <DamageOne name="평타"><DamageOutput crit="mean" /></DamageOne>
    <DamageOne name="스킬"><DamageOutput crit="mean" sk /></DamageOne>
  </div>
}





interface Props {
  dfchar: DFChar
}

export function DFCharView({ dfchar }: Props) {
  const imgPath = useMemo(() => JSON.stringify(`/img/dfclasshud/${dfchar.dfclass}.png`), [dfchar.dfclass])
  return (
    <div className="DFCharView" style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 50%), "+`url(${imgPath})`}}>
      <h3>{dfchar.name}</h3>
      <div className="DamageGrid">
        <DamageOne name="평균 데미지"><DamageOutput crit="mean" /></DamageOne>
        <DamageOne name="평균 스킬데미지"><DamageOutput crit="mean" sk /></DamageOne>
        <DamageOne name="크리데미지"><DamageOutput crit /></DamageOne>
        <DamageOne name="스킬 크뎀"><DamageOutput crit sk /></DamageOne>
      </div>
    </div>
  )
}