import { useCallback, useContext } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { useAppSelector } from '../feats/hooks'
import { selectMagicPropNames2 } from '../feats/selector/equipSelectors'
import { selectClassAtype } from '../feats/selector/baseSelectors'
import { SetMyMagicProps } from '../feats/slices/slicev5'
import { hasMagicProps } from '../items'
import { getOneMagicPropValue, getRealAttrKey, nextMagicProps } from '../magicProps'
import { PortraitMode } from '../responsiveContext'
import { AttrIcon } from './widgets/Icons'
import { Num } from './widgets/NumberView'

interface MagicPropsArrayProps {
  item: DFItem
  part: WholePart
}

const MagicPropOne = styled.div`
  flex-grow: 1;
  display: flex;

  cursor: pointer;

  align-items: center;
  justify-content: center;


  &:nth-last-child(3) {
    background-color: rgba(13, 9, 5, 0.5);
  }

  .MagicPropValue {
    color: var(--attr-value-color);
    font-size: 0.7rem;
    font-weight: 800;
  }

`

export function MagicProps({ item, part }: MagicPropsArrayProps) {
  // 사용자가 part를 강제로 바꿀 수 없기 때문에 hooks 앞에 이게 와도 괜찮음!
  if (!hasMagicProps(part)) return null
  
  const isPortrait = useContext(PortraitMode)
  const { level, rarity } = item
  const dispatch = useDispatch()
  const array = useAppSelector(state => selectMagicPropNames2(state, undefined, part))
  const atype = useAppSelector(selectClassAtype)
  const clickHandler = useCallback((index: number) => {
    const next = nextMagicProps(part, array[index], level, rarity, index === 0)
    dispatch(SetMyMagicProps([part, index, next]))
  }, [item?.name, part, array])
  if (!item) return null
  return (
    <>
      {array.map((name, index) => index > 0 || rarity === "Epic" ?
      <MagicPropOne key={index} className="MagicPropOne Hovering" onClick={() => clickHandler(index)} >
        <AttrIcon attrKey={getRealAttrKey(name, atype)} />
        {!isPortrait? <Num className="MagicPropValue" signed value={getOneMagicPropValue(name, { level, rarity, part, prime: index === 0 })} />: null}
      </MagicPropOne> : null
      )}
    </>
  )
}