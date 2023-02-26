import { attrDefs, percent_inc_mul } from "../attrs"
import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { AddSkillInc, RemoveSkillInc, SetBasicAttr, SetSkillInc } from "../feats/slices/calibrateSlice"
import { DeleteSwitch } from "../feats/slices/equipSlice"
import { DisposableInput, LabeledInput } from "./CommonUI"

interface SwitchNotificationProps {
  what: "branches" | "gives" | "exclusives"
  switchKey: string
  value?: string
}

const calibrateTarget = (() => {
  const index = attrDefs.findIndex(i => i.key == "speed_atk")
  return attrDefs.slice(0, index)
})()

function SwitchNotification({ what, switchKey, value }: SwitchNotificationProps) {
  const chop = switchKey.split("::")
  const dispatch = useAppDispatch()
  return (
    <div className="SwitchNotification">
      ⚠️ [{chop[0]}]의 "{chop[1]}" 옵션이 { value? `"${value}"로 되어 있습니다.` : "켜진 상태입니다."}
      <button onClick={() => dispatch(DeleteSwitch([what, switchKey]))}>끄기</button>
    </div>
  )
}

function SwitchGroup() {
  const { branches, gives, exclusives } = useAppSelector(state => state.Switch)
  return (
  <div>
    {Object.keys(branches).sort().map(k => (
      branches[k]? <SwitchNotification key={k} what="branches" switchKey={k} /> : null
    ))}
    {Object.keys(gives).sort().map(k => (
      gives[k]? <SwitchNotification key={k} what="gives" switchKey={k} /> : null
    ))}
    {Object.keys(exclusives).sort().map(k => (
      exclusives[k]? <SwitchNotification key={k} what="exclusives" switchKey={k} value={exclusives[k]} /> : null
    ))}
  </div>
  )
}

export function Calibrate() {
  const cattr = useAppSelector(state => state.Calibrate)
  const dispatch = useAppDispatch()
  const sk_inc_real = cattr.sk_inc.reduce(percent_inc_mul, 0)
  return (
    <div className="Calibrate">
      <h3>스탯 조정</h3>
      <div style={{ textAlign: "center"}}>
        계산된 수치가 실제와 다르다면 여기서 조정할 수 있습니다.
      </div>
      <SwitchGroup />
      <div className="InputArea">
        <div className="Duplex">
          {calibrateTarget.map(a => {
            if (a.key === "sk_inc") return null
            if (a.key in cattr) return (
              <LabeledInput key={a.key} label={a.name} value={cattr[a.key]}
              onChange={v => dispatch(SetBasicAttr([a.key as any, v]))}
              />
            )
          })}
        </div>
        <div>
          <span>스킬 공격력 증가</span>
          <button onClick={() => dispatch(AddSkillInc())}>+</button>
        </div>
        <div>
          {cattr.sk_inc.map((v, i) => {
            return <DisposableInput key={i} index={i} value={v}
              update={nv => dispatch(SetSkillInc([i, nv]))}
              del={() => dispatch(RemoveSkillInc(i))}
            />
          })}
        </div>
      </div>
    </div>
  )
}

