import { useState } from "react"
import { AttrDef, attrDefs } from "../attrs"
import { useAppSelector } from "../feats/hooks"
import { selectDFTitleTown } from "../feats/selector/avatarSelectors"
import { selectSpells } from "../feats/selector/cracksSelectors"
import { selectArtifacts } from "../feats/selector/creatureSelectors"
import { selectItem, selectMagicProps, selectEquipPart } from "../feats/selector/equipSelectors"
import { selectMe, selectMyAttr } from "../feats/selector/selectors"
import { RootState } from "../feats/store"
import { CombineItems, Interpolate, isEquip } from "../items"
import { AttrItem, SimpleBaseAttrView } from "./widgets/AttrsView"
import { RadioGroup } from "./widgets/Forms"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import styled from "styled-components"

function selectPart(state: RootState, part: WholePart): AttrSource[] {
  if (isEquip(part)) return selectEquipPart[part](state)
  if (part === "칭호") return selectDFTitleTown(state)
  if (part === "봉인석") return [selectItem["봉인석"](state), selectMagicProps["봉인석"](state)]
  if (part === "정수") return selectSpells(state)
  if (part === "아티팩트") {
    const { Red, Blue, Green } = selectArtifacts(state)
    return [ Red, Blue, Green ]
  }
  return [selectItem[part](state)]
}

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  box-sizing: border-box;
  padding-inline: 2rem;
  @media screen and (max-width: 999px) {
    .RowName {
      font-size: 0.8rem;
    }
  }
`

function SourceAttrSel({ attrDef, source }: { attrDef: AttrDef, source: AttrSource }) {
  const value = source.attrs?.[attrDef.key]
  if (!value) return null
  return <Row>
    <span className="RowName">{source.name}</span>
    <span><AttrItem attrDef={attrDef} value={value} useName={false} /></span>
  </Row>
}



function SourcedAttrOne({ attrDef, value, sources }: { attrDef: AttrDef, value: any, sources: AttrSource[] }) {
  const values_t: any[] = sources.filter(s => s != null).map(s => s.attrs?.[attrDef.key]).filter(s => s != null)
  return(
    <details className="SourcedAttrOne">
      <summary className="Hovery">
        <AttrItem attrDef={attrDef} value={value} />
      </summary>
      {sources.map((source, index) => {
        if (!source) return null
        return <SourceAttrSel key={index} attrDef={attrDef} source={source}/>
      })}
    </details>
  )
}

function SourceGroupErrorView({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div>
      <header>
        <h3>아구구!</h3>
        <div>아이템 어딘가가 고장난 것 같아요! 어서 개발자에게 알려주세요!!</div>
      </header>
      <div>
        <h4>{error.name}</h4>
        <div>
          <pre>{error.message}</pre>
          <pre>{error.stack}</pre>
        </div>
      </div>
      <div>
        <button onClick={resetErrorBoundary}>다시 시도</button>
      </div>
    </div>
  )
}

function SourceGroupView() {
  const sources = useAppSelector(selectMe)
  return (
    <ErrorBoundary FallbackComponent={SourceGroupErrorView}>
      {sources.map((source, index) => {
        if (source == null) return null
        return <div key={index}>
          <div>{source.name}</div>
          <div><SimpleBaseAttrView attrs={source.attrs}/></div>
        </div>
      })}
    </ErrorBoundary>
  )
}

const AttrGroupStyle = styled.div`
  details {
    margin-block: 4px;
  }
  summary {
    cursor: pointer;
  }
  summary .AttrItem {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding-inline: 3rem;
  }
`

function AttrGroupView() {
  const sources = useAppSelector(selectMe)
  const choice = useAppSelector(state => state.My.Choice)
  const interpolated = Interpolate(sources, choice)
  const myAttr = CombineItems(sources, choice)
  return (
    <ErrorBoundary FallbackComponent={SourceGroupErrorView}>
      <AttrGroupStyle>
        {attrDefs.array.map(attrDef => {
          const value = myAttr[attrDef.key]
          if (!value) return null
          return <SourcedAttrOne key={attrDef.key} value={value} attrDef={attrDef} sources={interpolated} />
        })}
      </AttrGroupStyle>
    </ErrorBoundary>
  )
}

export function Detail() {
  const attrs = useAppSelector(selectMyAttr)
  const [by, setBy] = useState<"Part" | "Attr">("Part")
  return (
    <div id="Detail">
      <div>
        <RadioGroup name="ViewType" groupName="그룹"
          values={["Part", "Attr"]} value={by} 
          labels={["아이템", "효과"]}
          dispatcher={v => setBy(v)}
        />
        {by === "Part"? <SourceGroupView /> : null}
        {by === "Attr"? <AttrGroupView /> : null}
      </div>
    </div>
  )
}
