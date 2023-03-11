import type { MouseEventHandler } from 'react'

interface ItemNameProps {
  item: DFItem
  alt?: string
  className?: string
  onClick?: MouseEventHandler<HTMLSpanElement>
}

export function ItemName({ item, alt = "아이템 없음", className, onClick }: ItemNameProps) {
  const { name, rarity } = item ?? {}
  if (!name)
    return <span className="ItemName Empty">{alt}</span>
  const classList = ["ItemName"]
  if (rarity)
    classList.push("Rarity_" + rarity.at(0).toUpperCase() + rarity.slice(1))
  if (className)
    classList.push(className)
  return (
    <span className={classList.join(" ")} onClick={onClick}>{name}</span>
  )
}
