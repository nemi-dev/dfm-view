import { ErrorBoundary } from "react-error-boundary"
import { SimpleBaseAttrView } from "./AttrsView"

function NodeDetailView({ node }: { node: ConditionalNode }) {
  return <div className="ConditionalNodeView">
    <div className="ConditionPick">{node.pick || "던전에서"}</div>
    <div className="ConditionMeta">
      {node.mt_chance ? <span>{node.mt_chance}% 확률로</span>: null}
      {node.mt_dur? <span>{node.mt_dur}초 동안</span>: null}
      {node.mt_cool? <span>(쿨타임 {node.mt_cool}초)</span>: null}
    </div>
    <div className="ConditionAttr">
      <SimpleBaseAttrView attrs={node.attrs} />
    </div>
  </div>
}

function ConditionalView({ heading, cond }: { heading: string, cond: ConditionalNode[] }) {
  if (!cond?.length) return null
  return <div className="Conditional">
    <div>{heading}</div>
    <div className="ConditionalNodeList">
      {cond.map(node => <NodeDetailView key={node.pick || "던전에서"} node={node} />)}
    </div>
  </div>
}


function Misc({ value = [] }: { value: string[] } ) {
  return (
    <>
      {value.map((v, i) => 
      <div key={`${i}=${v}`} className="AttrItem">
        <span className="KeyName">{v}</span>
      </div>
      )}
    </>
  )
}

export function ItemDetail({ item }: { item: DFItem | null | undefined }) {
  if (!item) return null
  const { name, attrs, branch, gives, exclusive, misc } = item
  return <ErrorBoundary fallbackRender={() => <>아이템 {name}에 문제가 있는 모양입니다..</>}>
    <div className="ItemDatail">
      <div className="Attrs">
        <SimpleBaseAttrView attrs={attrs} />
      </div>
      <ConditionalView cond={branch} heading="조건부 효과" />
      <ConditionalView cond={gives} heading="파티원에게 적용되는 효과" />
      {exclusive?
      <div className="Exclusive">
        <div>선택 효과</div>
        {exclusive.map(excl => <ConditionalView key={excl.pickSet || "default"} heading={excl.pickSet || "던전에서"} cond={excl.children} />)}
      </div>
      : null}
      {misc? <Misc value={misc} /> : null}
    </div>
  </ErrorBoundary>
}

