import { MouseEventHandler, useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../../feats/hooks'
import { selectClassAtype, selectDFChar } from '../../feats/selector/baseSelectors'
import { SetItem, SetSpellAll } from '../../feats/slices/slicev5'
import { getCracksOnly, getItem } from '../../items'
import { LabeledSwitch } from '../widgets/Forms'
import { CurrentPart } from './CurrentPart'
import { ModalContext } from '../../feats/contexts'
import { ModalItemSelect } from './Select'
import { selectMainItem } from '../../feats/selector/itemSelectors'
import { CrackIcon } from '../widgets/Icons'

const CrackModalStyle = styled.div`

`

const CrackItemListStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
  margin: auto;

  @media screen and (max-width: 999px) {
    display: grid;
    grid-template-columns: repeat(5, 1fr);

    .CrackIcon {
      --icon-size: 36px;
    }
  }

  .CrackIcon {
    opacity: 0.5;
    filter: grayscale(50%);

    &:hover, &.Active {
      opacity: 1;
      filter: unset;
    }
  }
`

const Scrolling = styled.div`
  overflow-y: scroll;
  height: 65vh;
`

interface SelectProps {
  item: DFItem
  onClick: MouseEventHandler<HTMLDivElement>
  className?: string
}

function CrackItemSelect({ item, className = "", onClick }: SelectProps) {
  return <CrackIcon item={item} className={className} onClick={onClick} />
}

export function CracksModal() {
  const [all, setAll] = useState(false)
  const atype = useAppSelector(selectClassAtype)
  const myRune = useAppSelector(state => selectMainItem(state, undefined, "봉인석"))
  const mySpells = useAppSelector(state => selectDFChar(state, undefined).items.정수.map(getItem))
  const runes = useMemo(() => getCracksOnly("봉인석", atype), [atype])
  const spellSelectList = useMemo(() => getCracksOnly("정수", atype), [atype])
  const dispatch = useAppDispatch()
  const setRune = useCallback((name: string) => {
    dispatch(SetItem([undefined, "봉인석", name]))
  }, [])
  const setSpell = useCallback((index: number, name: string) => {
    if (all) dispatch(SetSpellAll([undefined, name]))
    else dispatch(SetItem([undefined, '정수', index, name]))
  }, [all])
  return (
    <CrackModalStyle>
      <CurrentPart sel="봉인석" />
      <Scrolling>
        <div>
        <h3>봉인석</h3>
        <CrackItemListStyle>
          {runes.map((item) => (
            <CrackItemSelect className={myRune.name === item.name ? "Active" : ""} key={item.name} item={item} onClick={() => setRune(item.name)} />
          ))}
        </CrackItemListStyle>
        <h3>정수</h3>
        {
          [0,1,2,3,4].map(i => 
            <CrackItemListStyle key={i}>
            {spellSelectList.map(s => 
              <CrackItemSelect className={mySpells[i].name === s.name ? "Active" : ""} key={`${s.name}-${i}`} item={s} onClick={() => setSpell(i ,s.name)} />
            )}
            </CrackItemListStyle>
          )
        }
        </div>
      </Scrolling>
    </CrackModalStyle>
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
  const setSpell = useCallback((name: string) => {
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
        <ModalItemSelect key={item.name} item={item} onClick={() => setSpell(item.name)} />
      ))}
    </div>
    </>
  )
}