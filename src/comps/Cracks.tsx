import styled from 'styled-components'
import { useContext } from 'react'
import { useAppSelector } from '../feats/hooks'
import { CrackIcon } from "./widgets/Icons"
import { MagicProps } from './MagicProps'
import { ModalContext } from './modals/modalContext'
import { selectSpells } from "../feats/selector/cracksSelectors"
import { selectItem } from "../feats/selector/equipSelectors"
import { RuneModalFragment, SpellModalFragment } from './modals/CrackModal'



const MagicPropsLayout = styled.div`
  flex-grow: 1;
  align-self: stretch;
  height: 50px;

  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
`

const CrackWrapper = styled.div`
  
  position: relative;
  scale: 0.8;

  @media screen and (max-width: 999px) {
    scale: 0.6;
  }
  
`

const CrackUnderlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const AbsCenterImg = styled.img`
  position: absolute;
  display: block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const SpellSocket = styled.img<{index: number}>`
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  transform-origin: top left;
  --translate: translate(-50%, calc(-100% - 50px));
  --angle: 72deg;
  --img_index: ${props => props.index};
  transform: rotate(calc(var(--angle) * var(--img_index))) var(--translate);
`

export function Cracks() {
  const { openModal } = useContext(ModalContext)
  const rune = useAppSelector(selectItem["봉인석"])
  const spells = useAppSelector(selectSpells)

  return (
    <div className="Cracks">
      <CrackWrapper>
        <CrackUnderlay>
          <AbsCenterImg src="/img/crack.png" alt="" />
          <AbsCenterImg src="/img/CrackRune.png" alt="" />
          {spells.map((_,i) => <SpellSocket key={i} index={i} src="/img/CrackSpell.png" alt="" />)}
        </CrackUnderlay>
        <div className="Crack">
          {spells.map((spell, i) => (
            <CrackIcon key={i} item={spell}
              onClick={() => openModal(<SpellModalFragment index={i} />)}
            />
          ))}
          <CrackIcon item={rune}
            onClick={() => openModal(<RuneModalFragment />)}
          />
        </div>
      </CrackWrapper>
      {rune? <MagicPropsLayout>
        <MagicProps item={rune} part={"봉인석"} />
      </MagicPropsLayout>: null}
    </div>
  )
}
