import React, { DetailedHTMLProps, useCallback } from 'react'
import { im } from '../utils'
import '../style/Common.scss'

function prevent(ev : WheelEvent) {
  (ev.target as HTMLElement).blur()
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

export function LabeledInput({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) {
  if (Number.isNaN(value)) value = 0
  return (
    <div className="InputView">
      <label htmlFor={label}>{label}</label>
      <NumberInput name={label} value={value} onChange={onChange} />
    </div>
  )
}

export function DisposableInput({ index, value, update, del }: { index: number, value: number, update: (a: number, b: number) => void, del: (a: number) => void, }) {
  return (
    <div className="DisposableInput">
      <NumberInput value={value} onChange={v => update(v, index)} />
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
