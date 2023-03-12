import { createSelector } from "@reduxjs/toolkit"
import { combine } from "../attrs"
import { RootState } from "./store"
import { GuildAccu, GuildAtk, GuildCrit, GuildEl, GuildSpeedAtk, GuildStat, GuildStatPublic } from "../guild"

export function selectGuildStat({ Guild: { StatLv }, Self: { atype }}: RootState) {
  return GuildStat(StatLv, atype)
}

export function selectGuildStatPublic({ Guild: { PublicStatLv }, Self: { atype }}: RootState) {
  return GuildStatPublic(PublicStatLv, atype)
}

export function selectGuildAtk({ Guild: { AtkLv }, Self: { atype }}: RootState) {
  return GuildAtk(AtkLv, atype)
}

export function selectGuildCrit({ Guild: { CritLv }, Self: { atype }}: RootState) {
  return GuildCrit(CritLv, atype)
}

export function selectGuildEl({ Guild: { ElLv }}: RootState) {
  return GuildEl(ElLv)
}

export function selectGuildSpeedAtk({ Guild: { SpeedAtkLv }}: RootState) {
  return GuildSpeedAtk(SpeedAtkLv)
}

export function selectGuildAccu({ Guild: { AccuLv }}: RootState) {
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
