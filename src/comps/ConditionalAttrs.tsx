import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { SimpleBaseAttrView } from "./AttrsView"
import { SetBranch, SetExclusive, SetGives } from "../feats/slices/equipSlice"
import { useEffect } from "react"
import { selectISetConditionalsAll, selectItem } from "../feats/selectors"
import { Checkie, RadioGroup } from "./widgets/Forms"
import { equipParts } from "../items"
import styled from "styled-components"

interface Named {
  name: string
}

function BranchLeafView({ branchItemKey, attrs }: { branchItemKey: string, attrs: WhenCombinedAttrs }) {
  const checked = useAppSelector(state => state.Switch.branches[branchItemKey] ?? false)
  const dispatch = useAppDispatch()
  return (
    <Checkie checked={checked} label={<>{attrs.when}<SimpleBaseAttrView attrs={attrs} /></>} onChange={b => dispatch(SetBranch([branchItemKey, b]))} />
  )
}

interface BrachViewProps extends Named {
  branches: WhenCombinedAttrs[]
}

export function BranchView({ name, branches }: BrachViewProps) {
  return (
    <div className="CondOne">
      <div className="CondContainerName">{name}</div>
      {branches.map((attrs) => {
        const key = `${name}::${attrs.when}`
        return <BranchLeafView key={key} branchItemKey={key} attrs={attrs} />
      })}
    </div>
  )
}

interface GivesViewProps extends Named {
  attrs: WhenCombinedAttrs
}

export function GivesView({ name, attrs }: GivesViewProps) {
  const id = `${name}::${attrs.when ?? "default"}`
  const pureChecked = useAppSelector(state => state.Switch.gives[id])
  const checked = pureChecked ?? false
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!attrs.when && (pureChecked == undefined)) dispatch(SetGives([id, true]))
  }, [])
  return (
    <div className="CondOne">
      <div className="CondContainerName">{name}</div>
      <Checkie checked={checked} onChange={b => dispatch(SetGives([id, b]))}
      label={<>{attrs.when ?? ""}<SimpleBaseAttrView attrs={attrs} /></>} />
    </div>
  )
}

function ExclusiveOneBranchView({ prefix, node }: { prefix: string, node: ExclusiveGroup }) {
  const values = node.children.map(n => n.name)
  const value = useAppSelector(state => state.Switch.exclusives[prefix])
  const dispatch = useAppDispatch()
  return <RadioGroup groupName={node.label} name={prefix} values={values} value={value}
    dispatcher={val => dispatch(SetExclusive([prefix, val]))}
  />
}

interface ExclusiveViewProps extends Named {
  exclusives: ExclusiveGroup[]
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
      {branch? <BranchView name={name} branches={branch} /> : null}
      {exclusive? <ExclusiveView name={name} exclusives={exclusive} /> : null}
      {gives? <GivesView name={name} attrs={gives} /> : null }
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
  const { branches, exclusives, gives } = useAppSelector(selectISetConditionalsAll)
  return(
    <div className="OptionalAttrsView">
      <CondArray className="CondArray">
        {equipParts.map(part => <Partie key={part} part={part} />)}
        {Object.keys(branches).sort().map((key) => 
          <BranchView key={key} name={key} branches={branches[key]} />
        )}
        {Object.keys(exclusives).sort().map((isetname) => 
          <ExclusiveView key={isetname} name={isetname} exclusives={exclusives[isetname]} />
        )}
        {Object.keys(gives).sort().map((key) => 
          <GivesView key={key} name={key} attrs={gives[key]} />
        )}
      </CondArray>
    </div>
  )
}