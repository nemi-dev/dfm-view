import { useContext } from "react"
import styled from "styled-components"
import { Users } from "react-feather"
import { useAppSelector } from "../feats/hooks"
import { selectMyDamage } from "../feats/selector/selectors"
import { selectClassAtype, selectMyDFClass, selectMyName } from "../feats/selector/selfSelectors"
import { ModalContext } from "../modalContext"
import { Num } from "./widgets/NumberView"
import { SavedCharsFragment } from "./modals/SavedCharsModal"
import { DFClassModal } from "./modals/DFClassModal"
import { DFClassIcon } from "./widgets/Icons"



const StickyNavStyle = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  min-height: 41px;
  padding: 2px 8px;
  border-bottom: 1px solid rgba(127, 104, 72, 0.771);
  background-color: rgba(44, 36, 33, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 2;

  img {
    height: 36px;
  }

  input[type=text] {
    width: 120px;
    text-align: left;
  }
`

const DFCharInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
`

const DamageCapture = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  gap: 4px;
  .DamageOne {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
    .KeyName {
      font-size: 0.7rem;
    }
  }
`

interface DamageOneProps {
  name: string
  value: number
  atype: Atype
}

function DamageOne({ name, value, atype }: DamageOneProps) {
  return <div className="DamageOne">
    <span className="KeyName">{name}</span>
    <Num className={"AttrValue "+atype} value={value} />
  </div>
}

export function StickyNav() {
  const myName = useAppSelector(selectMyName)
  const dfclass = useAppSelector(selectMyDFClass)
  const atype = useAppSelector(selectClassAtype)
  const plainDamage = useAppSelector(selectMyDamage)
  const { openModal } = useContext(ModalContext)
  
  return (
    <StickyNavStyle>
      <DFCharInfo>
        <DFClassIcon dfclassName={dfclass?.name} onClick={() => openModal(<DFClassModal />)} />
        <span>{myName}</span>
      </DFCharInfo>
      <DamageCapture>
        <DamageOne name="데미지" value={plainDamage} atype={atype} />
        <div onClick={() => openModal(<SavedCharsFragment />)}>
          <Users />
        </div>
      </DamageCapture>
    </StickyNavStyle>
  )
}
