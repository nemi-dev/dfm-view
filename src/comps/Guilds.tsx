import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { SetGuild } from "../feats/slices/guildSlice"
import { LabeledInput } from './CommonUI'

interface GuildsInputProps extends React.PropsWithChildren {
  label: string
  value: number
  target: Parameters<typeof SetGuild>[0][0]
}
function GuildsInput({ label, value, target, children }: GuildsInputProps) {
  const dispatch = useAppDispatch()
  return (
    <div className="GuildsInput">
      <div className="GuildsIconGroup">
        {children}
      </div>
      <LabeledInput label={label} value={value} onChange={v => dispatch(SetGuild([target, v]))} />
    </div>
  )

}


export function Guilds() {
  const { stat, atk, crit, el_all, speed_atk, Accu, guildPublicStatLv } =  useAppSelector(state => state.Guild)
  return (
    <div>
      <h3>길드 버프</h3>
      <div className="InputArea Guilds">
        <GuildsInput label="힘/지능" value={stat} target="stat">
          <img src="/img/guild/strn.png" alt="힘.png" />
          <img src="/img/guild/intl.png" alt="지능.png" />
        </GuildsInput>
        <GuildsInput label="물리/마법 공격력" value={atk} target="atk">
          <img src="/img/guild/atk_ph.png" alt="물리공격력.png" />
          <img src="/img/guild/atk_mg.png" alt="마법공격력.png" />
        </GuildsInput>
        <GuildsInput label="물리/마법 크리티컬" value={crit} target="crit">
          <img src="/img/guild/crit_ph.png" alt="물리크리티컬.png" />
          <img src="/img/guild/crit_mg.png" alt="마법크리티컬.png" />
        </GuildsInput>
        <GuildsInput label="모든 속성 강화" value={el_all} target="el_all">
          <img src="/img/guild/el_all.png" alt="속성강화.png" />
        </GuildsInput>
        <GuildsInput label="적중" value={Accu} target="Accu">
          <img src="/img/guild/Accu.png" alt="적중.png" />
        </GuildsInput>
        <GuildsInput label="공격속도" value={speed_atk} target="speed_atk">
          <img src="/img/guild/speed_atk.png" alt="공격속도.png" />
        </GuildsInput>
        <GuildsInput label="공용 힘/지능 Lv" value={guildPublicStatLv} target="guildPublicStatLv">
          <img src="/img/guild/strn_public.png" alt="힘.png" />
          <img src="/img/guild/intl_public.png" alt="지능.png" />
        </GuildsInput>
      </div>
    </div>
  )
}
