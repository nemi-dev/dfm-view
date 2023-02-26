import { PayloadAction } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { useAppSelector } from "../feats/hooks"
import { RootState } from "../feats/store"
import { getMagicPropsAttrs } from "../magicProps"
import { IconicAttrView } from "./AttrsView"



interface MagicPropsArrayProps {
  level: number
  part: EquipPart | "봉인석"
  rarity: Rarity
  arraySelector: (state: RootState) => MagicPropsCareAbout[]
  actionCreator: (part: EquipPart | "봉인석", index: number) => PayloadAction<any>
}





export function MagicPropsArray({ level, part, rarity, arraySelector, actionCreator }: MagicPropsArrayProps) {
  const array = useAppSelector(arraySelector)
  const attrArray = array.map((mp, index) => getMagicPropsAttrs(mp, part, level, rarity, index == 0))
  const className = rarity === "Epic"? "MagicPropsArray ForEpic" : "MagicPropsArray"
  const dispatch = useDispatch()

  return (
    <div className={className}>
      {attrArray.map((attr, index) => {
        if (rarity != "Epic" && index == 0) return null
        return <IconicAttrView key={index} attrs={attr}
        onClick={() => {
          dispatch(actionCreator(part, index))
        }} />
      })}
    </div>
  )
}