import styled from 'styled-components'

import { AtypeAttrKey, perfectGuild } from '../constants'
import { useAppDispatch, useAppSelector } from '../feats/hooks'
import {
    selectGuildAccu, selectGuildAtk, selectGuildCrit, selectGuildSpeedAtk, selectGuildStat,
    selectGuildStatPublic,
    selectGuildState
} from '../feats/selector/guildSelectors'
import { selectClassAtype } from '../feats/selector/selfSelectors'
import { PerfectMyGuild, SetMyGuildBuffLevel } from '../feats/slices/mycharSlice'
import { RootState } from '../feats/store'
import { SimpleBaseAttrView } from './widgets/AttrsView'
import { LabeledNumberInput } from './widgets/Forms'

const GuildLayout = styled.div`
  --guild-icon-size: 60px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  
  gap: 2px;

  @media screen and (max-width: 999px) {

    .GuildPropOne {
      width: 100%;
    }
    input[type=number] {
      flex-grow: 2;
    }
  }

  .GuildPropOne {
    display: grid;
    grid-template-areas:
    "im in"
    "im out";
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    justify-items: center;
  }

  img {
    grid-area: im;
    border: 1px solid #524d42;
    padding: 1px;
    height: var(--guild-icon-size);
    width: var(--guild-icon-size);
  }

  .FormDF {
    justify-self: stretch;
    grid-area: in;
    padding-block: 1px;
    padding-inline-start: 8px;
    label {
      flex-basis: 100px;
      font-size: 0.8rem;
    }
  }
  .AttrOut {
    grid-area: out;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
`

interface GuildsInputProps {
  label: string
  value: number
  target: keyof GuildState
  src: string
  selector?: (s:RootState) => BaseAttrs
  max?: number
}

function isPerfect({ StatLv, AtkLv, CritLv, ElLv, SpeedAtkLv, AccuLv }: GuildState) {
  const {
    StatLv: pStatLv, 
    AtkLv: pAtkLv, 
    CritLv: pCritLv, 
    ElLv: pElLv, 
    SpeedAtkLv: pSpeedAtkLv, 
    AccuLv: pAccuLv, 
  } = perfectGuild
  return (
    StatLv >= pStatLv &&
    AtkLv >= pAtkLv &&
    CritLv >= pCritLv &&
    ElLv >= pElLv &&
    SpeedAtkLv >= pSpeedAtkLv &&
    AccuLv >= pAccuLv
  )
  
}

function GuildPropOne({ label, value, target, src, max, selector }: GuildsInputProps) {
  const dispatch = useAppDispatch()
  const attr = selector? useAppSelector(selector) : null
  return (
    <div className="GuildPropOne">
      <img src={src} alt={label} />
      <LabeledNumberInput label={label + "Lv."} value={value} min={0} max={max} step={1}  onChange={v => dispatch(SetMyGuildBuffLevel([target, v]))} />
      <div className="AttrOut">
        <SimpleBaseAttrView attrs={attr} />
      </div>
    </div>
  )
}

export function Guilds() {
  const dispatch = useAppDispatch()
  const guildState = useAppSelector(selectGuildState)
  const atype = useAppSelector(selectClassAtype)
  const { StatLv, AtkLv, CritLv, ElLv, SpeedAtkLv, AccuLv, PublicStatLv } = guildState
  const { Stat: keyStat, Atk: keyAtk, Crit: keyCrit, 스탯, 타입 } = AtypeAttrKey[atype]
  const perfect = isPerfect(guildState)
  return (
    <div id="Guilds">
      <h3>길드 버프</h3>
      <GuildLayout>
        <GuildPropOne value={StatLv} max={30} target="StatLv" selector={selectGuildStat}
          label={스탯} src={`/img/guild/${keyStat}.png`} />
        <GuildPropOne value={AtkLv} max={30} target="AtkLv" selector={selectGuildAtk}
          label={`${타입[0]}공`} src={`/img/guild/${keyAtk}.png`} />
        <GuildPropOne value={CritLv} max={30} target="CritLv" selector={selectGuildCrit}
          label={`${타입[0]}크`} src={`/img/guild/${keyCrit}.png`} />
        <GuildPropOne value={ElLv} max={14} target="ElLv"
          label="속강" src="/img/guild/el_all.png" />
        <GuildPropOne value={AccuLv} max={30} target="AccuLv" selector={selectGuildAccu}
          label="적중"  src="/img/guild/Accu.png" />
        <GuildPropOne value={SpeedAtkLv} max={14} target="SpeedAtkLv" selector={selectGuildSpeedAtk}
          label="공속" src="/img/guild/speed_atk.png" />
        <GuildPropOne value={PublicStatLv} max={30} target="PublicStatLv" selector={selectGuildStatPublic}
          label={`공용${스탯}`} src={`/img/guild/${keyStat}_public.png`} />
      </GuildLayout>
      {!perfect?
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
        <button onClick={() => dispatch(PerfectMyGuild())}>개인 길드버프 최대로</button>
      </div> : null}
    </div>
  )
}
