import { createSelector } from "@reduxjs/toolkit"
import { atx, combine } from "../../attrs"
import { getActiveISets, getArmorBase, getItem, equipParts, isArmor, magicPropsParts, cardableParts, createActiveCondyces, singleItemParts, armorParts } from "../../items"
import { getEmblem } from "../../emblem"
import { getMagicPropsAttrs } from "../../magicProps"
import { selectClassAtype } from "./selfSelectors"

import type { RootState } from "../store"

/** Redux Selector를 무진장 찍어낸다 */
export function Paw<T, P extends string>(func: ($p: P) => (s: RootState) => T, parts: (P[] | readonly P[])): {
  [k in P]: (state: RootState) => T
} {
  const _o: any = {}
  parts.forEach(part => _o[part] = func(part))
  return _o
}


/** 특정 부위에 장착중인 아이템을 선택한다. */
export const selectItem = Paw(part => state => {
  const item = getItem(state.My.Item[part])
  if (!isArmor(part)) return item

  const { level, rarity, material = state.My.Material[part] } = item
  const armorbase = getArmorBase(level, rarity, material, part)
  return { ...item, attrs: combine(item.attrs, armorbase)}

}, singleItemParts)

/** 특정 부위의, 내가 활성화한 조건부 효과를 선택한다. */
export const selectCondyce = Paw(
  part => state => {
    const item = getItem(state.My.Item[part])
    return createActiveCondyces(item, state.My.Choice)
  }, singleItemParts
)

/** 특정 부위의 아이템에 바른 카드를 선택한다 */
export const selectCard = Paw(part => state => getItem(state.My.Card[part]), cardableParts)

/** 특정 부위의 아이템에 박은 엠블렘 스펙을 모두 선택한다 */
export const selectEmblemSpecs = Paw(part => state => state.My.Emblem[part] ?? [], cardableParts)

/** 특정 부위 아이템의 마법봉인 이름을 선택한다 */
export const selectMagicPropNames = Paw(
  part => state => state.My.MagicProps[part],
  magicPropsParts
)

/** 특정 부위의 "내가 선택한" 방어구 재질을 선택한다 (해당 방어구재질이 고정되어있는지 여부는 고려하지 않는다.) */
export const selectCustomMaterial = Paw(
  part => state => state.My.Material[part],
  armorParts
)

/** 특정 부위의 강화보너스 수치(무기는 물/마공, 다른장비는 스탯)를 선택한다 */
export const selectUpgradeValue = Paw(part => state => state.My.Upgrade[part], equipParts)

/** 특정 부위의 강화 효과를 선택한다. */
const selectUpgrade = Paw(part => createSelector(
  selectUpgradeValue[part],
  (value): AttrSource => {
    return {
      name: `강화[${part}]`,
      attrs: atx(part === "무기" ? "Atk" : "StatAll", value)
    }
  }
), equipParts)

/** 특정 부위의 마법봉인 효과를 선택한다. */
export const selectMagicProps = Paw(
  part => createSelector(
    selectClassAtype,
    selectItem[part],
    selectMagicPropNames[part],
    (atype, item, magicProps): AttrSource => {
      if (!item || !(magicProps?.length))
        return { name: `마법봉인[${part}]`, attrs: {} }
      const { level, rarity } = item
      const array = getMagicPropsAttrs(magicProps, atype, level, rarity, part)
      return {
        name: `마법봉인[${part}]`,
        attrs: combine(...array)
      }
    }
  ), magicPropsParts
)


/**
 * 어떤 한 장비 부의의 아이템 옵션, 업그레이드 보너스, 마법봉인, 엠블렘, 카드 옵션을 얻는다.
 * (얘 리턴값에 조건부옵션 카탈로그는 들어있지만, 무엇을 활성화했는지는 알 수 없다.)
 */
export const selectEquipPartTown = Paw(
  part => createSelector(
    selectItem[part],
    selectMagicProps[part],
    selectCard[part],
    selectEmblemSpecs[part],
    selectUpgrade[part],
    (item, magicProps, card, emblems, upgrade): AttrSource[] => {
      if (!item) return []
      return [item, upgrade, card, magicProps, ...emblems.map(getEmblem)]
    }
  )
,equipParts)


/** 10장비의 모든 아이템+강화+카드+엠블렘+마법봉인 효과를 선택한다. (조건부 선택안함) */
const selectWholePartsTown = createSelector(
  equipParts.map(part => selectEquipPartTown[part]),
  (...srcs) => srcs.flat()
)

/** 현재 완성된 장비세트들을 얻는다. (조건부 선택안함) */
export const selectISetsTown = createSelector(
  equipParts.map(part => selectItem[part]),
  getActiveISets
)


/** 현재 착용중인 10부위 모든장비+카드+엠블렘+강화+마법봉인+세트 효과를 모두 선택한다.
 *  **(조건부 효과는 활성여부에 상관없이 모두 배제한다.)** */
export const selectEquipsTown = createSelector(
  selectWholePartsTown,
  selectISetsTown,
  (srcs, isets) => {
    const sourceList: AttrSource[] = [ ...srcs, ...isets ]
    return sourceList
  }
)




/** 어떤 한 장비 부의의 아이템 옵션, 업그레이드 보너스, 마법봉인, 엠블렘, 카드 옵션, 활성화시킨 조건부 옵션을 얻는다. */
export const selectEquipPart = Paw(
  part => createSelector(
    selectEquipPartTown[part],
    selectCondyce[part],
    (srcs, activeOption) => {
      return [...srcs, ...activeOption as AttrSource[]]
    }
  )
,equipParts)



/** 10장비의 모든 아이템+강화+카드+엠블렘+마법봉인+활성화된 조건부옵션 효과를 선택한다. */
export const selectWholeParts = createSelector(
  equipParts.map(part => selectEquipPart[part]),
  (...srcs) => srcs.flat()
)


/** 현재 완성된 세트 및 세트옵 중에서 활성화된 옵션들을 선택한다. */
export const selectISets = createSelector(
  selectISetsTown,
  (state: RootState) => state.My.Choice,
  (isets, choice) => 
  [...isets, ...isets.flatMap(iii => createActiveCondyces(iii, choice))]
)

/** 현재 착용중인 10장비들로부터 오는 모든 아이템+카드+엠블렘+강화+마법봉인 및 세트 효과, 그리고 이들 중에서 내가 체크한 조건부 효과를 싸그리 긁어모은다. */
export const selectEquips = createSelector(
  selectWholeParts,
  selectISets,
  (srcs, isets) => {
    const sourceList: AttrSource[] = [ ...srcs, ...isets ]
    return sourceList
  }
)
