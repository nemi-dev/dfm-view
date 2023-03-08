import { useAppSelector, useAppDispatch } from "../feats/hooks"
import { SetMaterial } from "../feats/slices/equipSlice"
import { isArmorPart } from "../items"
import { selectItem } from "../feats/selectors"
import { EmblemIcon } from "./widgets/Icons"

export interface EquipProps {
  part: EquipPart
  interactive?: boolean
  showUpgarde?: boolean
}

export function ArmorMaterialSelect({ part }: EquipProps) {
  if (!isArmorPart(part)) return null
  const item = useAppSelector(selectItem[part])
  if (!item) return null
  const material = useAppSelector(state => state.Equips[part].material)
  const dispatch = useAppDispatch()
  return (
    <select className="ArmorMaterialSelector" value={material} onChange={ev => dispatch(SetMaterial([part, ev.target.value as ArmorMaterial]))}>
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
