import React from 'react'
import '../style/Common.scss'
import styled from 'styled-components'
import { EmblemIcon } from './widgets/Icons'

export function prevent(ev : WheelEvent) {
  (ev.target as HTMLElement).blur()
}


const SignSymbol = styled.span`
  font-size: 0.85em;
  font-weight: 400;
  vertical-align: text-top;
`
const PercentSymbol = styled.span.attrs({ children: "%" })`
  font-size: 0.6em;
  font-weight: 400;
`

export const Gridy = styled.div<{ columns: number, colSize?: string }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, ${props => props.colSize ?? "auto"});
  grid-auto-rows: auto;
  gap: 2px;
`

interface PercentProps {
  value: number
  className?: string
  signed?: boolean
  percented?: boolean
  separated?: boolean
}

export function Num({ value, className = "", signed = false, percented = false, separated = false }: PercentProps) {
  value = value ?? 0
  const ve = Math.round(value * 100) / 100
  const sign = ve > 0? ( signed? "+" : null ) : ve < 0? "-" : null
  const vs = separated? Math.abs(ve).toLocaleString() : Math.abs(ve).toString()
  return (
    <span className={className}>
      {sign? <SignSymbol>{sign}</SignSymbol> : null}
      {vs}
      {percented? <PercentSymbol /> : null}
    </span>
  )
}

interface ItemNameProps {
  item: BaseAttrs
  alt?: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLSpanElement>
}
export function ItemName({ item, alt = "아이템 없음", className, onClick }: ItemNameProps) {
  const { name, rarity } = item ?? {}
  if (!name) return <span className="ItemName Empty">{alt}</span>
  const classList = ["ItemName"]
  if (rarity) classList.push("Rarity_" + rarity.at(0).toUpperCase() + rarity.slice(1))
  if (className) classList.push(className)
  return (
    <span className={classList.join(" ")} onClick={onClick}>{name}</span>
  )
}




interface EmblemArrayProps {
  emblems: EmblemSpec[]
  accept: "Weapon" | "Red" | "Yellow" | "Blue" | "Green" | "Platinum"
  onItemClick?: (n: number) => any
}

export function EmblemArray({ emblems, accept, onItemClick }: EmblemArrayProps) {
  return (
    <>
    {emblems.map((spec, index) => (
      <EmblemIcon key={index} spec={spec} accept={accept} onClick={() => onItemClick(index)} />
    ))}
    </>
  )
}