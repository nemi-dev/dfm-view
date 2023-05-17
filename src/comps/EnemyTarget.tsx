import styled from "styled-components";
import { useAppSelector, useAppDispatch } from "../feats/hooks";
import { selectBaseEnemyDefense, selectBaseEnemyElRes, selectEnemyDefense, selectEnemyElRes } from "../feats/selector/selectors";
import { SetEnemyDefense, SetEnemyResist } from "../feats/slices/slicev5";
import { Gridy } from "./widgets/CommonUI";
import { LabeledNumberInput } from "./widgets/Forms";
import { Num } from "./widgets/NumberView";

const EnemyTargetLayout = styled.div`
  input[type=number],input[type=text] {
    width: 50px;
  }
`

export function EnemyTarget() {
  const baseEnemyDefense = useAppSelector(selectBaseEnemyDefense)
  const baseEnemyResist = useAppSelector(selectBaseEnemyElRes)
  const enemyDefense = useAppSelector(selectEnemyDefense)
  const enemyRes = useAppSelector(selectEnemyElRes)
  const dispatch = useAppDispatch()
  return (
    <EnemyTargetLayout className="EnemyTarget">
      <header>
        <h3>적</h3>
      </header>
      <Gridy columns={2} colSize="1fr">
        <LabeledNumberInput label="기본 적 방어력" value={baseEnemyDefense} onChange={v => dispatch(SetEnemyDefense(v))} />
        <LabeledNumberInput label="적 속성저항" value={baseEnemyResist} onChange={v => dispatch(SetEnemyResist(v))} />
        <div className="Result">
          <div className="KeyName">적 방어력</div>
          <Num className="AttrValue" value={enemyDefense} />
        </div>
        <div className="Result">
          <div className="KeyName">적 속성저항</div>
          <Num className="AttrValue" value={enemyRes} />
        </div>
      </Gridy>
    </EnemyTargetLayout>
  )
}