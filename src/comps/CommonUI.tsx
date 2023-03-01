import React, { DetailedHTMLProps, useCallback, useId } from 'react'
import { im } from '../utils'
import '../style/Common.scss'
import styled from 'styled-components'

function prevent(ev : WheelEvent) {
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

export function Percent({ value, signed = false }: { value: number, signed?: boolean }) {
  value = value ?? 0
  const ve = Math.round(value * 100) / 100
  const sign = ve > 0? ( signed? "+" : null ) : ve < 0? "-" : null
  return (
    <span>
      {sign? <SignSymbol>{sign}</SignSymbol> : null}
      {Math.abs(ve)}
      <PercentSymbol />
    </span>
  )
}

interface ItemIconProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  src: string
  frame: string
}

export function ItemIcon({ src, frame, className = "", children, ...props }: ItemIconProps) {
  return (
    <div className={className? "ItemIcon "+className : "ItemIcon"} {...props} >
      <img className="IconImage" src={src} alt="" />
      {children}
      <img className="IconFrame" src={frame} alt="" />
    </div>
  )
}

function imageSource(attrs: BaseAttrs) {
  const { itype } = attrs
  switch(itype) {
    case "무기아바타":
    return [im`/img/item/${attrs}.png`, `/img/frame/WeaponAvatar-${attrs.rarity}.png`]

    case "칭호":
    return [im`/img/item/${attrs}.png`, `/img/frame/Title-${attrs.rarity}.png`]

    case "오라":
    return [im`/img/item/${attrs}.png`, "/img/frame/WeaponAvatar-Rare.png"]

    default:
    return [im`/img/item/${attrs}.png`, `/img/frame/${attrs.rarity}.png`]
  }
}

interface ItemIcon2Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  attrs: Attrs
}

export function ItemIcon2({ attrs, children, className, ...props }: ItemIcon2Props) {
  if (!attrs) return <ItemIcon className={className} children={children} src="" frame="/img/frame/Common.png" {...props} />
  const [src, frame] = imageSource(attrs)
  return <ItemIcon className={className} children={children}
    src={src} frame={frame} {...props} />
}



export function RoundIcon({ src, frame, className = "", children, ...props }: ItemIconProps) {
  return(
    <div className={"RoundIcon "+className} {...props}>
      <img className="IconImage" src={src} alt="" />
      {children}
      <img className="IconFrame" src={frame} alt="" />
    </div>
  )
}


interface EmblemIconProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  spec: EmblemSpec
  accept: "Weapon" | "Red" | "Yellow" | "Blue" | "Green" | "Platinum"
}

export function EmblemIcon({ spec: [type, level], className = "", accept, ...props }: EmblemIconProps) {
  return(
    <RoundIcon className={"Emblem "+className}
    src={`/img/emblem/${type}.png`} frame={`/img/emblem/${accept}Sock.png`} {...props}>
      {level? <span className="EmblemLevel">{level}</span> : null }
    </RoundIcon>
  )
}


export function CrackIcon({ item, className, ...props }: { item: Attrs } & DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return <RoundIcon className={className} src={im`/img/item/${item}.png`} frame={`/img/crack/${item.rarity}.png`} {...props} />
}

interface NumberInputProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "onChange"> {
  onChange: (val: number) => void
}
export function NumberInput({onWheel, value, type, onChange, ...props}: NumberInputProps) {
  const ref = React.useRef<HTMLInputElement>()
  React.useEffect(() => {
    ref.current.addEventListener("wheel", prevent, { passive: false })
  }, [])

  const _onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(ev.target.value)
    Number.isNaN(newValue)? onChange(0) : onChange(newValue)
  }, [])
  
  return <input type="number" value={value} onChange={_onChange} ref={ref} {...props}/>
}


