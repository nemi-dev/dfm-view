import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { SetTonic } from "../feats/slices/tonicSlice"
import { NumberInput } from "./widgets/Forms"

interface TonicInputProps {
  label: string
  value: number
  target: keyof TonicType
  image: string
}

function TonicGem({ label, value, target, image }: TonicInputProps) {
  const dispatch = useAppDispatch()
  return (
    <div className="TonicGem">
      <div className="GemImageWrapper">
        <img src={`/img/tonic/${image}.png`} alt={label} />
      </div>
      <label htmlFor={label}>{label}</label>
      <NumberInput name={label} value={value} onChange={v => dispatch(SetTonic([target, v]))} />
    </div>
  )
}

export function Tonic() {
  const { Accu, crit, def, el_all, hp_mp_max, strn_intl, vit_psi } = useAppSelector(state => state.Tonic)
  return (
    <div className="Tonic">
      <h3>마력 결정</h3>
      <div className="TonicGems">
        <TonicGem label="HP/MP MAX" value={hp_mp_max} target="hp_mp_max" image="Top" />
        <TonicGem label="힘/지능" value={strn_intl} target="strn_intl" image="RightTop" />
        <TonicGem label="체력/정신력" value={vit_psi} target="vit_psi" image="RightBottom" />
        <TonicGem label="물리/마법 방어력" value={def} target="def" image="Bottom" />
        <TonicGem label="물리/마법 크리티컬" value={crit} target="crit" image="LeftBottom" />
        <TonicGem label="적중/회피" value={Accu} target="Accu" image="LeftTop" />
        <TonicGem label="모든 속성 강화" value={el_all} target="el_all" image="Center" />
      </div>
    </div>
  )
}
