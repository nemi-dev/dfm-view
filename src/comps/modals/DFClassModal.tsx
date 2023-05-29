import { useContext } from 'react'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../../feats/hooks'
import { selectDFClass, selectName } from '../../feats/selector/baseSelectors'
import { SetMyDFClass, SetMyName } from '../../feats/slices/slicev5'
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
  "레인저(남)", "런처(남)", "메카닉", "스핏파이어",
  "넨마스터", "스트라이커", 
  "엘레멘탈마스터", "마도학자", 
  "크루세이더(여)", "미스트리스", "이단심판관", "무녀",
  "소드마스터", "베가본드", "데몬슬레이어", "다크템플러",
  "크루세이더(남)", "인파이터", 
  "와일드베인", "윈드시어",
  "레인저(여)", "런처(여)"
]

export function DFClassModal() {
  const dispatch = useAppDispatch()
  const myClass = useAppSelector(selectDFClass)
  const myName = useAppSelector(selectName)
  const portrait = useContext(PortraitMode)
  return (
    <div>
      <header>
        <h3>캐릭터/직업 설정하기</h3>
      </header>
      <div>
        <DFClassIcon dfclassName={myClass?.name} />
      </div>
      <DFCharNameInput type="text" maxLength={20} value={myName} onChange={ev => dispatch(SetMyName(ev.target.value))} />
      <div className="ModalMenuScrollable">
      <DFClassLayout columns={portrait? 4 : 8}>
      {dfclassOrder.map((name) => 
        <DFClassIcon key={name} dfclassName={name} onClick={() => dispatch(SetMyDFClass(name))} />
      )}
      </DFClassLayout>
      </div>
    </div>
  )
}
