import styled from "styled-components"
import { useDispatch } from "react-redux"
import { useAppSelector } from "../feats/hooks"
import { getOneMagicPropValue, getRealAttrKey, nextMagicProps } from "../magicProps"
import { AttrIcon } from "./widgets/Icons"
import { Num } from "./widgets/NumberView"
import { useCallback, useContext } from "react"
import { PortraitMode } from "../responsiveContext"
import { selectAtype } from "../feats/selector/selfSelectors"
import { selectMagicPropNames } from "../feats/selector/equipSelectors"
import { SetMagicProps } from "../feats/slices/itemSlice"

interface MagicPropsArrayProps {
  item: DFItem
  part: MagicPropsPart
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
  if (!item) return null
  const isPortrait = useContext(PortraitMode)
  const { level, rarity } = item
  const dispatch = useDispatch()
  const array = useAppSelector(selectMagicPropNames[part])
  const atype = useAppSelector(selectAtype)
  const current = useAppSelector(selectMagicPropNames[part])
  const clickHandler = useCallback((index: number) => {
    const next = nextMagicProps(part, current[index], level, rarity, index === 0)
    dispatch(SetMagicProps([part, index, next]))
  }, [item.name, part, current])
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