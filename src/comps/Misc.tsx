import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { SetLevel, SetAchieveLevel, SetAtkFixed } from "../feats/slices/slice"
import { LabeledNumberInput } from "./widgets/Forms"
import { Avatars } from "./Avatar"
import { Guilds } from "./Guilds"
import { Tonic } from "./Tonic"
import React, { useContext } from "react"
import { PortraitMode } from "../responsiveContext"


const GridyTwo = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 2px;
`

const MiscStyle = styled.div`
  input[type=text], input[type=number] {
    max-width: 100px;
  }
`

export function MiscScreen() {
  const portrait = useContext(PortraitMode)
  const dispatch = useAppDispatch()
  const Wrapper = portrait? React.Fragment: GridyTwo
  const
    my_level = useAppSelector(state => state.My.Self.level),
    AchieveLevel = useAppSelector(state => state.My.Self.achieveLevel),
    atkFixed = useAppSelector(state => state.My.Self.atkFixed)
  return (
    <MiscStyle id="Misc">
      <header>
        <h3>캐릭터 기본정보</h3>
      </header>
      <GridyTwo>
        <LabeledNumberInput label="캐릭터 레벨" value={my_level} onChange={v => dispatch(SetLevel(v))} />
        <LabeledNumberInput label="업적 레벨" value={AchieveLevel} onChange={v => dispatch(SetAchieveLevel(v))} />
        <LabeledNumberInput label="독립 공격력" value={atkFixed} onChange={v => dispatch(SetAtkFixed(v))} />
      </GridyTwo>
      <Wrapper>
        <Guilds />
        <Tonic />
        <Avatars />
      </Wrapper>
    </MiscStyle>
  )
}