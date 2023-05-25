import { useContext } from 'react'
import { Edit } from 'react-feather'
import styled from 'styled-components'

import { useAppSelector } from '../feats/hooks'
import { selectMyDFClass, selectName } from '../feats/selector/baseSelectors'
import { PortraitMode } from '../responsiveContext'
import { DamageOutput } from './DamageOutput'
import { DFClassModal } from './modals/DFClassModal'
import { ModalContext } from './modals/modalContext'
import { SavedCharsFragment } from './modals/SavedCharsModal'
import { SecondRow } from './MyStatStick'
import { DFClassIcon } from './widgets/Icons'

const StickyNavStyle = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  padding: 2px 8px;
  border-bottom: 1px solid rgba(127, 104, 72, 0.771);
  background-color: rgba(44, 36, 33, 0.75);
  backdrop-filter: blur(20px);
  z-index: 5;
  

  img.DFClassIcon {
    height: 36px;
  }

  input[type=text] {
    width: 120px;
    text-align: left;
  }

  svg {
    width: 18px;
    padding-inline: 6px;
    cursor: pointer;
  }

  @media screen and (max-width: 999px) {
    padding: 2px 4px;
    img.DFClassIcon {
      height: 30px;
    }
  }
`

const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  min-height: 38px;

  @media screen and (max-width: 999px) {
    min-height: 32px;
  }
`

const DFCharInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
`

const OutputZoneStyle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  flex-wrap: wrap;
  gap: 4px;
  .DamageOne {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  .KeyName {
    font-size: 0.8rem;
  }
  @media screen and (max-width: 999px) {
    .KeyName {
      font-size: 0.6rem;
    }
  }
`

interface DamageOneProps {
  name: string
}

function DamageOne({ name, children }: React.PropsWithChildren<DamageOneProps>) {
  return <div className="DamageOne">
    <span className="KeyName">{name}</span>
    {children}
  </div>
}

function OutputZone() {
  return <OutputZoneStyle className="OutputZone">
    <DamageOne name="평타"><DamageOutput crit="mean" /></DamageOne>
    <DamageOne name="스킬"><DamageOutput crit="mean" sk /></DamageOne>
  </OutputZoneStyle>
}

export function StickyNav() {
  const portrait = useContext(PortraitMode)
  const { openModal } = useContext(ModalContext)
  const myName = useAppSelector(selectName)
  const dfclass = useAppSelector(selectMyDFClass)
  
  return (
    <StickyNavStyle>
      <FirstRow>
        <DFCharInfo>
          <DFClassIcon dfclassName={dfclass?.name} onClick={() => openModal(<SavedCharsFragment />)} />
          <span>{myName}</span>
          <Edit className="Rarity_Epic" onClick={() => openModal(<DFClassModal />)} />
        </DFCharInfo>
        <OutputZone />
      </FirstRow>
      {portrait && <SecondRow />}
    </StickyNavStyle>
  )
}
