import React, { useContext } from 'react'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { SetMyAchieveLevel, SetMyAtkFixed, SetMyLevel } from '../feats/slices/slicev5'
import { PortraitMode } from '../feats/contexts'
import { Avatars } from './Avatar'
import { Guilds } from './Guilds'
import { Tonic } from './Tonic'
import { LabeledNumberInput } from './widgets/Forms'
import { selectAchievementLevel, selectAtkFixed, selectLevel } from '../feats/selector/baseSelectors'

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
    myLevel = useAppSelector(selectLevel),
    AchieveLevel = useAppSelector(selectAchievementLevel),
    atkFixed = useAppSelector(selectAtkFixed)
  return (
    <MiscStyle id="Misc">
      <header>
        <h3>캐릭터 기본정보</h3>
      </header>
      <GridyTwo>
        <LabeledNumberInput label="캐릭터 레벨" value={myLevel} onChange={v => dispatch(SetMyLevel(v))} />
        <LabeledNumberInput label="업적 레벨" value={AchieveLevel} onChange={v => dispatch(SetMyAchieveLevel(v))} />
        <LabeledNumberInput label="독립 공격력" value={atkFixed} onChange={v => dispatch(SetMyAtkFixed(v))} />
      </GridyTwo>
      <Wrapper>
        <Guilds />
        <Tonic />
        <Avatars />
      </Wrapper>
    </MiscStyle>
  )
}