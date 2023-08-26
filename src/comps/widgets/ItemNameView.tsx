import type { MouseEventHandler } from 'react'
import "../../style/ItemName.scss"

interface ItemNameProps {
  item: DFItem
  alt?: string
  className?: string
  onClick?: MouseEventHandler<HTMLSpanElement>
}

export function ItemName({ item, alt = "아이템 없음", className, onClick }: ItemNameProps) {
  const classList = ["ItemName"]
  if (!item) return <span className={[...classList, "Empty"].join(" ")}>{alt}</span>
  const { name, rarity } = item
  if (rarity) classList.push("Rarity_" + rarity)
  if (className) classList.push(className)
  return (
    <span className={classList.join(" ")} onClick={onClick}>{name}</span>
  )
}
