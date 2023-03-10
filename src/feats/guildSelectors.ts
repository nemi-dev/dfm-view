import { createSelector } from "@reduxjs/toolkit"
import { combine } from "../attrs"
import { RootState } from "./store"
import { GuildAccu, GuildAtk, GuildCrit, GuildEl, GuildSpeedAtk, GuildStat, GuildStatPublic } from "../guild"

export function selectGuildStat(state: RootState) {
  const atype = state.My.Self.atype
  const StatLv = state.My.Guild.StatLv
  return GuildStat(StatLv, atype)
}

export function selectGuildStatPublic(state: RootState) {
  const atype = state.My.Self.atype
  const PublicStatLv = state.My.Guild.PublicStatLv
  return GuildStatPublic(PublicStatLv, atype)
}

export function selectGuildAtk(state: RootState) {
  const atype = state.My.Self.atype
  const AtkLv = state.My.Guild.AtkLv
  return GuildAtk(AtkLv, atype)
}

export function selectGuildCrit(state: RootState) {
  const atype = state.My.Self.atype
  const CritLv = state.My.Guild.CritLv
  return GuildCrit(CritLv, atype)
}

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
  (a, b, c, d, e, f, g) => combine(a, b, c, d, e, f, g)
)
