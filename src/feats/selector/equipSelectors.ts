import { createSelector } from "@reduxjs/toolkit"
import { atx, combine } from "../../attrs"
import { getActiveISets, getArmorBase, getItem, equipParts, isArmorPart, magicPropsParts, cardableParts, getActiveCondyces } from "../../items"
import { getEmblem } from "../../emblem"
import { getMagicPropsAttrs } from "../../magicProps"
import { selectAtype } from "./selfSelectors"

import type { RootState } from "../store"

/** Redux Selector를 무진장 찍어낸다 */
export function Noot2<T, P extends WholePart>(func: ($p: P) => (s: RootState) => T, parts: (P[] | readonly P[])): {
  [k in P]: (state: RootState) => T
} {
  const _o: any = {}
  parts.forEach(part => _o[part] = func(part))
  return _o
}


/** 특정 부위에 장착중인 아이템을 선택한다 */
export const selectItem = Noot2(part => state => getItem(state.Item[part]), [...equipParts, "칭호", "오라", "무기아바타", "봉인석", "크리쳐"])

/** 특정 부위의 아이템에 바른 카드를 선택한다 */
export const selectCard = Noot2(part => state => (getItem(state.Card[part])), cardableParts)

/** 특정 부위의 아이템에 박은 엠블렘 스펙을 모두 선택한다 */
export const selectEmblemSpecs = Noot2(part => state => state.Emblem[part], cardableParts)

/** 특정 부위 아이템의 마법봉인 이름을 선택한다 */
export const selectMagicPropNames = Noot2(
  part => state => state.MagicProps[part],
  magicPropsParts
)

/** 특정 부위의 "내가 선택한" 방어구 재질을 선택한다 */
export const selectCustomMaterial = Noot2(
  part => state => isArmorPart(part) ? state.Material[part] : null,
  equipParts
)

/** 특정 부위의 강화보너스 수치(무기는 물/마공, 다른장비는 스탯)를 선택한다 */
export const selectUpgrade = Noot2(part => state => state.Upgrade[part], equipParts)

/** 특정 부위의 방어구 재질 아이템을 선택한다 */
export const selectArmorBase = Noot2(
  part => createSelector(
    selectItem[part],
    selectCustomMaterial[part],
    (item, customMaterial) => {
      if (!isArmorPart(part))
        return {} as DFItem
      const { level, rarity, material = customMaterial } = item
      return getArmorBase(level, rarity, material, part)
    }
  ), equipParts
)

/** 특정 부위의 마법봉인 효과를 선택한다. */
export const selectMagicProps = Noot2(
  part => createSelector(
    selectAtype,
    selectItem[part],
    selectMagicPropNames[part],
    (atype, item, magicProps) => {
      if (!item || !(magicProps?.length))
        return {}
      const { level, rarity } = item
      const array = getMagicPropsAttrs(magicProps, atype, level, rarity, part)
      return combine(...array)
    }
  ), magicPropsParts
)

/** 현재 착용중인 어느 한 부위의 장비에서 내가 체크한 조건부 노드들을 얻는다. */
export const selectActiveConds = Noot2(
  part => state => {
    const item = getItem(state.Item[part])
    return getActiveCondyces(item, state.Choice)
  }, equipParts
)

/**
 * 어떤 한 장비 부의의 아이템 옵션, 업그레이드 보너스, 마법봉인, 엠블렘, 카드 옵션을 얻는다.
 * (조건부 옵션은 완전히 배제한다.)
 */
export const selectPartAttrsNoCond = Noot2(
  part => createSelector(
    selectItem[part],
    selectMagicProps[part],
    selectCard[part],
    selectEmblemSpecs[part],
    selectArmorBase[part],
    selectUpgrade[part],
    (item, magicProps, card, emblems, armorbase, upgrade) => {
      const upgradeAttr = atx(part === "무기" ? "Atk" : "Stat", upgrade)
      return combine(item.attrs, armorbase.attrs, upgradeAttr, magicProps, ...emblems.map(getEmblem), card?.attrs)
    }
  ), equipParts
)

/** 어떤 한 장비 부의의 아이템 옵션, 업그레이드 보너스, 마법봉인, 엠블렘, 카드 옵션, 활성화시킨 조건부 옵션을 얻는다. */
export const selectPartAttrs = Noot2(
  part => createSelector(
    selectPartAttrsNoCond[part],
    selectActiveConds[part],
    (attrs, activeOption) => {
      return combine(attrs, ...activeOption.map(n => n.attrs))
    }), equipParts
)


/** 10장비의 모든 아이템+카드+엠블렘+마법봉인+강화 효과를 선택한다.
 * **(조건부 효과는 활성여부에 상관없이 모두 배제한다.)** */
const selectWholePartAttrsNoCond = createSelector(
  equipParts.map(part => selectPartAttrsNoCond[part]),
  combine
)

/** 10장비의 모든 아이템+카드+엠블렘+마법봉인+강화+활성화된 조건부옵션 효과를 선택한다. */
export const selectWholePartAttrs = createSelector(
  equipParts.map(part => selectPartAttrs[part]),
  combine
)

/** 현재 착용한 장비들로부터 활성화되는 모든 세트를 얻는다. */
export const selectISets = createSelector(
  equipParts.map(part => selectItem[part]),
  (...items) => {
    return getActiveISets(...items)
  }
)

/** 현재 착용중인 10부위 모든장비+카드+엠블렘+강화+마법봉인+세트 효과를 모두 선택한다.
 *  **(조건부 효과는 활성여부에 상관없이 모두 배제한다.)** */
export const selectEquipsNoConds = createSelector(
  selectWholePartAttrsNoCond,
  selectISets,
  (attrs, isets) => {
    const isetattrs = isets.map(ii => ii.attrs)
    return combine(attrs, ...isetattrs)
  }
)

/** 현재 착용중인 10장비들로부터 오는 모든 아이템+카드+엠블렘+강화+마법봉인 및 세트 효과, 그리고 이들 중에서 내가 체크한 조건부 효과를 싸그리 긁어모은다. */
export function selectEquips(state: RootState) {

  const isets = selectISets(state)
  const isetattrs = isets.map(ii => ii.attrs)
  const J = isets.flatMap(ii => getActiveCondyces(ii, state.Choice).map(n => n.attrs))

  return combine(
    ...equipParts.map(part => selectPartAttrs[part](state)),
    ...isetattrs,
    ...J
  )
}
