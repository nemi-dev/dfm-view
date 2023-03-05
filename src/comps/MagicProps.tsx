import { PayloadAction } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { attrDefs } from "../attrs"
import { useAppSelector } from "../feats/hooks"
import { RootState } from "../feats/store"
import { getMagicPropsAttrs } from "../magicProps"
import { AttrIcon } from "./widgets/Icons"




type IconAttrOneProps = { attrKey: keyof BaseAttrs, value: number, alt?: string }
function IconAttrOne({ attrKey, value, alt = "" }: IconAttrOneProps) {
  return (
    <div className="IconAttrOne">
      <AttrIcon attrKey={attrKey} />
    </div>
  )
}

/** 이거 Attrs 대신에 MagicPropsCareAbout 받게 해라 */
function MagicPropOne({ attrs, onClick }: { attrs: BaseAttrs, onClick?: React.MouseEventHandler<HTMLDivElement> }) {
  const views: JSX.Element[] = []
  for (const { key, name } of attrDefs.array) {
    const value = attrs[key]
    if ((key in attrs) && (typeof value === "number")) {
      views.push(<IconAttrOne key={key} attrKey={key} value={value} />)
    }
  }
  return (
    <div className="MagicPropOne Hovering" onClick={onClick}>
      {views}
    </div>
  )
}

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
  const dispatch = useDispatch()
  return (
    <>
      {attrArray.map((attr, index) => {
        if (rarity != "Epic" && index == 0) return null
        return <MagicPropOne key={index} attrs={attr}
        onClick={() => {
          dispatch(actionCreator(part, index))
        }} />
      })}
    </>
  )
}

interface MagicPropsArrayProps2 {
  item: Attrs
  part: EquipPart | "봉인석"
  arraySelector: (state: RootState) => MagicPropsCareAbout[]
  actionCreator: (part: EquipPart | "봉인석", index: number) => PayloadAction<any>
}
export function MagicPropSet({ item, part, arraySelector, actionCreator }: MagicPropsArrayProps2) {
  if (!item) return null
  const { level, rarity } = item
  return <MagicPropsArray level={level} rarity={rarity} part={part}
    actionCreator={actionCreator}
    arraySelector={arraySelector}
  />
}