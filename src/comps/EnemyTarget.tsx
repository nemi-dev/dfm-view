import styled from "styled-components";
import { useAppSelector, useAppDispatch } from "../feats/hooks";
import { selectBaseEnemyDefense, selectBaseEnemyElRes } from "../feats/selector/selectors";
import { SetEnemyDefense, SetEnemyResist } from "../feats/slices/slice";
import { Gridy } from "./widgets/CommonUI";
import { LabeledNumberInput } from "./widgets/Forms";

const EnemyTargetLayout = styled.div`
  input[type=number],input[type=text] {
    width: 50px;
  }
`

export function EnemyTarget() {
  const enemyDefense = useAppSelector(selectBaseEnemyDefense)
  const enemyResist = useAppSelector(selectBaseEnemyElRes)
  const dispatch = useAppDispatch()
  return (
    <EnemyTargetLayout className="EnemyTarget">
      <header>
        <h3>적</h3>
      </header>
      <Gridy columns={2} colSize="1fr">
        <LabeledNumberInput label="적 방어력" value={enemyDefense} onChange={v => dispatch(SetEnemyDefense(v))} />
        <LabeledNumberInput label="적 속성저항" value={enemyResist} onChange={v => dispatch(SetEnemyResist(v))} />
      </Gridy>
    </EnemyTargetLayout>
  )
}