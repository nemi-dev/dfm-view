import { ErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { SetMyChoiceOfBranch, SetMyChoiceOfExclusive, SetMyChoiceOfGives } from '../feats/slices/slicev5'
import { createCondyceKey2, createExclusiveKey2, getActiveISets } from '../items'
import { SimpleBaseAttrView } from './widgets/AttrsView'
import { LabeledNumberInput, LabeledSwitch, RadioGroup } from './widgets/Forms'
import { selectChoice } from '../feats/selector/baseSelectors'

interface LeafViewProps {
  itemKey: string
  node: ConditionalNode
  what: "branches" | "gives"
  Action: (typeof SetMyChoiceOfBranch | typeof SetMyChoiceOfGives)
}
function LeafView({ itemKey, node, what, Action }: LeafViewProps) {
  const dispatch = useAppDispatch()
  const value = useAppSelector(state => selectChoice(state)[what][itemKey] ?? 0)
  const maxValue = node.maxRepeat ?? 1
  const pick = node.pick
  if (maxValue === 1) {
    if (pick) 
    return <LabeledSwitch checked={!!value}
      label={<>{node.pick}<SimpleBaseAttrView attrs={node.attrs} /></>}
      onChange={b => dispatch(Action([itemKey, b? 1: 0]))}
    />

    else
    return <span className="FormDF">
      <SimpleBaseAttrView attrs={node.attrs} />
    </span>
  }
  return (
    <LabeledNumberInput
      value={value}
      label={<>{node.pick}<SimpleBaseAttrView attrs={node.attrs} /></>}
      onChange={v => dispatch(Action([itemKey, v]))}
      min={0}
      max={maxValue}
    />
  )
}

interface BrachViewProps {
  name: string
  nodes?: ConditionalNode[]
  what: "branches" | "gives"
}

const CondyceTypesStyle = styled.div`
  display: flex;
  flex-direction: column;

`

function BranchOrGivesView({ name, nodes, what }: BrachViewProps) {
  if (!nodes) return null
  const Action = what === "branches" ? SetMyChoiceOfBranch : SetMyChoiceOfGives
  return (
    <ErrorBoundary fallback={<>이런! 이 조건부 옵션에 문제가 있나봐요. 개발자에게 알려주세요!</>}>
      <CondyceTypesStyle>
        <div className="CondContainerName">{name}</div>
        {nodes.map((node) => {
          const key = createCondyceKey2(name, node)
          return <LeafView key={key} what={what} Action={Action} itemKey={key} node={node} />
        })}
      </CondyceTypesStyle>
    </ErrorBoundary>
  )
}

function ExclusiveNodeView({ prefix, node }: { prefix: string, node: ExclusiveSet }) {
  const dispatch = useAppDispatch()
  const value = useAppSelector(state => selectChoice(state).exclusives[prefix])
  const values = node.children.map(n => n.pick)
  return <RadioGroup groupName={node.pickSet} name={prefix} values={values} value={value}
    dispatcher={val => dispatch(SetMyChoiceOfExclusive([prefix, val]))}
  />
}

interface ExclusiveViewProps {
  name: string
  exclusives: ExclusiveSet[] | null | undefined
}


function ExclusiveSetView({ name, exclusives }: ExclusiveViewProps) {
  if (!exclusives) return null
  return (
    <ErrorBoundary fallback={<>이런! 이 옵션에 문제가 있나봐요. 개발자에게 알려주세요!</>}>
      <CondyceTypesStyle>
        <div className="CondContainerName">{name}</div>
        {exclusives.map((node) => {
          const prefix = createExclusiveKey2(name, node)
          return <ExclusiveNodeView key={prefix} prefix={prefix} node={node} />
        })}
      </CondyceTypesStyle>
    </ErrorBoundary>
  )
}

interface CondyceProps {
  iii: ComplexAttrSource
}

export function Condyce({ iii }: CondyceProps) {
  if (!iii) return null
  const { name, branch, gives, exclusive } = iii
  if (!(branch || exclusive || gives)) return null
  return <>
    <BranchOrGivesView what="branches" name={name} nodes={branch} />
    <BranchOrGivesView what="gives" name={name} nodes={gives} />
    <ExclusiveSetView name={name} exclusives={exclusive} />
  </>
}


const CondArray = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;

@media (max-width: 999px) {
  display: flex;
  flex-direction: column;
}
`

export function ClosedCondyceSet({ items }: { items: DFItem[] }) {
  const isets = getActiveISets(...items)
  return (
    <CondArray>
      {items.map(item => item? <Condyce key={item.name} iii={item} /> : null)}
      {isets.map(iset => <Condyce key={iset.name} iii={iset} />)}
    </CondArray>
  )
}


