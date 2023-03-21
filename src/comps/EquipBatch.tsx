import { createSelector } from "@reduxjs/toolkit"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { selectClassAtype } from "../feats/selector/selfSelectors"
import { selectCustomMaterial, selectEmblemSpecs, selectUpgradeValue } from "../feats/selector/equipSelectors"
import { SetPerfectMagicPropsStat, SetPerfectMagicPropsEl, SetColorEmblemLevelAll, SetMaterialAll, SetArmorUpgradeAll, SetAccessUpgradeAll } from "../feats/slices/itemSlice"
import { accessParts, armorParts, oneEmblemParts } from "../items"
import { LabeledNumberInput, RadioGroup, OneClickButtonGroup } from "./widgets/Forms"



const selectMaxArmorUpgradeValue = createSelector(
  armorParts.map(part => selectUpgradeValue[part]),
  Math.max
)

const selectMaxAccessUpgradeValue = createSelector(
  accessParts.map(part => selectUpgradeValue[part]),
  Math.max
)

const selectColorEmblemLevels = createSelector(
  oneEmblemParts.map(part => selectEmblemSpecs[part]),
  (...specMatrix) => {
    return specMatrix.flatMap(specs => specs.map(spec => spec[1])).reduce((p, n) => p < n? n : p, 1)
  }
)

const selectSynchronizedMaterial = createSelector(
  armorParts.map(part => selectCustomMaterial[part]),
  (...mats) => mats.find(m => mats[0] != m) ? null : mats[0]
)

export function EquipBatch() {
  const myAtype = useAppSelector(selectClassAtype)
  

  const dispatch = useAppDispatch()
  const armorUpgradeValue = useAppSelector(selectMaxArmorUpgradeValue)
  const accessUpgradeValue = useAppSelector(selectMaxAccessUpgradeValue)
  const colorEmblemLevel = useAppSelector(selectColorEmblemLevels)
  const mat = useAppSelector(selectSynchronizedMaterial)
  const onButtonClick = useCallback((v: string) => {
    switch (v) {
      case "magicPropLeft":
        return dispatch(SetPerfectMagicPropsStat())
      case "magicPropFire": return dispatch(SetPerfectMagicPropsEl("el_fire"))
      case "magicPropIce":  return dispatch(SetPerfectMagicPropsEl("el_ice"))
      case "magicPropLight":return dispatch(SetPerfectMagicPropsEl("el_lght"))
      case "magicPropDark": return dispatch(SetPerfectMagicPropsEl("el_dark"))

    }
  }, [myAtype])
  return (
    <div className="EquipBatch">
      <h4>장비 모두 설정</h4>
      <div className="EquipBatchLayout">
        <LabeledNumberInput label="방어구 강화보너스" value={armorUpgradeValue} onChange={v => {
          dispatch(SetArmorUpgradeAll(v))
        }} />
        <LabeledNumberInput label="악세서리 강화보너스" value={accessUpgradeValue} onChange={v => {
          dispatch(SetAccessUpgradeAll(v))
        }} />
        <LabeledNumberInput label="고정엠블렘 레벨" value={colorEmblemLevel}
          min={5} max={10} step={1}
          onChange={v => {
          dispatch(SetColorEmblemLevelAll(v))
        }} />
        <RadioGroup name="방어구 재질" values={["천", "가죽", "경갑", "중갑", "판금"]} value={mat}
          dispatcher={v => dispatch(SetMaterialAll(v))}
        />
        <OneClickButtonGroup name="완벽한 마봉작" dispatcher={onButtonClick}
          values={["magicPropLeft", "magicPropFire", "magicPropIce", "magicPropLight", "magicPropDark"]}
          labels={["내 스탯", "화속강", "수속강", "명속강", "암속강"]}
        />
      </div>
    </div>
  )
}