import { MouseEventHandler } from "react"
import { ItemName } from "../widgets/ItemNameView"
import { CrackIcon, ItemIcon } from "../widgets/Icons"

interface SelectProps {
  item: DFItem
  onClick: MouseEventHandler<HTMLDivElement>
  className?: string
}

export function ModalItemSelect({ item, onClick, className = "" }: SelectProps) {
  const IconType = item.itype === "봉인석" || item.itype === "정수"? CrackIcon : ItemIcon
  return (
    <div className="ModalItemSelect" onClick={onClick}>
      <IconType item={item} className={className} />
      <ItemName item={item} className="ItemNameResponsive" />
    </div>
  )
}

export function ChoiceItemSelect({ item, onClick, active = false }: SelectProps & { active?: boolean}) {
  return (
    <ItemIcon className={active? "Active" : ""} item={item} onClick={onClick} />
  )
}
