import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { SimpleBaseAttrView } from "./AttrsView"
import { SetBranch, SetExclusive, SetGives } from "../feats/slices/equipSlice"
import { useEffect } from "react"
import { selectISetConditionalsAll } from "../selectors"

interface Named {
  name: string
  showName?: boolean
}

function BranchLeafView({ branchItemKey, attrs }: { branchItemKey: string, attrs: WhenCombinedAttrs }) {
  const checked = useAppSelector(state => state.Switch.branches[branchItemKey] ?? false)
  const dispatch = useAppDispatch()
  return (
    <span>
      <input type="checkbox" checked={checked} id={branchItemKey}
        onChange={ev => dispatch(SetBranch([branchItemKey, ev.target.checked]))} />
      <label htmlFor={branchItemKey}>{attrs.when}</label>
      <SimpleBaseAttrView attrs={attrs} />
    </span>
  )
}

interface BrachViewProps extends Named {
  branches: WhenCombinedAttrs[]
}

export function BranchView({ name, branches, showName = false }: BrachViewProps) {
  return (
    <div>
      {showName? <div>{name}</div> : null}
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

export function GivesView({ name, attrs, showName = false }: GivesViewProps) {
  const id = `${name}::${attrs.when ?? "default"}`
  const pureChecked = useAppSelector(state => state.Switch.gives[id])
  const checked = pureChecked ?? false
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!attrs.when && (pureChecked == undefined)) dispatch(SetGives([id, true]))
  }, [])
  return (
    <div>
      {showName? <div>{name}</div> : null}
      <div>
        <input type="checkbox" checked={checked} id={id}
        onChange={ev => dispatch(SetGives([id, ev.target.checked]))} />
        <label htmlFor={id}>모든 파티원에게: {attrs.when ?? "항상 적용"}</label>
        <SimpleBaseAttrView attrs={attrs} />
      </div>
    </div>
  )
}

function ExclusiveRadioButtonView({ prefix, attrs }: { prefix: string, attrs: BaseAttrs }) {
  const dispatch = useAppDispatch()
  const checked = useAppSelector(state => state.Switch.exclusives[prefix] == attrs.name)
  const key = `${prefix}::${attrs.name}`
  return <span>
    <input type="radio" id={key} name={prefix} checked={checked} onChange={ev => dispatch(SetExclusive([prefix, attrs.name]))} />
    <label htmlFor={key}>{attrs.name}</label>
  </span>
}

function ExclusiveOneBranchView({ prefix, node }: { prefix: string, node: ExclusiveGroup }) {
  return <div>{node.label}
    {node.children.map((attrs) => <ExclusiveRadioButtonView key={`${prefix}::${attrs.name}`} prefix={prefix} attrs={attrs} />)}
  </div>
}

interface ExclusiveViewProps extends Named {
  exclusives: ExclusiveGroup[]
}
export function ExclusiveView({ name, exclusives, showName = false }: ExclusiveViewProps) {
  return (
    <div>
      {showName? <div>{name}</div> : null}
      {exclusives.map((node) => {
        const prefix = `${name}::${node.name}`
        return <ExclusiveOneBranchView key={prefix} prefix={prefix} node={node} />
      })}
    </div>
  )
}


export function ISetOptionalAttrsView() {
  const { branches, exclusives, gives } = useAppSelector(selectISetConditionalsAll)
  return(
    <div className="ISetOptionalAttrsView">
      <h4>조건부 세트 효과</h4>
      {Object.keys(branches).sort().map((key) => 
        <BranchView key={key} name={key} branches={branches[key]} showName={true} />
      )}
      {Object.keys(exclusives).sort().map((isetname) => 
        <ExclusiveView key={isetname} name={isetname} exclusives={exclusives[isetname]} showName={true} />
      )}
      {Object.keys(gives).sort().map((key) => 
        <GivesView key={key} name={key} attrs={gives[key]} showName={true} />
      )}
    </div>
  )
}