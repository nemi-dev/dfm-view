import { useCallback, useContext, useState } from 'react'

import { acceptEmblem } from '../../emblem'
import { useAppDispatch, useAppSelector } from '../../feats/hooks'
import { selectEmblemSpecs } from '../../feats/selector/equipSelectors'
import { SetMyEmblem } from '../../feats/slices/mycharSlice'
import { getEmblemSocketType } from '../../items'
import { NumberInput } from '../widgets/Forms'
import { EmblemIcon } from '../widgets/Icons'
import { CurrentPart } from './CurrentPart'
import { ModalContext } from './modalContext'

function EmblemSelect({ part, index, type, level }: { part: CardablePart, index: number, type: EmblemType, level: number }) {
  const { closeModal } = useContext(ModalContext)
  const accept = acceptEmblem(part)
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    dispatch(SetMyEmblem([part, index, type, level]))
    closeModal()
  }, [part, index, type, level])
  return (
    <div className="ModalEmblemSelect" onClick={onClick}>
      <EmblemIcon spec={[type, null]} accept={accept} />
    </div>
  )
}

export function EmblemModal({ part, index }: { part: CardablePart, index: number }) {
  const emblems = useAppSelector(selectEmblemSpecs[part])
  const currentSpec = emblems[index]
  const [newLevel, setNewLevel] = useState(currentSpec[1])
  const availableEmblemTypes = getEmblemSocketType(part)
  return(<>
    <h3>엠블렘</h3>
    <CurrentPart part={part} index={index} />
    <div style={{ marginBlockStart: "0.5rem", fontWeight: 700}}>새로 장착할 엠블렘 레벨을 입력한 후, 아래 아이콘을 누르세요</div>
    <div style={{ marginBlockEnd: "0.5rem", fontSize: "smaller" }}>{index + 1}번째 엠블렘 소켓에 장착됩니다</div>
    <div>
      엠블렘 레벨
      <NumberInput className="EmblemLevelInput" min={5} max={10} step={1} value={newLevel} onChange={v => setNewLevel(v)} />
    </div>
    <div className="EmblemSelectArray">
      {availableEmblemTypes.map((type) => (
        <EmblemSelect key={type} type={type} part={part} index={index} level={newLevel} />
      ))}
    </div>
  </>)
}
