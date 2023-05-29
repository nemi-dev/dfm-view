import { createSelector } from "@reduxjs/toolkit"
import { combine } from "../../attrs"
import { GuildAccu, GuildAtk, GuildCrit, GuildEl, GuildSpeedAtk, GuildStat, GuildStatPublic } from "../../guild"
import { selectDFChar, selectClassAtype } from "./baseSelectors"

export const selectGuildState = createSelector(
  selectDFChar, dfchar => dfchar.guild
)

/** 길드버프: 내 공격타입 스탯 증가 효과를 선택한다. */
export const selectGuildStat = createSelector(
  selectGuildState, selectClassAtype,
  (guild, atype) => GuildStat(guild.StatLv, atype)
)

/** 길드 공용 버프: 내 공격타입 스탯 증가 효과를 선택한다. */
export const selectGuildStatPublic = createSelector(
  selectGuildState, selectClassAtype,
  (guild, atype) => GuildStatPublic(guild.PublicStatLv, atype)
)

/** 길드버프: 내 공격타입 공격력 증가 효과를 선택한다. */
export const selectGuildAtk = createSelector(
  selectGuildState, selectClassAtype,
  (guild, atype) => GuildAtk(guild.AtkLv, atype)
)

/** 길드버프: 내 공격타입 크리티컬 증가 효과를 선택한다. */
export const selectGuildCrit = createSelector(
  selectGuildState, selectClassAtype,
  (guild, atype) =>  GuildCrit(guild.CritLv, atype)
)

/** 길드버프: 모든속성 강화 효과를 선택한다. */
export const selectGuildEl = createSelector(
  selectDFChar,
  dfchar => GuildEl(dfchar.guild.ElLv)
)

/** 길드버프: 공격속도 증가 효과를 선택한다. */
export const selectGuildSpeedAtk = createSelector(
  selectDFChar,
  dfchar => GuildSpeedAtk(dfchar.guild.SpeedAtkLv)
)

/** 길드버프: 적중 증가 효과를 선택한다. */
export const selectGuildAccu = createSelector (
  selectDFChar,
  dfchar => GuildAccu(dfchar.guild.AccuLv)
)


/** 길드 스탯 보너스를 얻는다. */
export const selectGuilds = createSelector(
  selectGuildStat,
  selectGuildStatPublic,
  selectGuildAtk,
  selectGuildCrit,
  selectGuildEl,
  selectGuildSpeedAtk,
  selectGuildAccu,
  (a, b, c, d, e, f, g): AttrSource => {
    return {
      name: "길드 버프",
      attrs: combine(a, b, c, d, e, f, g)
    }
  }
)
