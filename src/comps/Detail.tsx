import { createSelector } from "@reduxjs/toolkit"
import { useState } from "react"
import { attrDefs } from "../attrs"
import { useAppSelector } from "../feats/hooks"
import { selectDFTitle } from "../feats/selector/avatarSelectors"
import { selectSpells } from "../feats/selector/cracksSelectors"
import { selectArtifacts } from "../feats/selector/creatureSelectors"
import { selectItem, selectEquipPart, selectMagicProps, selectWholeParts, selectISets } from "../feats/selector/equipSelectors"
import { selectMe } from "../feats/selector/selectors"
import { RootState } from "../feats/store"
import { equipParts, isEquip, wholeParts } from "../items"
import { AttrOneItem, SimpleBaseAttrView } from "./widgets/AttrsView"
import { RadioGroup } from "./widgets/Forms"

function selectPart(state: RootState, part: WholePart): AttrSource[] {
  if (isEquip(part)) return selectEquipPart[part](state)
  if (part === "칭호") return selectDFTitle(state)
  if (part === "봉인석") return [selectItem["봉인석"](state), selectMagicProps["봉인석"](state)]
  if (part === "정수") return selectSpells(state)
  if (part === "아티팩트") {
    const { Red, Blue, Green } = selectArtifacts(state)
    return [ Red, Blue, Green ]
  }
  return [selectItem[part](state)]
}



function SourcedAttrOne<T extends keyof BaseAttrs>({ attrKey, value, sources }: { attrKey: T, value: BaseAttrs[T], sources: AttrSource[] }) {
  // const { name: attrName, expression } = attrDefs[attrKey]
  const attrDef = attrDefs[attrKey]

  return(
    <div className="SourceAttrOne">
      <AttrOneItem attrDef={attrDef} value={value} />
    </div>
  )
}

function SourceGroupView() {
  return (
    <>
    </>
  )
}

function AttrGroupView() {
  const equips = useAppSelector(selectWholeParts)
  const equipIset = useAppSelector(selectISets)
  return (
    <>
    </>
  )
}


export function Detail() {
  const attrs = useAppSelector(selectMe)
  const [by, setBy] = useState<"Part" | "Attr">("Part")
  return (
    <div id="Detail">
      <header>
        <h3>자세히 보기</h3>
      </header>
      <div>
        <RadioGroup name="ViewType" groupName="그룹화"
          values={["Part", "Attr"]} value={by} 
          labels={["부위별로 그룹", "효과별로 그룹"]}
          dispatcher={v => setBy(v)}
        />
        {by === "Part"? <SourceGroupView /> : null}
        {by === "Attr"? <AttrGroupView /> : null}
      </div>
    </div>
  )
}
