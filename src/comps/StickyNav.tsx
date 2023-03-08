import { useContext } from "react"
import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { SetMyName } from "../feats/slices/slice"
import { ModalContext } from "../modalContext"

export function StickyNav() {
  const myName = useAppSelector(state => state.Profile.myName)
  const dfclass = useAppSelector(state => state.Profile.dfclass)
  const { openModal } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  return (
    <div className="StickyNav">
      <img src={`/img/dfclass/${dfclass}.png`} onClick={() => openModal({ name: "dfclass" })} />
      <input type="text" value={myName} onChange={ev => dispatch(SetMyName(ev.target.value))} />
    </div>
  )
}