import { useCallback, useContext, useMemo } from 'react'

import { useAppDispatch } from '../../feats/hooks'
import { SetMyItem } from '../../feats/slices/slicev5'
import { getItemsByPart } from '../../items'
import { ItemSizeDefiner } from './CommonModalComps'
import { CurrentPart } from './CurrentPart'
import { ModalContext } from './modalContext'
import { ModalItemSelect } from './Select'

export function ArtifactModalFragment({ artiColor }: { artiColor: ArtifactColor }) {
  const { closeModal } = useContext(ModalContext)
  const items = useMemo(() => getItemsByPart("아티팩트")
  .filter(item => item.ArtiColor === artiColor), [artiColor])
  const dispatch = useAppDispatch()
  const onClick = useCallback((name: string) => {
    // dispatch(SetArtifact([artiColor as ArtifactColor, name]))
    dispatch(SetMyItem(['아티팩트', artiColor, name]))
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