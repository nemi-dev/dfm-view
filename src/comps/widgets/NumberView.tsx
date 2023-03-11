import styled from "styled-components"

const SignSymbol = styled.span`
  font-size: 0.85em;
  font-weight: 400;
  vertical-align: text-top;
`
const PercentSymbol = styled.span.attrs({ children: "%" })`
  font-size: 0.6em;
  font-weight: 400;
`
interface NumberViewProps {
  value: number
  className?: string
  signed?: boolean
  percented?: boolean
  separated?: boolean
}

export function Num({ value, className = "", signed = false, percented = false, separated = false }: NumberViewProps) {
  value = value ?? 0
  const ve = Math.round(value * 100) / 100
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
