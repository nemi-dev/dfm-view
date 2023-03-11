import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { SimpleBaseAttrView } from "./widgets/AttrsView"
import { SetBranch, SetExclusive, SetGives } from "../feats/slices/switchSlice"
import { selectISets, selectItem } from "../feats/selectors"
import { Checkie, RadioGroup } from "./widgets/Forms"
import { equipParts } from "../items"
import styled from "styled-components"
import { collectSpecial } from "../attrs"
import type { RootState } from "../feats/store"


/** 지금 적용된 세트로부터, 활성화 여부를 불문하고 모든 가능한 조건부 옵션들을 얻는다. */
function selectISetCondsAnyPossible(state: RootState) {
  const isets = selectISets(state)
  return collectSpecial(...isets)
}

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
  Action: (typeof SetBranch | typeof SetGives)
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

export function BranchOrGivesView({ name, nodes, what, Action }: BrachViewProps) {
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

function ExclusiveOneBranchView({ prefix, node }: { prefix: string, node: ExclusiveSet }) {
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


export function ExclusiveView({ name, exclusives }: ExclusiveViewProps) {
  return (
    <CondOne>
      <div className="CondContainerName">{name}</div>
      {exclusives.map((node) => {
        const prefix = `${name}::${node.name}`
        return <ExclusiveOneBranchView key={prefix} prefix={prefix} node={node} />
      })}
    </CondOne>
  )
}


export function Partie({ part }: { part: EquipPart | "칭호" }) {
  const item = useAppSelector(selectItem[part])
  if (!item) return null
  const name = item.name
  const { branch, exclusive, gives } = item ?? {}
  if (!(branch || exclusive || gives)) return null
  return (
    <>
      {branch? <BranchOrGivesView name={name} nodes={branch} what="branches" Action={SetBranch} /> : null}
      {gives?  <BranchOrGivesView name={name} nodes={gives} what="gives" Action={SetGives} /> : null }
      {exclusive? <ExclusiveView name={name} exclusives={exclusive} /> : null}
    </>
  )
}

const CondArray = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;



@media (max-width: 999px) {
  display: flex;
  flex-direction: column;
}
`

export function CondsAttrsView() {
  const {
    branches: isetBranches,
    gives: isetGives,
    exclusives: isetExclusives,
  } = useAppSelector(selectISetCondsAnyPossible)
  return(
    <div>
      <CondArray className="CondArray">
        {equipParts.map(part => <Partie key={part} part={part} />)}
        {Object.keys(isetBranches).sort().map((key) => 
          <BranchOrGivesView key={key} what="branches" name={key} nodes={isetBranches[key]} Action={SetBranch} />
        )}
        {Object.keys(isetGives).sort().map((key) => 
          <BranchOrGivesView key={key} what="gives" name={key} nodes={isetGives[key]} Action={SetGives} />
        )}
        {Object.keys(isetExclusives).sort().map((isetname) => 
          <ExclusiveView key={isetname} name={isetname} exclusives={isetExclusives[isetname]} />
        )}
      </CondArray>
    </div>
  )
}
