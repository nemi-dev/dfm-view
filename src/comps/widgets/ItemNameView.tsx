import type { MouseEventHandler } from 'react'

interface ItemNameProps {
  item: DFItem
  alt?: string
  className?: string
  onClick?: MouseEventHandler<HTMLSpanElement>
}

export function ItemName({ item, alt = "아이템 없음", className, onClick }: ItemNameProps) {
  if (!item) return <span className="ItemName Empty">{alt}</span>
  const { name, rarity } = item
  const classList = ["ItemName"]
  if (rarity) classList.push("Rarity_" + rarity)
  if (className) classList.push(className)
  return (
    <span className={classList.join(" ")} onClick={onClick}>{name}</span>
  )
}
