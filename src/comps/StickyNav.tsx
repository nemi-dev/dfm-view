import { useContext } from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { selectMyDamage } from "../feats/selector/selectors"
import { selectClassAtype, selectMyDFClass, selectMyName } from "../feats/selector/selfSelectors"
import { ModalContext } from "../modalContext"
import { Num } from "./widgets/NumberView"


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

function DamageOne({ name, value, atype }) {
  return <div className="DamageOne">
    <span className="KeyName">{name}</span>
    <Num className={"AttrValue "+atype} value={value} />
  </div>
}

export function StickyNav() {
  const myName = useAppSelector(selectMyName)
  const dfclass = useAppSelector(selectMyDFClass)
  const { openModal } = useContext(ModalContext)
  const atype = useAppSelector(selectClassAtype)
  const plainDamage = useAppSelector(selectMyDamage)
  
  return (
    <StickyNavStyle>
      <DFCharInfo>
        <img src={`/img/dfclass/${dfclass.name}.png`}
        onClick={() => openModal({ name: "dfclass" })} />
        <span>{myName}</span>
      </DFCharInfo>
      <DamageCapture>
        <DamageOne name="아웃풋" value={plainDamage} atype={atype} />
      </DamageCapture>
    </StickyNavStyle>
  )
}
