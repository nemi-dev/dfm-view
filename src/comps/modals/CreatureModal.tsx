import { useContext, useCallback, useMemo } from "react"
import { useAppDispatch } from "../../feats/hooks"
import { SetArtifact, SetItem } from "../../feats/slices/itemSlice"
import { getItemsByPart } from "../../items"
import { ModalContext } from "../../modalContext"
import { Select } from "./Select"

export function CreatureModalFragment() {
  const { setOpen, } = useContext(ModalContext)
  const items = getItemsByPart("크리쳐")
  
  const dispatch = useAppDispatch()
  const onClick = useCallback((name: string) => {
    dispatch(SetItem(["크리쳐", name]))
    setOpen(false)
  }, [])
  return (
    <div className="ItemSelectArray">
      {items.map(item =>(
        <Select key={item.name} item={item} onClick={() => onClick(item.name)} />
      ))}
    </div>
  )
}


export function ArtifactModalFragment() {
  const { setOpen, message } = useContext(ModalContext)
  const { index: artiColor } = message as ModalRequestForItem
  const items = useMemo(() => getItemsByPart("아티팩트")
  .filter(item => item.ArtiColor === artiColor), [artiColor])
  const dispatch = useAppDispatch()
  const onClick = useCallback((name: string) => {
    dispatch(SetArtifact([artiColor as "Red" | "Green" | "Blue", name]))
    setOpen(false)
  }, [artiColor])
  return (
    <div className="ItemSelectArray">
      {items.map(item => (
        <Select key={item.name} item={item} onClick={() => onClick(item.name)} />
      ))}
    </div>
  )
}