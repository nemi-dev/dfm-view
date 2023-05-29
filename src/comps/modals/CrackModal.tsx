import { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../../feats/hooks'
import { selectClassAtype } from '../../feats/selector/baseSelectors'
import { SetItem, SetSpellAll } from '../../feats/slices/slicev5'
import { getCracksOnly } from '../../items'
import { LabeledSwitch } from '../widgets/Forms'
import { CurrentPart } from './CurrentPart'
import { ModalContext } from '../../feats/contexts'
import { ModalItemSelect } from './Select'

export function RuneModalFragment() {
  const { closeModal } = useContext(ModalContext)
  const atype = useAppSelector(selectClassAtype)
  const items = getCracksOnly("봉인석", atype)
  const dispatch = useAppDispatch()
  const onClick = useCallback((name: string) => {
    dispatch(SetItem([undefined, "봉인석", name]))
    closeModal()
  }, [])
  return (
    <>
      <header>
        <h3>성안의 봉인 - 봉인석</h3>
      </header>
      <CurrentPart sel="봉인석" />
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
    if (all) dispatch(SetSpellAll([undefined, name]))
    else dispatch(SetItem([undefined, '정수', index, name]))
    closeModal()
  }, [index, all])
  return (
    <>
    <header>
      <h3>성안의 봉인 - 정수</h3>
      <Checkie2 label="선택한 정수 5개 끼기" checked={all} onChange={setAll} />
    </header>
      <CurrentPart sel={{ part: "정수", index }} />
      <div className="ItemSelectArray">
      {items.map((item) => (
        <ModalItemSelect key={item.name} item={item} onClick={() => onClick(item.name)} />
      ))}
    </div>
    </>
  )
}