interface LabeledInputProps {
  className?: string
  label: string
  value: number
  onChange: (val: number) => void
}
export function LabeledInput({ className = "", label, value, onChange }: LabeledInputProps) {
  const id = useId()
  if (Number.isNaN(value)) value = 0
  return (
    <div className={("InputGroup NumberInput "+className).trim()}>
      <label className="FormGroupName" htmlFor={id}>{label}</label>
      <NumberInput className="FormGroupValue"  id={id} value={value} onChange={onChange} placeholder={label} />
    </div>
  )
}

export function DisposableInput({ index, value, update, del }: { index: number, value: number, update: (a: number, b: number) => void, del: (a: number) => void, }) {
  return (
    <div className="DisposableInput">
      <NumberInput className="FormGroupValue" value={value} onChange={v => update(v, index)} />
      <button onClick={() => del(index)}>⨯</button>
    </div>
  )
}

export function OutputView({ tag, value }: { tag: string, value: number | string }) {
  return (
    <div className="OutputView">
      <div>{tag}</div>
      <div className="Value">{value}</div>
    </div>
  )
}

type AttrIconProps = { attrKey: keyof BaseAttrs } & Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "src" | "alt" >
export function AttrIcon({attrKey, className = "", ...props}: AttrIconProps) {
  return (
    <img src={`/img/attr/${attrKey}.png`} alt={attrKey} className={className? "AttrIcon "+className : "AttrIcon"} {...props} />
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


interface RadioGroupProps<T extends number | string> {
  name: string
  groupName?: string
  className?: string
  values: T[]
  labels?: (string | number)[]
  value: T
  dispatcher: (value: T) => any
}

export function RadioGroup<T extends string | number>({ name, groupName = name, className = "", values, labels = values, value, dispatcher }: RadioGroupProps<T>) {
  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    dispatcher(ev.target.value as T)
  }, [])
  return (
    <span className={("RadioGroup "+className).trim()}>
      <span className="FormGroupName">{groupName}</span>
      {values.map((v, i) => (
        <span key={v} className="RadioOne FormGroupValue">
          <input type="radio" name={name} value={v} id={`Radio-${name}-${v}`} checked={v === value} onChange={onChange} />
          <label htmlFor={`Radio-${name}-${v}`}>{labels[i]}</label>
        </span>
      ))}
    </span>
  )
}

interface CheckboxGroupProps<T extends number | string> {
  name: string
  groupName?: string
  className?: string
  values: T[]
  value: T[]
  labels?: (string | number)[]
  dispatcher: (value: T, checked: boolean) => any
}
export function CheckboxGroup<T extends string | number>({ name, groupName = name, className = "", values, labels = values, value, dispatcher }: CheckboxGroupProps<T>) {
  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    dispatcher(ev.target.value as T, ev.target.checked)
  }, [])
  return (
    <span className={("RadioGroup "+className).trim()}>
      <span className="FormGroupName">{groupName}</span>
      {values.map((v, i) => (
        <span key={v} className="RadioOne FormGroupValue">
          <input type="checkbox" name={name} value={v} id={`Radio-${name}-${v}`} checked={value.includes(v)} onChange={onChange} />
          <label htmlFor={`Radio-${name}-${v}`}>{labels[i]}</label>
        </span>
      ))}
    </span>
  )
}


type ButtonGroupProps<T extends string | number> = Omit<RadioGroupProps<T>, "value">

export function OneClickButtonGroup<T extends string | number>({ name, groupName = name, className = "", values, labels = values, dispatcher }:ButtonGroupProps<T>) {
  return (
    <span className={("OneClickGroup "+className).trim()}>
      <span className="FormGroupName">{groupName}</span>
      {values.map((v, i) => (
        <button key={v.toString()} id={v.toString()} onClick={() => dispatcher(v)}>{labels[i]}</button>
      ))}
    </span>
  )
}

export const Gridy = styled.div<{ columns: number, colSize?: string }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, ${props => props.colSize ?? "auto"});
  grid-auto-rows: auto;
  gap: 2px;
`