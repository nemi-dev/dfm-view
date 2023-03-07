import { at1, atx, MyAttrKey } from "./attrs";

/** 힘/지능 길드버프 레벨을 해당 효과로 바꾼다. */
export const GuildStat = (level: number, atype: Atype) =>  at1(MyAttrKey[atype]["Stat"], level * 4)

/** 물/마공 길드버프 레벨을 해당 효과로 바꾼다. */
export const GuildAtk = (level: number, atype: Atype) => at1(MyAttrKey[atype]["Atk"], level * 3)

/** 물리/마법 크리티컬 길드버프 레벨을 해당 효과로 바꾼다. */
export const GuildCrit = (level: number, atype: Atype) =>  at1(MyAttrKey[atype]["Crit"], level * 3)

/** 속강 길드버프 레벨을 해당 효과로 바꾼다. */
export const GuildEl = (level: number) => atx("El", level)

/** 공격속도 길드버프 레벨을 해당 효과로 바꾼다. */
export const GuildSpeedAtk = (level: number) => at1("speed_atk", level * 0.75)

/** 캐스팅속도 길드버프 레벨을 해당 효과로 바꾼다. */
export const GuildSpeedCast = (level: number) => at1("speed_cast", level)

/** 이동속도 길드버프 레벨을 해당 효과로 바꾼다. */
export const GuildSpeedMove = (level: number) => at1("speed_move", level * 0.75)

/** 적중 길드버프 레벨을 해당 효과로 바꾼다. */
export const GuildAccu = (level: number) => at1("Accu", level * 5)

/** 힘/지능 길드 공용버프 레벨을 해당 효과로 바꾼다. */
export const GuildStatPublic = (level: number, atype: Atype) => at1(MyAttrKey[atype]["Stat"], level * 10)
