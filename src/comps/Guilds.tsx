import styled from 'styled-components'
import { AtypeAttrKey } from '../attrs'
import { selectGuildAccu, selectGuildAtk, selectGuildCrit, selectGuildSpeedAtk, selectGuildStat, selectGuildStatPublic } from '../feats/guildSelectors'
import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { selectSpecifiedAtype } from "../feats/selector/selfSelectors"
import { PerfectGuild, SetGuild } from "../feats/slices/guildSlice"
import { RootState } from '../feats/store'
import { SimpleBaseAttrView } from './widgets/AttrsView'
import { LabeledNumberInput } from "./widgets/Forms"


const GuildLayout = styled.div`
  --guild-icon-size: 60px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  
  gap: 2px;

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

function GuildPropOne({ label, value, target, src, max, selector }: GuildsInputProps) {
  const dispatch = useAppDispatch()
  const attr = selector? useAppSelector(selector) : null
  return (
    <div className="GuildPropOne">
      <img src={src} alt={label} />
      <LabeledNumberInput label={label + " Lv."} value={value} min={0} max={max} step={1}  onChange={v => dispatch(SetGuild([target, v]))} />
      <div className="AttrOut">
        <SimpleBaseAttrView attrs={attr} />
      </div>
    </div>
  )
}

export function Guilds() {
  const { StatLv, AtkLv, CritLv, ElLv, SpeedAtkLv: SpeedAtkLv, AccuLv, PublicStatLv } =  useAppSelector(state => state.My.Guild)
  const atype = useAppSelector(selectSpecifiedAtype)
  const { Stat: keyStat, Atk: keyAtk, Crit: keyCrit, ??????, ?????? } = AtypeAttrKey[atype]
  const dispatch = useAppDispatch()
  return (
    <div id="Guilds">
      <h3>?????? ??????</h3>
      <GuildLayout>
        <GuildPropOne value={StatLv} max={30} target="StatLv" selector={selectGuildStat}
          label={??????} src={`/img/guild/${keyStat}.png`} />
        <GuildPropOne value={AtkLv} max={30} target="AtkLv" selector={selectGuildAtk}
          label={`${??????}?????????`} src={`/img/guild/${keyAtk}.png`} />
        <GuildPropOne value={CritLv} max={30} target="CritLv" selector={selectGuildCrit}
          label={`${??????}????????????`} src={`/img/guild/${keyCrit}.png`} />
        <GuildPropOne value={ElLv} max={14} target="ElLv"
          label="?????? ?????? ??????" src="/img/guild/el_all.png" />
        <GuildPropOne value={AccuLv} max={30} target="AccuLv" selector={selectGuildAccu}
          label="??????"  src="/img/guild/Accu.png" />
        <GuildPropOne value={SpeedAtkLv} max={14} target="SpeedAtkLv" selector={selectGuildSpeedAtk}
          label="????????????" src="/img/guild/speed_atk.png" />
        <GuildPropOne value={PublicStatLv} target="PublicStatLv" selector={selectGuildStatPublic}
          label={`?????? ${??????}`} src={`/img/guild/${keyStat}_public.png`} />
      </GuildLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
        <button onClick={() => dispatch(PerfectGuild())}>?????? ???????????? ?????????</button>
      </div>
    </div>
  )
}
