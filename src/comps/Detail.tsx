import { useState } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import styled from 'styled-components'

import { AttrDef, attrDefs } from '../attrs'
import { useAppSelector } from '../feats/hooks'
import { selectSources } from '../feats/selector/selectors'
import { CombineItems, Interpolate } from '../items'
import { AttrItem, SimpleBaseAttrView } from './widgets/AttrsView'
import { RadioGroup } from './widgets/Forms'
import { selectChoice } from '../feats/selector/baseSelectors'


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

function PartSourceErrorView({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div>
      <header>
        <h3>아이템 보던 중 오류 생김!!</h3>
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



const PartSourceStyle = styled.div`
  h3 {
    color: white;
    font-size: 1.1rem;
    text-align: center;
    margin: 4px;
  }  
`

function PartSourceView({ source }: { source: AttrSource }) {
  if (!source) return null
  return <PartSourceStyle>
    <h3>{source.name}</h3>
    <div><SimpleBaseAttrView attrs={source.attrs}/></div>
  </PartSourceStyle>
}

const PartSourceContainerStyle = styled.div`
  padding: 8px;
`


function PartSourcesContainerView() {
  const sources = useAppSelector(selectSources)
  return (
    <ErrorBoundary FallbackComponent={PartSourceErrorView}>
      <PartSourceContainerStyle>
      {sources.map((source, index) => 
        <PartSourceView key={index} source={source} />
      )}
      </PartSourceContainerStyle>
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
  const sources = useAppSelector(selectSources)
  const choice = useAppSelector(selectChoice)
  const interpolated = Interpolate(sources, choice)
  const myAttr = CombineItems(sources, choice)
  return (
    <ErrorBoundary FallbackComponent={PartSourceErrorView}>
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
  const [by, setBy] = useState<"Part" | "Attr">("Attr")
  return (
    <div id="Detail">
      <div>
        <RadioGroup name="ViewType" groupName="그룹"
          values={["Attr", "Part"]} value={by} 
          labels={["효과", "아이템"]}
          dispatcher={v => setBy(v)}
        />
        {by === "Part"? <PartSourcesContainerView /> : null}
        {by === "Attr"? <AttrGroupView /> : null}
      </div>
    </div>
  )
}
