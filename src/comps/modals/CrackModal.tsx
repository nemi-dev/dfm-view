import { useCallback, useContext } from "react"
import { useAppDispatch } from "../../feats/hooks"
import { SetRune, SetSpell } from "../../feats/slices/cracksSlice"
import { getItemsByPart } from "../../items"
import { CrackIcon } from "../CommonUI"
import { ModalContext } from "../modalContext"

function RuneSelect({ item }: { item: Attrs }) {
  const { itarget: [part,,], setOpen } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    dispatch(SetRune(item.name))
    setOpen(false)
  }, [])
  return (
    <div className="ModalItemSelect" onClick={onClick}>
      <CrackIcon item={item} />
    </div>
  )
}

export function RuneModalFragment() {
  const items = getItemsByPart("봉인석")
  return (
    <>
    <div className="ItemSelectArray">
      {items.map((item) => (
        <RuneSelect key={item.name} item={item} />
      ))}
    </div>
    </>
  )
}

function SpellSelect({ item }: { item: Attrs}) {
  const { itarget: [part, , index], setOpen } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    dispatch(SetSpell([index, item.name]))
    setOpen(false)
  }, [])
  return (
    <div className="ModalItemSelect" onClick={onClick}>
      <CrackIcon item={item} />
    </div>
  )
}

export function SpellModalFragment() {
  const items = getItemsByPart("정수")
  return (
    <>
    <div className="ItemSelectArray">
      {items.map((item) => (
        <SpellSelect key={item.name} item={item} />
      ))}
    </div>
    </>
  )
}