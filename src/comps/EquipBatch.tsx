import { useCallback } from 'react'

import { createSelector } from '@reduxjs/toolkit'

import { useAppDispatch, useAppSelector } from '../feats/hooks'
import {
  selectCustomMaterial2, selectEmblemSpecs, selectUpgradeValue
} from '../feats/selector/itemSelectors'
import { selectClassAtype } from '../feats/selector/baseSelectors'
import {
    SetMyAccessUpgradeAll, SetMyArmorUpgradeAll, SetMyEmblemLevelAll, SetMyMaterialAll,
    PerfectMyMagicPropsEl, PerfectMyMagicProps
} from '../feats/slices/slicev5'
import { accessParts, armorParts, oneEmblemParts } from '../items'
import { LabeledNumberInput, OneClickButtonGroup, RadioGroup } from './widgets/Forms'
import { RootState } from '../feats/store'

const selectMaxArmorUpgradeValue = createSelector(
  armorParts.map(part => (state: RootState, charID: RootState["currentID"]) => selectUpgradeValue(state, charID, part)),
  Math.max
)

const selectMaxAccessUpgradeValue = createSelector(
  accessParts.map(part => (state: RootState, charID: RootState["currentID"]) => selectUpgradeValue(state, charID, part)),
  Math.max
)

const selectColorEmblemLevels = createSelector(
  oneEmblemParts.map(part => (state: RootState, charID: RootState["currentID"]) => selectEmblemSpecs(state, charID, part)),
  (...specMatrix) => {
    return specMatrix.flatMap(specs => specs.map(spec => spec[1])).reduce((p, n) => p < n? n : p, 1)
  }
)

const selectSynchronizedMaterial = createSelector(
  armorParts.map(part => (state: RootState, charID: RootState["currentID"]) => selectCustomMaterial2(state, charID, part)),
  (...mats) => mats.find(m => mats[0] != m) ? null : mats[0]
)

export function EquipBatch() {
  const myAtype = useAppSelector(selectClassAtype)
  
  const dispatch = useAppDispatch()
  const armorUpgradeValue = useAppSelector(state => selectMaxArmorUpgradeValue(state, undefined))
  const accessUpgradeValue = useAppSelector(state => selectMaxAccessUpgradeValue(state, undefined))
  const colorEmblemLevel = useAppSelector(state => selectColorEmblemLevels(state, undefined))
  const mat = useAppSelector(state => selectSynchronizedMaterial(state, undefined))
  const onButtonClick = useCallback((v: string) => {
    switch (v) {
      case "magicPropLeft":
        return dispatch(PerfectMyMagicProps())
      case "magicPropFire": return dispatch(PerfectMyMagicPropsEl("el_fire"))
      case "magicPropIce":  return dispatch(PerfectMyMagicPropsEl("el_ice"))
      case "magicPropLight":return dispatch(PerfectMyMagicPropsEl("el_lght"))
      case "magicPropDark": return dispatch(PerfectMyMagicPropsEl("el_dark"))

    }
  }, [myAtype])
  return (
    <div className="EquipBatch">
      <h4>장비 모두 설정</h4>
      <div className="EquipBatchLayout">
        <LabeledNumberInput label="방어구 강화보너스" value={armorUpgradeValue} onChange={v => {
          dispatch(SetMyArmorUpgradeAll(v))
        }} />
        <LabeledNumberInput label="악세서리 강화보너스" value={accessUpgradeValue} onChange={v => {
          dispatch(SetMyAccessUpgradeAll(v))
        }} />
        <LabeledNumberInput label="고정엠블렘 레벨" value={colorEmblemLevel}
          min={5} max={10} step={1}
          onChange={v => {
          dispatch(SetMyEmblemLevelAll(v))
        }} />
        <RadioGroup name="방어구 재질" values={["천", "가죽", "경갑", "중갑", "판금"]} value={mat}
          dispatcher={v => dispatch(SetMyMaterialAll(v))}
        />
        <OneClickButtonGroup name="완벽한 마봉작" dispatcher={onButtonClick}
          values={["magicPropLeft", "magicPropFire", "magicPropIce", "magicPropLight", "magicPropDark"]}
          labels={["내 스탯", "화속강", "수속강", "명속강", "암속강"]}
        />
      </div>
    </div>
  )
}