import { createSelector } from "@reduxjs/toolkit"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { selectSpecifiedAtype } from "../feats/selector/selfSelectors"
import { selectCustomMaterial, selectEmblemSpecs, selectUpgrade } from "../feats/selector/equipSelectors"
import { SetPerfectMagicPropsStat, SetPerfectMagicPropsEl, SetColorEmblemLevelAll, SetMaterialAll, SetArmorUpgradeAll, SetAccessUpgradeAll } from "../feats/slices/itemSlice"
import { accessParts, armorParts, oneEmblemParts } from "../items"
import { LabeledNumberInput, RadioGroup, OneClickButtonGroup } from "./widgets/Forms"



const selectMaxArmorUpgradeValue = createSelector(
  armorParts.map(part => selectUpgrade[part]),
  Math.max
)

const selectMaxAccessUpgradeValue = createSelector(
  accessParts.map(part => selectUpgrade[part]),
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
  const myAtype = useAppSelector(selectSpecifiedAtype)
  
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
  const dispatch = useAppDispatch()
  const armorUpgradeValue = useAppSelector(selectMaxArmorUpgradeValue)
  const accessUpgradeValue = useAppSelector(selectMaxAccessUpgradeValue)
  const colorEmblemLevel = useAppSelector(selectColorEmblemLevels)
  const mat = useAppSelector(selectSynchronizedMaterial)
  return (
    <div className="EquipBatch">
      <h4>?????? ?????? ??????</h4>
      <div className="EquipBatchLayout">
        <LabeledNumberInput label="????????? ???????????????" value={armorUpgradeValue} onChange={v => {
          dispatch(SetArmorUpgradeAll(v))
        }} />
        <LabeledNumberInput label="???????????? ???????????????" value={accessUpgradeValue} onChange={v => {
          dispatch(SetAccessUpgradeAll(v))
        }} />
        <LabeledNumberInput label="??????????????? ??????" value={colorEmblemLevel}
          min={5} max={10} step={1}
          onChange={v => {
          dispatch(SetColorEmblemLevelAll(v))
        }} />
        <RadioGroup name="????????? ??????" values={["???", "??????", "??????", "??????", "??????"]} value={mat}
          dispatcher={v => dispatch(SetMaterialAll(v))}
        />
        <OneClickButtonGroup name="????????? ?????????" dispatcher={onButtonClick}
          values={["magicPropLeft", "magicPropFire", "magicPropIce", "magicPropLight", "magicPropDark"]}
          labels={["??? ??????", "?????????", "?????????", "?????????", "?????????"]}
        />
      </div>
    </div>
  )
}