import { useState } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import styled from 'styled-components'

import { AttrDef, attrDefs } from '../attrs'
import { useAppSelector } from '../feats/hooks'
import { expandSource, selectActiveISets, selectExpandedSources, selectPartSource, selectTonics, selectWearAvatarSource } from '../feats/selector/selectors'
import { CombineItems, createActiveCondyces, expandChoice, partsWithMainItem } from '../items'
import { AttrItem, SimpleBaseAttrView } from './widgets/AttrsView'
import { RadioGroup } from './widgets/Forms'
import { selectAchBonus, selectCaliSource, selectChoice, selectDFClass } from '../feats/selector/baseSelectors'
import { selectGuilds } from '../feats/selector/guildSelectors'


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



const OneSourceStyle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  h3 {
    margin: 0;
    color: white;
    font-size: 1rem;
    text-align: start;
    flex-basis: 200px;

    position: sticky;
    top: 45px;
  }
  .AttrsView {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .AttrItem {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding-inline: 3rem;
  }
`

function OneSourceView({ source }: { source: AttrSource }) {
  if (!source) return null
  return <OneSourceStyle>
    <h3>{source.name}</h3>
    <div className="AttrsView"><SimpleBaseAttrView attrs={source.attrs}/></div>
  </OneSourceStyle>
}

function OneISetView({ source }: { source: ComplexAttrSource }) {
  if (!source) return null
  const choice = useAppSelector(state => selectChoice(state, undefined))
  const condyce = createActiveCondyces(source, choice)
  return (<>
    {/* <OneSourceStyle>
      <h3>{source.name}</h3>
      <div className="AttrsView"><SimpleBaseAttrView attrs={source.attrs}/></div>
    </OneSourceStyle> */}
    <OneSourceView source={source} />
    {condyce.map(s => 
      <OneSourceView key={s.name} source={s} />
    )}
  </>
  )
}

const PartSourceStyle = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px;
`

function PartSourceView({ part }: { part: EquipPart | "칭호" | "오라" | "무기아바타" | "크리쳐" | "봉인석" }) {
  const partSource = useAppSelector(state => selectPartSource(state, undefined, part))
  const choice = useAppSelector(state => selectChoice(state, undefined))
  const condyce = createActiveCondyces(partSource.item, choice)
  const expanded = expandSource(partSource)//.concat(condyce)
  expanded.splice(1, 0, ...condyce)
  return (
    <>
      <div className="SourceType">
        <span className="StickyName">
        {partSource.type}
        </span>
      </div>
      <div className="SourceZone">
        {expanded.map((s, index) => 
          <OneSourceView key={index} source={s} />
        )}
      </div>
    </>
  )
}



const PartSourceContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;

  .SourceType {

    font-size: 1.2rem;
    font-weight: 900;
    color: var(--color-epic);

    .StickyName {
      position: sticky;
      top: 45px;
    }
  }

  .SourceZone {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`

function PartSourcesContainerView() {
  const dfclass = useAppSelector(selectDFClass)
  const achievements = useAppSelector(selectAchBonus)
  const wearAvatars = useAppSelector(selectWearAvatarSource)
  const isets = useAppSelector(selectActiveISets)
  const tonic = useAppSelector(selectTonics)
  const guild = useAppSelector(selectGuilds)
  const cal = useAppSelector(selectCaliSource)

  return (
    <ErrorBoundary FallbackComponent={PartSourceErrorView}>
      <PartSourceContainerStyle>
      <OneSourceView source={dfclass} />
      <OneSourceView source={achievements} />
      <PartSourceStyle>
      {
        partsWithMainItem.map(part => 
          <PartSourceView key={part} part={part} />
        )
      }
      </PartSourceStyle>
      {
        isets.map((so, index) => 
          <OneISetView key={so.name} source={so} />
        )
      }
      {
        wearAvatars.map((so, index) => 
          <OneSourceView key={index} source={so} />
        )
      }
      <OneSourceView source={tonic} />
      <OneSourceView source={guild} />
      <OneSourceView source={cal} />
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
  const dfclass = useAppSelector(selectDFClass)
  const wearAvatars = useAppSelector(selectWearAvatarSource)
  const tonic = useAppSelector(selectTonics)
  const sources = useAppSelector(selectExpandedSources)
  const choice = useAppSelector(selectChoice)
  const interpolated = expandChoice(sources, choice)
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
