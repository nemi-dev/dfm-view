import styled from "styled-components"

const SignSymbol = styled.span`
  font-size: 0.85em;
  font-weight: 400;
`
const PercentSymbol = styled.span.attrs({ children: "%" })`
  font-size: 0.6em;
  font-weight: 400;
`

const Percise = [
  1,
  10,
  100,
  1000,
  10000,
  100000,
  1000000,
  10000000,
  100000000,
  1000000000,
  10000000000
]
interface NumberViewProps {
  value: number
  className?: string
  signed?: boolean
  percented?: boolean
  separated?: boolean
  percision?: number
}


export function Num({ value, className = "", signed = false, percented = false, separated = false, percision = 0 }: NumberViewProps) {
  value = value ?? 0
  const dip =  percision <= 10? Percise[percision] : 10 ** percision
  const ve = Math.round(value * dip) / dip
  const sign = ve > 0 ? (signed ? "+" : null) : ve < 0 ? "-" : null
  const vs = separated ? Math.abs(ve).toLocaleString() : Math.abs(ve).toString()
  return (
    <span className={className}>
      {sign ? <SignSymbol>{sign}</SignSymbol> : null}
      {vs}
      {percented ? <PercentSymbol /> : null}
    </span>
  )
}
