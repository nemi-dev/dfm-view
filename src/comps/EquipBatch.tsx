import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { SetArmorUpgradeValueAll, SetAccessUpgradeValueAll, SetMaterialAll, SetPerfectMagicPropsEl, SetPerfectMagicPropsStat, SetColorEmblemLevelAll } from "../feats/slices/equipSlice"
import { RootState } from "../feats/store"
import { armorParts } from "../items"
import { LabeledInput, RadioGroup, OneClickButtonGroup } from "./CommonUI"



function selectArmorUpgradeValues(state: RootState): [boolean, number] {
  const value = Math.max(...armorParts.map(p => state.Equips[p].upgrade))
  const synced = armorParts.every(v => state.Equips[v].upgrade === value)
  return [synced, value]
}

function selectAccessUpgradeValues(state: RootState): [boolean, number] {
  const value = Math.max(...["팔찌", "목걸이", "반지"].map(p => state.Equips[p].upgrade))
  const synced = ["팔찌", "목걸이", "반지"].every(v => state.Equips[v].upgrade === value)
  return [synced, value]
}

function selectColorEmblemLevels(state: RootState) {
  return ([...armorParts, "팔찌", "목걸이", "반지"] as EquipPart[]).flatMap(p => state.Equips[p].emblems.map(spec => spec[1])).reduce((p, n) => p < n ? n : p, 1)
}

function selectSynchronizedMaterial(state: RootState) {
  const mats = armorParts.map(p => state.Equips[p].material)
  const mat = mats[0]
  if (mats.find(m => mat != m)) return null
  return mat
}

export function EquipBatch() {
  const myAtype = useAppSelector(state => state.Profile.atype)
  
  const onButtonClick = useCallback((v: string) => {
    switch (v) {
      case "magicPropLeft":
        switch (myAtype) {
          case "Physc": return dispatch(SetPerfectMagicPropsStat("strn"))
          case "Magic": return dispatch(SetPerfectMagicPropsStat("intl"))
        }
      case "magicPropFire": return dispatch(SetPerfectMagicPropsEl("el_fire"))
      case "magicPropIce":  return dispatch(SetPerfectMagicPropsEl("el_ice"))
      case "magicPropLight":return dispatch(SetPerfectMagicPropsEl("el_lght"))
      case "magicPropDark": return dispatch(SetPerfectMagicPropsEl("el_dark"))

    }
  }, [myAtype])
  const dispatch = useAppDispatch()
  const [armorUpgradeSynced, armorUpgradeValue] = useAppSelector(selectArmorUpgradeValues)
  const [accessUpgradeSynced, accessUpgradeValue] = useAppSelector(selectAccessUpgradeValues)
  const colorEmblemLevel = useAppSelector(selectColorEmblemLevels)
  const mat = useAppSelector(selectSynchronizedMaterial)
  return (
    <div className="EquipBatch">
      <h4>장비 모두 설정</h4>
      <div className="EquipBatchLayout">
        <LabeledInput label="방어구 강화보너스" value={armorUpgradeValue} onChange={v => {
          dispatch(SetArmorUpgradeValueAll(v))
        }} />
        <LabeledInput label="악세서리 강화보너스" value={accessUpgradeValue} onChange={v => {
          dispatch(SetAccessUpgradeValueAll(v))
        }} />
        <LabeledInput label="고정엠블렘 레벨" value={colorEmblemLevel}
          min={5} max={10} step={1}
          onChange={v => {
          dispatch(SetColorEmblemLevelAll(v as EmblemLevel))
        }} />
        <RadioGroup name="방어구 재질" values={["천", "가죽", "경갑", "중갑", "판금"]} value={mat}
          dispatcher={v => dispatch(SetMaterialAll(v))}
        />
        <OneClickButtonGroup name="완벽한 마봉작" groupName="완벽한 마봉작" dispatcher={onButtonClick}
          values={["magicPropLeft", "magicPropFire", "magicPropIce", "magicPropLight", "magicPropDark"]}
          labels={["내 스탯", "화속강", "수속강", "명속강", "암속강"]}
        />
      </div>
    </div>
  )
}