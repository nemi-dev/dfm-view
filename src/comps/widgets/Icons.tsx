import type { HTMLProps } from 'react'

/** 아이템에서 명시적으로 지정한 이미지 이름 또는 파일 이름으로 가능하게 변환된 아이템 이름을 만든다. */
function im(strings: TemplateStringsArray, item: Attrs) {
  if (item == null) return ""
  const regex = /[\<\>\:\"\'\?\*\\\/\|]/g
  if (item.image) return strings[0] + item.image + strings[1]
  else return strings[0] + item.name.replace(regex, "-") + strings[1]
}

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

type AttrIconProps = { attrKey: keyof BaseAttrs } & Omit<React.HTMLProps<HTMLImageElement>, "src" | "alt" >
export function AttrIcon({attrKey, className = "", ...props}: AttrIconProps) {
  return (
    <img src={`/img/attr/${attrKey}.png`} alt={attrKey} className={"AttrIcon "+className} {...props} />
  )
}
