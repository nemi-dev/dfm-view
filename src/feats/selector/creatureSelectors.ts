import memoizee from 'memoizee'

import { createSelector } from '@reduxjs/toolkit'

import { atx, combine } from '../../attrs'
import { getActiveISets, getItem } from '../../items'
import { selectDFChar } from './baseSelectors'
import { selectItem2 } from './equipSelectors'

/** 아티팩트 하나를 선택한다 */
export const selectArtifact = memoizee(
  (color: ArtifactColor) => createSelector(selectDFChar, dfchar => getItem(dfchar.items.아티팩트[color])),
{ primitive: true })

/** 레드 아티팩트의 힘/지능 증가 효과를 선택한다. */
export const selectRedArtiProp = createSelector(
  selectDFChar,
  (dfchar): AttrSource => ({
    name: "레드 아티팩트 옵션",
    attrs: atx("Stat", dfchar.creatureValues.Red)
  })
)

/** 블루 아티팩트의 공격력 증가 효과를 선택한다. */
export const selectBlueArtiProp = createSelector(
  selectDFChar,
  (dfchar): AttrSource => ({
    name: "블루 아티팩트 옵션",
    attrs: atx("Atk", dfchar.creatureValues.Blue)
  })
)

/** 그린 아티팩트의 속성강화 효과를 선택한다. */
export const selectGreenArtiProp = createSelector(
  selectDFChar,
  (dfchar): AttrSource => ({
    name: "그린 아티팩트 옵션",
    attrs: atx("El", dfchar.creatureValues.Green)
  })
)

/** 
 * 크리쳐를 선택한다. (?!)  
 */
export const selectCreature = createSelector(
  selectDFChar,
  (state: V5State, charID: V5State["currentID"]) => selectItem2(state, charID, "크리쳐"),
  (dfchar, creatureSelf) => {
    const stat = dfchar.creatureValues.Creature
    const statAttr = atx("StatAll", stat)
    if (!creatureSelf) return creatureSelf
    const creatureWithstat: DFItem = {
      ...creatureSelf,
      attrs: combine(creatureSelf.attrs, statAttr)
    }
    return creatureWithstat
  }
)


/** 크리쳐+아티팩트로 활성화되는 세트를 모두 선택한다. */
export const selectCreatureSets = createSelector(
  (state: V5State, charID: V5State["currentID"]) => selectItem2(state, charID, "크리쳐"),
  selectArtifact("Red"),
  selectArtifact("Green"),
  selectArtifact("Blue"),
  (creature, Red, Green, Blue) => {
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
  selectArtifact("Red"),
  selectArtifact("Green"),
  selectArtifact("Blue"),
  selectRedArtiProp,
  selectGreenArtiProp,
  selectBlueArtiProp,
  selectCreatureSets,
  (creature, Red, Green, Blue, redProp, greenProp, blueProp, sets) => {
    if (!creature) return []
    return [
      creature,
      Red,
      Green,
      Blue,
      redProp,
      greenProp,
      blueProp,
      ...sets,
    ]
  }
)
