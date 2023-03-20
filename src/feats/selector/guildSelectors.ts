import { createSelector } from "@reduxjs/toolkit"
import { combine } from "../../attrs"
import { RootState } from "../store"
import { GuildAccu, GuildAtk, GuildCrit, GuildEl, GuildSpeedAtk, GuildStat, GuildStatPublic } from "../../guild"
import { selectClassAtype } from "./selfSelectors"

function selectGuildState(state: RootState) {
  return state.My.Guild
}

export const selectGuildStat = createSelector(
  selectGuildState, selectClassAtype,
  (guild, atype) => {
    return GuildStat(guild.StatLv, atype)
  }
)

export const selectGuildStatPublic = createSelector(
  selectGuildState, selectClassAtype,
  (guild, atype) => {
    return GuildStatPublic(guild.PublicStatLv, atype)
  }
)

export const selectGuildAtk = createSelector(
  selectGuildState, selectClassAtype,
  (guild, atype) => {
    return GuildAtk(guild.AtkLv, atype)
  }
)

export const selectGuildCrit = createSelector(
  selectGuildState, selectClassAtype,
  (guild, atype) => {
    return GuildCrit(guild.CritLv, atype)
  }
)

export function selectGuildEl({ My: { Guild: { ElLv }}}: RootState) {
  return GuildEl(ElLv)
}

export function selectGuildSpeedAtk({ My: { Guild: { SpeedAtkLv }}}: RootState) {
  return GuildSpeedAtk(SpeedAtkLv)
}

export function selectGuildAccu({ My: { Guild: { AccuLv }}}: RootState) {
  return GuildAccu(AccuLv)
}


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
      name: "길드 보너스",
      attrs: combine(a, b, c, d, e, f, g)
    }
  }
)
