import React, { useCallback, useContext } from "react"
import { useAppDispatch } from "../../feats/hooks"
import { SetRune, SetSpell } from "../../feats/slices/cracksSlice"
import { getItemsByPart } from "../../items"
import { ItemName } from "../CommonUI"
import { CrackIcon } from "../widgets/Icons"
import { ModalContext } from "../../modalContext"

interface SelectProps {
  item: Attrs
  onClick: React.MouseEventHandler<HTMLDivElement>
}

function Select({ item, onClick }: SelectProps) {  
  return (
    <div className="ModalItemSelect" onClick={onClick}>
      <CrackIcon  item={item} />
      <ItemName item={item} className="ItemNameResponsive" />
    </div>
  )
}

export function RuneModalFragment() {
  const { setOpen, } = useContext(ModalContext)
  const items = getItemsByPart("봉인석")
  const dispatch = useAppDispatch()
  const onClick = useCallback((name: string) => {
    dispatch(SetRune(name))
    setOpen(false)
  }, [])
  return (
    <>
    <div className="ItemSelectArray">
      {items.map((item) => (
        <Select key={item.name} item={item} onClick={() => onClick(item.name)} />
      ))}
    </div>
    </>
  )
}

export function SpellModalFragment() {
  const { setOpen, itarget: [, , spellIndex] } = useContext(ModalContext)
  const items = getItemsByPart("정수")
  const dispatch = useAppDispatch()
  const onClick = useCallback((name: string) => {
    dispatch(SetSpell([spellIndex, name]))
    setOpen(false)
  }, [spellIndex])
  return (
    <>
    <div className="ItemSelectArray">
      {items.map((item) => (
        <Select key={item.name} item={item} onClick={() => onClick(item.name)} />
      ))}
    </div>
    </>
  )
}