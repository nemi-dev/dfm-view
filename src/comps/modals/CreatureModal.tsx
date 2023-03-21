import { useContext, useCallback, useMemo } from "react"
import { useAppDispatch } from "../../feats/hooks"
import { SetArtifact, SetItem } from "../../feats/slices/itemSlice"
import { getItemsByPart } from "../../items"
import { ModalContext } from "./modalContext"
import { CurrentPart } from "./CurrentPart"
import { ModalItemSelect } from "./Select"

export function CreatureModalFragment() {
  const { closeModal } = useContext(ModalContext)
  const items = getItemsByPart("크리쳐")
  
  const dispatch = useAppDispatch()
  const onClick = useCallback((name: string) => {
    dispatch(SetItem(["크리쳐", name]))
    closeModal()
  }, [])
  return (
    <>
      <CurrentPart part="크리쳐" />
      <div className="ItemSelectArray">
        {items.map(item =>(
          <ModalItemSelect key={item.name} item={item} onClick={() => onClick(item.name)} />
        ))}
      </div>
    </>
  )
}


export function ArtifactModalFragment({ artiColor }: { artiColor: "Red" | "Green" | "Blue" }) {
  const { closeModal } = useContext(ModalContext)
  const items = useMemo(() => getItemsByPart("아티팩트")
  .filter(item => item.ArtiColor === artiColor), [artiColor])
  const dispatch = useAppDispatch()
  const onClick = useCallback((name: string) => {
    dispatch(SetArtifact([artiColor as "Red" | "Green" | "Blue", name]))
    closeModal()
  }, [artiColor])
  return (
    <>
      <CurrentPart part="아티팩트" index={artiColor} />
      <div className="ItemSelectArray">
        {items.map(item => (
          <ModalItemSelect key={item.name} item={item} onClick={() => onClick(item.name)} />
        ))}
      </div>
    </>
  )
}