import { useAppSelector } from '../feats/hooks';
import { CrackIcon } from "./widgets/Icons";
import { MagicProps } from './MagicProps';
import React, { useContext } from 'react';
import { ModalContext } from '../modalContext';
import { selectCrackISetAttrs, selectSpells, selectRune, selectCracksAll, selectBlessing } from '../feats/selectors';
import { SimpleBaseAttrView } from './AttrsView';
import styled from 'styled-components';
import { NextMagicProps } from '../feats/slices/equipSlice';



const MagicPropsLayout = styled.div`
  flex-grow: 1;
  align-self: stretch;
  height: 50px;

  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
`

export function Cracks() {
  const { openModal } = useContext(ModalContext)
  
  const rune = useAppSelector(selectRune)
  const spells = useAppSelector(selectSpells)
  const blessing = useAppSelector(selectBlessing)
  const isetattr = useAppSelector(selectCrackISetAttrs)

  
  return (
    <div className="Cracks">
      <h3>성안의 봉인</h3>
      <div className="CrackWrapper">
        <div className="CrackUnderlay">
          <img src="/img/crack.png" alt="" />
          <img src="/img/CrackRune.png" alt="" />
        </div>
        <div className="CrackSpellSockets">
          <img src="/img/CrackSpell.png" alt="" />
          <img src="/img/CrackSpell.png" alt="" />
          <img src="/img/CrackSpell.png" alt="" />
          <img src="/img/CrackSpell.png" alt="" />
          <img src="/img/CrackSpell.png" alt="" />
        </div>
        <div className="Crack">
          {spells.map((spell, i) => (
            <CrackIcon key={i} item={spell} onClick={() => openModal("정수", "Equip", i)} />
          ))}
          <CrackIcon item={rune} onClick={() => openModal("봉인석", "Equip")} />
        </div>
      </div>
      {rune?
      <MagicPropsLayout>
      <MagicProps item={rune} part={"봉인석"} />
      </MagicPropsLayout>: null}
      {blessing?
        <div>
          <h4>{blessing.name}</h4>
          <div>
            <SimpleBaseAttrView attrs={blessing}/>
          </div>
        </div>: null}
      {Object.keys(isetattr).sort().map((isetname) => (
          <React.Fragment key={isetname}>
          <h4>{isetname}</h4>
          <div>
            <SimpleBaseAttrView attrs={isetattr[isetname]}/>
          </div>
          </React.Fragment>
        ))}
      {rune?
        <div>
          <h3>성안의 봉인 효과</h3>
          <SimpleBaseAttrView attrs={useAppSelector(selectCracksAll)}/>
        </div>: null}
    </div>
  );
}
