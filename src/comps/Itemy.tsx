import { useAppSelector, useAppDispatch } from "../feats/hooks"
import { isArmor } from "../items"
import { selectItem, selectCustomMaterial } from "../feats/selector/equipSelectors"
import { EmblemIcon } from "./widgets/Icons"
import { SetMaterial } from "../feats/slices/itemSlice"

export interface EquipProps {
  part: EquipPart
  interactive?: boolean
  showUpgarde?: boolean
}

export function ArmorMaterialSelect({ part }: EquipProps) {
  const item = useAppSelector(selectItem[part])
  const material = useAppSelector(selectCustomMaterial[part])
  const dispatch = useAppDispatch()
  if (!isArmor(part)) return null
  if (!item) return null
  return (
    <select className="ArmorMaterialSelector" value={material}
      onChange={ev => dispatch(SetMaterial([part, ev.target.value as ArmorMaterial]))}>
      <option value="천">천</option>
      <option value="가죽">가죽</option>
      <option value="경갑">경갑</option>
      <option value="중갑">중갑</option>
      <option value="판금">판금</option>
    </select>
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
