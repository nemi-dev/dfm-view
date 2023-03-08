import { useId } from 'react'
import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { SetTonic, SetTonicPerfect } from "../feats/slices/tonicSlice"
import { NumberInput } from "./widgets/Forms"

interface TonicInputProps {
  label: string
  target: keyof TonicState
  target2?: keyof TonicState
  image: string
}

function TonicGem({ label, target, target2 = undefined, image }: TonicInputProps) {
  const dispatch = useAppDispatch()
  const value = useAppSelector(state => state.Tonic[target])
  const value2 = target2? useAppSelector(state => state.Tonic[target2]) : undefined
  const id = useId()
  return (
    <div className="TonicGem">
      <label htmlFor={id} className="GemImageWrapper">
        <img src={`/img/tonic/${image}.png`} alt={label} />
      </label>
      <label htmlFor={id}>{label}</label>
      <NumberInput id={id} value={value} onChange={v => dispatch(SetTonic([target, v]))} />
      {value2 != null? <NumberInput value={value2} onChange={v => dispatch(SetTonic([target2, v]))} /> : null}
    </div>
  )
}

export function Tonic() {
  const dispatch = useAppDispatch()
  return (
    <div className="Tonic">
      <h3>마력 결정</h3>
      <div className="TonicGems">
        <TonicGem label="HP/MP MAX" image="Top" target="hpmax" target2="mpmax" />
        <TonicGem label="힘/지능" image="RightTop" target="strn_intl" />
        <TonicGem label="체력/정신력" image="RightBottom" target="vit_psi" />
        <TonicGem label="물리/마법 방어력" image="Bottom" target="def_ph" target2="def_mg" />
        <TonicGem label="물리/마법 크리티컬" target="Crit" image="LeftBottom" />
        <TonicGem label="적중/회피" target="Accu" image="LeftTop" />
        <TonicGem label="모든 속성 강화" target="el_all" image="Center" />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <button onClick={() => dispatch(SetTonicPerfect())}>마력결정 최대로</button>
      </div>
    </div>
  )
}
