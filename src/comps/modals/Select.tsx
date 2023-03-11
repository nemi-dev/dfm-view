import { MouseEventHandler } from "react"
import { ItemName } from "../widgets/ItemNameView"
import { CrackIcon } from "../widgets/Icons"

interface SelectProps {
  item: DFItem
  onClick: MouseEventHandler<HTMLDivElement>
}

export function Select({ item, onClick }: SelectProps) {
  return (
    <div className="ModalItemSelect" onClick={onClick}>
      <CrackIcon item={item} />
      <ItemName item={item} className="ItemNameResponsive" />
    </div>
  )
}
