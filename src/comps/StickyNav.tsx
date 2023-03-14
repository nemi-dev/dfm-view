import { useContext } from "react"
import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { selectMyDFClass, selectMyName } from "../feats/selector/selfSelectors"
import { ModalContext } from "../modalContext"


export function StickyNav() {
  const myName = useAppSelector(selectMyName)
  const dfclass = useAppSelector(selectMyDFClass)
  const { openModal } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  return (
    <div className="StickyNav">
      <img src={`/img/dfclass/${dfclass.name}.png`} onClick={() => openModal({ name: "dfclass" })} />
      <span>{myName}</span>
    </div>
  )
}
