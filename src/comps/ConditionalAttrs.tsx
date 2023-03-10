import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { SimpleBaseAttrView } from "./AttrsView"
import { SetBranch, SetExclusive, SetGives } from "../feats/slices/switchSlice"
import { useEffect } from "react"
import { selectISetConditionalsAll, selectItem } from "../feats/selectors"
import { Checkie, RadioGroup } from "./widgets/Forms"
import { equipParts } from "../items"
import styled from "styled-components"

interface Named {
  name: string
}

function BranchLeafView({ branchItemKey, node }: { branchItemKey: string, node: ConditionalNode }) {
  const checked = useAppSelector(state => state.Switch.branches[branchItemKey] ?? false)
  const dispatch = useAppDispatch()
  return (
    <Checkie checked={checked} label={<>{node.when}<SimpleBaseAttrView attrs={node.attrs} /></>} onChange={b => dispatch(SetBranch([branchItemKey, b]))} />
  )
}

interface BrachViewProps extends Named {
  nodes: ConditionalNode[]
}

export function BranchView({ name, nodes }: BrachViewProps) {
  return (
    <div className="CondOne">
      <div className="CondContainerName">{name}</div>
      {nodes.map((node) => {
        const key = `${name}::${node.when}`
        return <BranchLeafView key={key} branchItemKey={key} node={node} />
      })}
    </div>
  )
}

function ExclusiveOneBranchView({ prefix, node }: { prefix: string, node: ExclusiveSet }) {
  const values = node.children.map(n => n.name)
  const value = useAppSelector(state => state.Switch.exclusives[prefix])
  const dispatch = useAppDispatch()
  return <RadioGroup groupName={node.label} name={prefix} values={values} value={value}
    dispatcher={val => dispatch(SetExclusive([prefix, val]))}
  />
}

interface ExclusiveViewProps extends Named {
  exclusives: ExclusiveSet[]
}


export function ExclusiveView({ name, exclusives }: ExclusiveViewProps) {
  return (
    <div className="CondOne">
      <div className="CondContainerName">{name}</div>
      {exclusives.map((node) => {
        const prefix = `${name}::${node.name}`
        return <ExclusiveOneBranchView key={prefix} prefix={prefix} node={node} />
      })}
    </div>
  )
}


function Partie({ part }: { part: EquipPart }) {
  const item = useAppSelector(selectItem[part])
  if (!item) return null
  const name = item.name
  const { branch, exclusive, gives } = item ?? {}
  if (!(branch || exclusive || gives)) return null
  return (
    <>
      {branch? <BranchView name={name} nodes={branch} /> : null}
      {gives?  <BranchView name={name} nodes={gives} /> : null }
      {exclusive? <ExclusiveView name={name} exclusives={exclusive} /> : null}
    </>
  )
}

const CondArray = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;


.CondOne {
  display: flex;
  flex-direction: column;

  .CondContainerName {
    text-align: center;
    font-weight: 800;
    color: white;
    margin-block: 0.5rem;
  }
}

@media (max-width: 999px) {
  display: flex;
  flex-direction: column;
}
`

export function OptionalAttrsView() {
  const {
    branches: isetBranches,
    gives: isetGives,
    exclusives: isetExclusives,
  } = useAppSelector(selectISetConditionalsAll)
  return(
    <div className="OptionalAttrsView">
      <CondArray className="CondArray">
        {equipParts.map(part => <Partie key={part} part={part} />)}
        {Object.keys(isetBranches).sort().map((key) => 
          <BranchView key={key} name={key} nodes={isetBranches[key]} />
        )}
        {Object.keys(isetGives).sort().map((key) => 
          <BranchView key={key} name={key} nodes={isetGives[key]} />
        )}
        {Object.keys(isetExclusives).sort().map((isetname) => 
          <ExclusiveView key={isetname} name={isetname} exclusives={isetExclusives[isetname]} />
        )}
      </CondArray>
    </div>
  )
}
