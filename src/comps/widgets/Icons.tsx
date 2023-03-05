import type { HTMLProps } from 'react'
import { im } from '../../utils'

interface SquareIconProps extends HTMLProps<HTMLDivElement> {
  src: string
  frame: string
}

export function SquareIcon({ src, frame, className, children, ...props }: SquareIconProps) {
  return (
    <div className={"SquareIcon " + (className ?? "")} {...props}>
      <img className="IconImage" src={src} alt="" />
      {children}
      <img className="IconFrame" src={frame} alt="" />
    </div>
  )
}
function imageSource(attrs: BaseAttrs) {
  const { itype } = attrs
  switch (itype) {
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
interface ItemIcon2Props extends HTMLProps<HTMLDivElement> {
  attrs: Attrs
}

export function ItemIcon({ attrs, children, className, ...props }: ItemIcon2Props) {
  if (!attrs)
    return <SquareIcon className={"ItemIcon " + (className ?? "")} children={children} src="" frame="/img/frame/Common.png" {...props} />
  const [src, frame] = imageSource(attrs)
  return <SquareIcon className={"ItemIcon " + (className ?? "")} children={children}
    src={src} frame={frame} {...props} />
}



export function RoundIcon({ src, frame, className = "", children, ...props }: SquareIconProps) {
  return (
    <div className={"RoundIcon " + className} {...props}>
      <img className="IconImage" src={src} alt="" />
      {children}
      <img className="IconFrame" src={frame} alt="" />
    </div>
  )
}
interface EmblemIconProps extends HTMLProps<HTMLDivElement> {
  spec: EmblemSpec
  accept: "Weapon" | "Red" | "Yellow" | "Blue" | "Green" | "Platinum"
}

export function EmblemIcon({ spec: [type, level], className = "", accept, ...props }: EmblemIconProps) {
  return (
    <RoundIcon className={"Emblem " + className}
      src={`/img/emblem/${type}.png`} frame={`/img/emblem/${accept}Sock.png`} {...props}>
      {level ? <span className="EmblemLevel">{level}</span> : null}
    </RoundIcon>
  )
}


export function CrackIcon({ item, className, ...props }: { item: Attrs; } & HTMLProps<HTMLDivElement>) {
  return <RoundIcon className={"CrackIcon " + className} src={im`/img/item/${item}.png`} frame={`/img/crack/${item.rarity}.png`} {...props} />
}

type AttrIconProps = { attrKey: keyof BaseAttrs } & Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "src" | "alt" >
export function AttrIcon({attrKey, className = "", ...props}: AttrIconProps) {
  return (
    <img src={`/img/attr/${attrKey}.png`} alt={attrKey} className={className? "AttrIcon "+className : "AttrIcon"} {...props} />
  )
}
