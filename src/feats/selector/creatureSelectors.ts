import { createSelector } from "@reduxjs/toolkit"
import { atx } from "../../attrs"
import { RootState } from "../store"
import { getActiveISets, getItem, createActiveCondyces } from "../../items"
import memoizee from "memoizee"
import { selectItem } from "./equipSelectors"

/** 아티팩트 하나를 선택한다 */
export const selectArtifact = memoizee(
  (color: "Red" | "Green" | "Blue") => (state: RootState) => getItem(state.My.Item["아티팩트"][color]),
{ primitive: true })

/** 레드 아티팩트의 힘/지능 증가 효과를 선택한다. */
export function selectRedArtiProp(state: RootState): AttrSource {
  return {
    name: "레드 아티팩트 옵션",
    attrs: atx("Stat", state.My.CreatureProp.RedPropsValue)
  }
}

/** 블루 아티팩트의 공격력 증가 효과를 선택한다. */
export function selectBlueArtiProp(state: RootState): AttrSource {
  return {
    name: "블루 아티팩트 옵션",
    attrs: atx("Atk", state.My.CreatureProp.BluePropsValue)
  }
}

/** 그린 아티팩트의 속성강화 효과를 선택한다. */
export function selectGreenArtiProp(state: RootState): AttrSource {
  return {
    name: "그린 아티팩트 옵션",
    attrs: atx("El", state.My.CreatureProp.GreenPropsEl)
  }
}

/** 지금 장착 중인 아티팩트를 모두 선택한다 */
export function selectArtifacts(state: RootState) {
  const { Red: redName, Green: greenName, Blue: blueName } = state.My.Item["아티팩트"]
  return {
    Red: getItem(redName), Green: getItem(greenName), Blue: getItem(blueName)
  }
}

/** 크리쳐 스탯 효과를 선택한다. */
export function selectCreatureStat(state: RootState) {
  const stat = state.My.CreatureProp.CreatureStat
  return atx("StatAll", stat)
}

/** 내가 활성화한 크리쳐 스킬 효과를 선택한다. (마을에서 적용안됨) */
export const selectCreatureSkill = createSelector(
  selectItem["크리쳐"],
  (state: RootState) => state.My.Choice,
  (creature, choice) => createActiveCondyces(creature, choice)
)

/** 크리쳐 스탯 효과 + 아티팩트 옵션 효과를 선택한다 (이들은 마을에서 적용된다) */
export function selectCreaturePropsAttrs(state: RootState): AttrSource {
  const
    stat_arti = state.My.CreatureProp.RedPropsValue,
    atk = state.My.CreatureProp.BluePropsValue,
    el_all = state.My.CreatureProp.GreenPropsEl
  return {
    name: "아티팩트 옵션(이빨)",
    attrs: {
      strn: stat_arti,
      intl: stat_arti,
      ...atx("Atk", atk),
      ...atx("El", el_all)
    }
  }
}

/** 크리쳐+아티팩트로 활성화되는 세트를 모두 선택한다. */
export const selectCreatureSets = createSelector(
  selectItem["크리쳐"],
  selectArtifacts,
  (creature, { Red, Green, Blue }) => {
    const isets = getActiveISets(creature, Red, Green, Blue)
    return isets
  }
)

/** 크리쳐 효과 + 크리쳐 스탯 효과 + 아티팩트 효과를 선택한다 (마을에서 적용되는 옵션들) */
export const selectCreatureAndArtisTown = createSelector(
  selectItem["크리쳐"],
  selectArtifacts,
  selectCreatureSets,
  selectCreaturePropsAttrs,
  (creature, { Red, Green, Blue }, sets, propAttrs) => {
    return [
      creature,
      Red,
      Green,
      Blue,
      ...sets,
      propAttrs
    ]
  }
)

/** 크리쳐 + 아티팩트 + 크리쳐 세트에서 "내가 체크한" 조건부 효과들을 모두 선택한다. */
export const selectActiveCreatureCondyces = createSelector(
  selectItem["크리쳐"],
  selectArtifacts,
  selectCreatureSets,
  (state: RootState) => state.My.Choice,
  (creature, { Red, Green, Blue }, sets, choices) => {
    return [creature, Red, Green, Blue, ...sets].flatMap(iii => createActiveCondyces(iii, choices))
  }
)

/** 크리쳐 + 아티팩트 + 크리쳐 세트 + 이들 중에서 활성화된 조건부 옵션 효과들을 모두 선택한다. */
export const selectCreatureAndArtifacts = createSelector(
  selectCreatureAndArtisTown,
  selectActiveCreatureCondyces,
  (attrs, nodes) => {
    return [
      ...attrs,
      ...nodes
    ]
  }
)
