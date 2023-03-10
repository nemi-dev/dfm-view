import styled from "styled-components"
import { useCallback, useContext, useState, MouseEventHandler } from "react"
import { useAppDispatch, useAppSelector } from "../../feats/hooks"
import { getCracksOnly } from "../../items"
import { ItemName } from "../CommonUI"
import { CrackIcon } from "../widgets/Icons"
import { ModalContext } from "../../modalContext"
import { Checkie } from "../widgets/Forms"
import { selectAtype } from "../../feats/selectors"
import { SetItem, SetSpell, SetSpellAll } from "../../feats/slices/itemSlice"

interface SelectProps {
  item: DFItem
  onClick: MouseEventHandler<HTMLDivElement>
}

function Select({ item, onClick }: SelectProps) {  
  return (
    <div className="ModalItemSelect" onClick={onClick}>
      <CrackIcon  item={item} />
      <ItemName item={item} className="ItemNameResponsive" />
    </div>
  )
}

export function RuneModalFragment() {
  const { setOpen, } = useContext(ModalContext)
  const atype = useAppSelector(selectAtype)
  const items = getCracksOnly("봉인석", atype)
  const dispatch = useAppDispatch()
  const onClick = useCallback((name: string) => {
    dispatch(SetItem(["봉인석", name]))
    setOpen(false)
  }, [])
  return (
    <div className="ItemSelectArray">
      {items.map((item) => (
        <Select key={item.name} item={item} onClick={() => onClick(item.name)} />
      ))}
    </div>
  )
}

const Checkie2 = styled(Checkie)`
  display: inline-flex;
`

export function SpellModalFragment() {
  const { setOpen, message } = useContext(ModalContext)
  const { index: spellIndex } = message as ModalRequestForItem
  const [all, setAll] = useState(false)
  const atype = useAppSelector(selectAtype)
  const items = getCracksOnly("정수", atype)
  const dispatch = useAppDispatch()
  const onClick = useCallback((name: string) => {
    if (all) dispatch(SetSpellAll(name))
    else dispatch(SetSpell([spellIndex, name]))
    setOpen(false)
  }, [spellIndex, all])
  return (
    <>
    <header>
      <h3>성안의 봉인 - 정수</h3>
      <Checkie2 label="선택한 정수 5개 끼기" checked={all} onChange={setAll} />
    </header>
    <div className="ItemSelectArray">
      {items.map((item) => (
        <Select key={item.name} item={item} onClick={() => onClick(item.name)} />
      ))}
    </div>
    </>
  )
}