import { createSelector } from "@reduxjs/toolkit"
import { atx, combine } from "../../attrs"
import { RootState } from "../store"
import { getActiveISets, getItem } from "../../items"
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
export function selectCreatureStatAttr(state: RootState) {
  const stat = state.My.CreatureProp.CreatureStat
  return atx("StatAll", stat)
}

/** 
 * 크리쳐를 선택한다. (?!)  
 * 
 * *현재까지는 모든 크리쳐가 레벨업 스탯 빼고는 마을 옵션이 없다. 그래서 모든 크리쳐의 `attrs`는 `{}`일 거임.*
 */
export const selectCreature = createSelector(
  selectItem["크리쳐"],
  selectCreatureStatAttr,
  (creatureSelf, stat) => {
    if (!creatureSelf) return creatureSelf
    const creatureWithstat: DFItem = {
      ...creatureSelf,
      attrs: combine(creatureSelf.attrs, stat)
    }
    return creatureWithstat
  }
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

/**
 * 크리쳐가 출전 중일 때, 크리쳐 + 아티팩트를 선택한다.  
 * 크리쳐가 없으면 모든게 무효화된다.  
 * 
 * TODO: 크리쳐가 있고, 아티팩트가 없을 때 아티팩트 옵션은 포함된다. 아티팩트 빼면 아티팩트 옵션 빠지게 해봐.
 */
export const selectCreatureAndArtis = createSelector(
  selectCreature,
  selectArtifacts,
  selectCreatureSets,
  selectCreaturePropsAttrs,
  (creature, { Red, Green, Blue }, sets, propAttrs) => {
    if (!creature) return []
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
