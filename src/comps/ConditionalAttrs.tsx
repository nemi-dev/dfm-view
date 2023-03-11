import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { SimpleBaseAttrView } from "./widgets/AttrsView"
import { SetBranch, SetExclusive, SetGives } from "../feats/slices/switchSlice"
import { selectItem } from "../feats/selector/equipSelectors"
import { Checkie, RadioGroup } from "./widgets/Forms"
import { equipParts, getActiveISets } from "../items"
import styled from "styled-components"


interface Named {
  name: string
}

interface LeafViewProps {
  itemKey: string
  node: ConditionalNode
  what: "branches" | "gives"
  Action: (typeof SetBranch | typeof SetGives)
}
function LeafView({ itemKey, node, what, Action }: LeafViewProps) {
  const checked = useAppSelector(state => state.Choice[what][itemKey] ?? false)
  const dispatch = useAppDispatch()
  return (
    <Checkie checked={checked}
      label={<>{node.when}<SimpleBaseAttrView attrs={node.attrs} /></>}
      onChange={b => dispatch(Action([itemKey, b]))}
    />
  )
}

interface BrachViewProps extends Named {
  nodes: ConditionalNode[]
  what: "branches" | "gives"
}

const CondOne = styled.div`
  display: flex;
  flex-direction: column;

  .CondContainerName {
    text-align: center;
    font-weight: 800;
    color: white;
    margin-block: 0.5rem;
  }
`

export function BranchOrGivesView({ name, nodes, what }: BrachViewProps) {
  if (!nodes) return null
  const Action = what === "branches" ? SetBranch : SetGives
  return (
    <CondOne>
      <div className="CondContainerName">{name}</div>
      {nodes.map((node) => {
        const key = `${name}::${node.when}`
        return <LeafView key={key} what={what} Action={Action} itemKey={key} node={node} />
      })}
    </CondOne>
  )
}

function ExclusiveNodeView({ prefix, node }: { prefix: string, node: ExclusiveSet }) {
  const values = node.children.map(n => n.name)
  const value = useAppSelector(state => state.Choice.exclusives[prefix])
  const dispatch = useAppDispatch()
  return <RadioGroup groupName={node.label} name={prefix} values={values} value={value}
    dispatcher={val => dispatch(SetExclusive([prefix, val]))}
  />
}

interface ExclusiveViewProps extends Named {
  exclusives: ExclusiveSet[]
}


export function ExclusiveSetView({ name, exclusives }: ExclusiveViewProps) {
  if (!exclusives) return null
  return (
    <CondOne>
      <div className="CondContainerName">{name}</div>
      {exclusives.map((node) => {
        const prefix = `${name}::${node.name}`
        return <ExclusiveNodeView key={prefix} prefix={prefix} node={node} />
      })}
    </CondOne>
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
      {items.map(item => <Condyce key={item.name} iii={item} />)}
      {isets.map(iset => <Condyce key={iset.name} iii={iset} />)}
    </CondArray>
  )
}

export function CondsAttrsView() {
  const items = equipParts.map(part => useAppSelector(selectItem[part]))
  return <ClosedCondyceSet items={items} />
}
