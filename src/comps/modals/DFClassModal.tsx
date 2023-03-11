import styled from "styled-components"
import { useContext } from "react"
import { useAppDispatch, useAppSelector } from "../../feats/hooks"
import { selectMyName } from "../../feats/selector/selfSelectors"
import { SetDFClass, SetMyName } from "../../feats/slices/slice"
import { ModalContext } from "../../modalContext"

const DFClassLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
`

const DFCharNameInput = styled.input`
input[type=text]& {
  width: 200px;
  text-align: center;
}
`

function DFClassSelect({ name }: { name: DFClassName }) {
  if (!name) return <div />
  const { setOpen } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  return <img src={`/img/dfclass/${name}.png`} onClick={()=>(dispatch(SetDFClass(name)), setOpen(false))} />
}

const dfclassOrder: DFClassName[] = [
  "버서커", "소울브링어", "웨펀마스터", "아수라",
  "레인저(남)", "런처(남)", "메카닉", "스핏파이어",
  "넨마스터", "스트라이커", 
  "엘레멘탈마스터", "마도학자", 
  "크루세이더(여)", "미스트리스", "이단심판관", "무녀",
  "소드마스터", "베가본드", "데몬슬레이어", "다크템플러",
  "크루세이더(남)", "인파이터", 
  "와일드베인", "윈드시어"
]

export function DFClassModal() {
  const dispatch = useAppDispatch()
  const myName = useAppSelector(selectMyName)
  return (
    <div>
      <header>
        <h3>직업 바꾸기</h3>
        <div>여기서는 직변권이 무한!!!</div>
      </header>
      <DFCharNameInput type="text" maxLength={20} value={myName} onChange={ev => dispatch(SetMyName(ev.target.value))} />
      <div className="ModalMenuScrollable">
      <DFClassLayout>
      {dfclassOrder.map((name, index) => <DFClassSelect key={index} name={name} />)}
      </DFClassLayout>
      </div>
    </div>
  )
}