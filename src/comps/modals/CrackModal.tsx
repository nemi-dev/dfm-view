import styled from "styled-components"
import { useCallback, useContext, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../feats/hooks"
import { getCracksOnly } from "../../items"
import { ModalContext } from "./modalContext"
import { LabeledSwitch } from "../widgets/Forms"
import { selectClassAtype } from "../../feats/selector/selfSelectors"
import { SetItem, SetSpell, SetSpellAll } from "../../feats/slices/itemSlice"
import { ModalItemSelect } from "./Select"
import { CurrentPart } from "./CurrentPart"

export function RuneModalFragment() {
  const { closeModal } = useContext(ModalContext)
  const atype = useAppSelector(selectClassAtype)
  const items = getCracksOnly("봉인석", atype)
  const dispatch = useAppDispatch()
  const onClick = useCallback((name: string) => {
    dispatch(SetItem(["봉인석", name]))
    closeModal()
  }, [])
  return (
    <>
      <header>
        <h3>성안의 봉인 - 봉인석</h3>
      </header>
      <CurrentPart part="봉인석" />
      <div className="ItemSelectArray">
        {items.map((item) => (
          <ModalItemSelect key={item.name} item={item} onClick={() => onClick(item.name)} />
        ))}
      </div>
    </>
  )
}

const Checkie2 = styled(LabeledSwitch)`
  display: inline-flex;
`

export function SpellModalFragment({ index }: { index: number }) {
  const { closeModal } = useContext(ModalContext)
  const [all, setAll] = useState(false)
  const atype = useAppSelector(selectClassAtype)
  const items = getCracksOnly("정수", atype)
  const dispatch = useAppDispatch()
  const onClick = useCallback((name: string) => {
    if (all) dispatch(SetSpellAll(name))
    else dispatch(SetSpell([index as number, name]))
    closeModal()
  }, [index, all])
  return (
    <>
    <header>
      <h3>성안의 봉인 - 정수</h3>
      <Checkie2 label="선택한 정수 5개 끼기" checked={all} onChange={setAll} />
    </header>
      <CurrentPart part="정수" index={index} />
      <div className="ItemSelectArray">
      {items.map((item) => (
        <ModalItemSelect key={item.name} item={item} onClick={() => onClick(item.name)} />
      ))}
    </div>
    </>
  )
}