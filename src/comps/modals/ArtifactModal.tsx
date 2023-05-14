import { useContext, useCallback, useMemo } from "react"
import { useAppDispatch } from "../../feats/hooks"
import { SetArtifact } from "../../feats/slices/itemSlice"
import { getItemsByPart } from "../../items"
import { ModalContext } from "./modalContext"
import { CurrentPart } from "./CurrentPart"
import { ModalItemSelect } from "./Select"
import { ItemSizeDefiner } from "./CommonModalComps"


export function ArtifactModalFragment({ artiColor }: { artiColor: ArtifactColor }) {
  const { closeModal } = useContext(ModalContext)
  const items = useMemo(() => getItemsByPart("아티팩트")
  .filter(item => item.ArtiColor === artiColor), [artiColor])
  const dispatch = useAppDispatch()
  const onClick = useCallback((name: string) => {
    dispatch(SetArtifact([artiColor as ArtifactColor, name]))
    closeModal()
  }, [artiColor])
  return (
    <>
      <CurrentPart part="아티팩트" index={artiColor} />
      <ItemSizeDefiner className="ItemSelectArray">
        {items.map(item => (
          <ModalItemSelect key={item.name} item={item} onClick={() => onClick(item.name)} />
        ))}
      </ItemSizeDefiner>
    </>
  )
}