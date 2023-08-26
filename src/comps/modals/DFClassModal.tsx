import { useCallback, useContext } from 'react'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../../feats/hooks'
import { selectDFClass, selectName } from '../../feats/selector/baseSelectors'
import { SetDFClass, SetMyDFClass, SetMyName, SetName } from '../../feats/slices/slicev5'
import { PortraitMode } from '../../feats/contexts'
import { DFClassIcon } from '../widgets/Icons'

const DFClassLayout = styled.div<{ columns: number }>`
  display: grid;
  ${props => `grid-template-columns: repeat(${props.columns ?? 4}, auto)`}
`

const DFCharNameInput = styled.input`
input[type=text]& {
  width: 200px;
  text-align: center;
}
`

const dfclassOrder: DFClassName[] = [
  "버서커", "소울브링어", "웨펀마스터", "아수라",
  "소드마스터", "베가본드", "데몬슬레이어", "다크템플러",
  "레인저(남)", "런처(남)", "메카닉", "스핏파이어",
  "레인저(여)", "런처(여)", "넨마스터", "스트라이커",
  "엘레멘탈마스터", "마도학자", "배틀메이지", "인챈트리스",
  "크루세이더(여)", "미스트리스", "이단심판관", "무녀",
  "크루세이더(남)", "인파이터(남)", "와일드베인", "윈드시어",
]

export function DFClassModal({ id }: { id: string | undefined }) {
  const dispatch = useAppDispatch()
  const dfclass = useAppSelector(state => selectDFClass(state, id))
  const dfcharName = useAppSelector(state => selectName(state, id))
  const portrait = useContext(PortraitMode)

  return (
    <div>
      <header>
        <h3>캐릭터/직업 설정하기</h3>
      </header>
      <div>
        <DFClassIcon dfclassName={dfclass?.name} />
      </div>
      <DFCharNameInput type="text" maxLength={20} value={dfcharName} onChange={ev => dispatch(SetName([id, ev.target.value]))} />
      <div className="ModalMenuScrollable">
      <DFClassLayout columns={portrait? 4 : 8}>
      {dfclassOrder.map((name, index) => 
        <DFClassIcon key={name ?? `null${index}`} dfclassName={name} onClick={() => dispatch(SetDFClass([id, name]))} />
      )}
      </DFClassLayout>
      </div>
    </div>
  )
}
